import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { Config } from '../config/config.interface'
import error from '../pkg/error'

// Google Cloud Storage through its S3-compatible XML API, authenticated with an HMAC key
class GCS {
    private client: S3Client
    constructor(private config: Config) {
        this.client = new S3Client({
            region: config.gcp.region,
            endpoint: config.gcp.endpoint,
            credentials: {
                accessKeyId: config.gcp.access_key_id,
                secretAccessKey: config.gcp.secret_access_key,
            },
        })
    }

    public async Upload(source: Buffer, path: string, ContentType: string) {
        try {
            const params = {
                Bucket: this.config.gcp.bucket,
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
                Bucket: this.config.gcp.bucket,
                Key: path,
            })
            const result = await this.client.send(command)
            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }

    // GCS does not support the S3 multi-object delete API, so objects are deleted one by one
    public async Deletes(paths: string[]) {
        try {
            const result = await Promise.all(
                paths.map((Key) =>
                    this.client.send(
                        new DeleteObjectCommand({
                            Bucket: this.config.gcp.bucket,
                            Key,
                        })
                    )
                )
            )
            return result
        } catch (err: any) {
            const code = err.$metadata.httpStatusCode as number
            throw new error(code, 'cloud storage: ' + err.message)
        }
    }
}

export default GCS
