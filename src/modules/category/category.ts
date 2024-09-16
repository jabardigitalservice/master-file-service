import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import Repository from './repository/mongo/repository'

class Category {
    private usecase: Usecase
    constructor(
        private logger: Logger,
    ) {
        const repository = new Repository(logger)
        const usecase = new Usecase(logger, repository)
        this.usecase = usecase
    }

    public loadHttp(http: Http) {
        const handler = new Handler(this.logger, http, this.usecase)
        this.httpPrivate(http, handler)
    }

    private httpPrivate(http: Http, handler: Handler) {
        const Router = http.Router()

        Router.post('/', handler.Store())
        Router.get('/', handler.Fetch())

        http.SetRouter('/v1/categories', Router)
    }
}

export default Category
