import dotenv from 'dotenv'
import { Config } from './config.interface'
import configValidate from './config.validate'

dotenv.config()

const env = configValidate(process.env)

const config: Config = {
    app: {
        name: env.APP_NAME,
        env: env.APP_ENV,
        port: {
            http: env.APP_PORT_HTTP,
        },
        log: env.APP_LOG,
        secret: env.APP_SECRET,
    },
    db: {
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        name: env.DB_NAME,
        auth_source: env.DB_AUTH_SOURCE,
    },
    jwt: {
        access_key: env.JWT_ACCESS_SECRET,
        algorithm: env.JWT_ALGORITHM,
    },
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        ttl: env.REDIS_TTL,
    },
    file: {
        max: Number(env.FILE_MAX) * 1024 * 1024, // MB
        type: env.FILE_TYPE.split(','),
        uri: env.FILE_URI,
    },
    gcp: {
        access_key_id: env.GCP_ACCESS_KEY_ID,
        secret_access_key: env.GCP_SECRET_ACCESS_KEY,
        bucket: env.GCP_BUCKET,
        region: env.GCP_REGION,
        endpoint: env.GCP_ENDPOINT,
    },
    generator_file: {
        url: env.GENERATOR_FILE_URL,
    },
}

export default config
