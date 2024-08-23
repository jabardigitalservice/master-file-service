import axios from 'axios'
import { Config } from '../config/config.interface'
import Logger from '../pkg/logger'
import S3 from './s3'
import error from '../pkg/error'

class FileGenerator {
    constructor(
        private config: Config,
        private s3: S3,
        private logger: Logger
    ) {}

    public async ImageCompression(
        uri: string,
        quality: number,
        convertTo: string,
        path: string
    ) {
        try {
            const { url, size } = await this.send('convert-image', {
                url: uri,
                quality,
                convertTo,
            })

            const { data, headers } = await axios.get(url, {
                responseType: 'arraybuffer',
            })

            const contentType = headers['content-type'] || ''

            await this.s3.Upload(data, path, contentType)
            this.logger.Info('process compress image success', {
                category: 'compress-image',
            })
            return size
        } catch (error: any) {
            this.logger.Error(
                'process compress image failed: ' + error.message,
                { category: 'compress-image' }
            )
            throw error
        }
    }

    private async send(path: string, body: object) {
        try {
            const { data } = await axios.post(
                this.config.generator_file.url + '/' + path,
                body
            )

            return data.data
        } catch (err: any) {
            const message = err.message

            this.logger.Error(message, {
                category: FileGenerator.name,
            })

            throw new error(err.status, message)
        }
    }
}

export default FileGenerator
