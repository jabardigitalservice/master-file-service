import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import { Config } from '../../config/config.interface'

class Images {
    constructor(
        private logger: Logger,
        private http: Http,
        private config: Config
    ) {
        const repository = new Repository(logger)
        const usecase = new Usecase(logger, repository)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(
            this.logger,
            this.http,
            usecase,
            this.config
        )
        this.httpPublic(handler)
    }

    private httpPublic(handler: Handler) {
        const Router = this.http.Router()

        Router.get('/', handler.Fetch())

        this.http.SetRouter('/v1/public/images', Router)
    }
}

export default Images
