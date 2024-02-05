export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
        secret: string
    }
    db: {
        host: string
        port: number
        username: string
        password: string
        name: string
        auth_source: string
    }
    jwt: {
        access_key: string
        algorithm: string
    }
    redis: {
        host: string
        port: number
        ttl: number
    }
    file: {
        max: number
        type: string[]
        uri: string
    }
    aws: {
        access_key_id: string
        secret_access_key: string
        bucket: string
        region: string
    }
}
