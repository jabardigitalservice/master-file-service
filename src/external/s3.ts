import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3'
import { Config } from '../config/config.interface'
import error from '../pkg/error'

class S3 {
    private client: S3Client
    constructor(private config: Config) {
        this.client = new S3Client({
            region: config.aws.region,
            credentials: {
                accessKeyId: config.aws.access_key_id,
                secretAccessKey: config.aws.secret_access_key,
            },
        })
    }

    public async Upload(source: Buffer, path: string, ContentType: string) {
        try {
            const params = {
                Bucket: this.config.aws.bucket,
                Key: path,
                Body: source,
                ContentType,
                CacheControl: 'no-cache',
            }
            const command = new PutObjectCommand(params)
            const result = await this.client.send(command)

            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }

    public async Delete(path: string) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.config.aws.bucket,
                Key: path,
            })
            const result = await this.client.send(command)
            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }

    public async Deletes(paths: string[]) {
        try {
            const command = new DeleteObjectsCommand({
                Bucket: this.config.aws.bucket,
                Delete: {
                    Objects: paths.map((Key) => {
                        return { Key }
                    }),
                },
            })
            const result = await this.client.send(command)
            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }
}

export default S3
