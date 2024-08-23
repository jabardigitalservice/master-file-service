import { readFileSync } from 'fs'
import { RequestParams } from '../../../helpers/requestParams'
import Logger from '../../../pkg/logger'
import { File, Store } from '../entity/interface'
import Repository from '../repository/mongo/repository'
import S3 from '../../../external/s3'
import { CustomPathFile } from '../../../helpers/file'
import { getSlug } from '../../../helpers/slug'
import {
    RegexContentTypeImageNotCompressed,
    RegexExtensionImage,
} from '../../../helpers/regex'
import FileGenerator from '../../../external/fileGenerator'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private s3: S3,
        private fileGenerator: FileGenerator
    ) {}

    public async Fetch(request: RequestParams) {
        return this.repository.Fetch(request)
    }

    public async Store(body: Store) {
        const hasImageCompression =
            body.compression &&
            !RegexContentTypeImageNotCompressed.test(body.file.mimetype)

        body.title = body.file.originalname.replace(RegexExtensionImage, '')

        if (hasImageCompression)
            Object.assign(
                body.file,
                this.getFileImage(body.title, body.file, body.convertTo)
            )

        const category = getSlug(body.category)
        const newPath = CustomPathFile(category, body.file)
        const source = readFileSync(body.file.path)

        await this.s3.Upload(source, newPath, body.file.mimetype)
        body.file.path = newPath

        const existImage = await this.repository.FindByPath(newPath)

        const result = existImage
            ? existImage
            : await this.repository.Store(body)

        const { uri, path } = result.file

        if (hasImageCompression)
            this.updateMetaImage(
                uri,
                path,
                body.quality,
                body.convertTo,
                result.id
            )

        return result
    }

    private getFileImage(title: string, file: File, convertTo: string) {
        const originalname = title

        file.filename = originalname
        file.mimetype = `image/${convertTo}`
        file.originalname = originalname + '.' + convertTo

        return file
    }

    private async updateMetaImage(
        uri: string,
        path: string,
        quality: number,
        convertTo: string,
        id: string
    ) {
        try {
            const size = await this.fileGenerator.ImageCompression(
                uri,
                quality,
                convertTo,
                path
            )
            await this.repository.UpdateSize(id, size)
        } catch (error: any) {
            this.logger.Error(error.message)
        }
    }
}

export default Usecase
