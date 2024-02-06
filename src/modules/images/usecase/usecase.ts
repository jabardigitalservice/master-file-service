import { readFileSync } from 'fs'
import { RequestParams } from '../../../helpers/requestParams'
import Logger from '../../../pkg/logger'
import { Store } from '../entity/interface'
import Repository from '../repository/mongo/repository'
import S3 from '../../../external/s3'
import { CustomPathFile } from '../../../helpers/file'
import { getSlug } from '../../../helpers/slug'
import { RegexExtensionImage } from '../../../helpers/regex'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private s3: S3
    ) {}

    public async Fetch(request: RequestParams) {
        return this.repository.Fetch(request)
    }

    public async Store(body: Store) {
        const newPath = CustomPathFile(getSlug(body.category), body.file)
        body.title = body.title ?? body.file.originalname.replace(RegexExtensionImage, '')
        body.tags.push(body.title, body.category)
        const source = readFileSync(body.file.path)

        await this.s3.Upload(source, newPath, body.file.mimetype)
        body.file.path = newPath
        const result = await this.repository.Store(body)

        return result
    }
}

export default Usecase
