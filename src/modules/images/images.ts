import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'
import { Config } from '../../config/config.interface'
import S3 from '../../external/s3'
import FileGenerator from '../../external/fileGenerator'

class Images {
    constructor(
        private logger: Logger,
        private http: Http,
        private config: Config
    ) {
        const s3 = new S3(config)
        const fileGenerator = new FileGenerator(config, s3, logger)
        const repository = new Repository(logger)
        const usecase = new Usecase(logger, repository, s3, fileGenerator)
        this.loadHttp(usecase)
    }

    private loadHttp(usecase: Usecase) {
        const handler = new Handler(this.logger, this.http, usecase)
        this.httpPublic(handler)
        this.httpPrivate(handler)
    }

    private httpPublic(handler: Handler) {
        const Router = this.http.Router()

        Router.get('/', handler.Fetch())

        this.http.SetRouter('/v1/public/images', Router)
    }

    private httpPrivate(handler: Handler) {
        const Router = this.http.Router()

        Router.post('/', this.http.Upload('file'), handler.Store())
        Router.get('/', handler.Search())

        this.http.SetRouter('/v1/images', Router)
    }
}

export default Images
