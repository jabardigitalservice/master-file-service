import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import { Config } from '../../config/config.interface'
import Jwt from '../../pkg/jwt'

class Auth {
    constructor(
        private logger: Logger,
        private http: Http,
        private config: Config
    ) {
        const jwt = new Jwt(config.jwt.access_key)
        const usecase = new Usecase(logger, config, jwt)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(this.logger, this.http, usecase)
        this.httpPublic(handler)
        this.httpPrivate(handler)
    }

    private httpPublic(handler: Handler) {
        const Router = this.http.Router()

        Router.post('/login', handler.Login())

        this.http.SetRouter('/v1/auth', Router)
    }

    private httpPrivate(handler: Handler) {
    }
}

export default Auth
