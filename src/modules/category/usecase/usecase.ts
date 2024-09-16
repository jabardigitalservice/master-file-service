import { RequestParams } from '../../../helpers/requestParams'
import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Store } from '../entity/interface'
import Repository from '../repository/mongo/repository'

class Usecase {
    constructor(private logger: Logger, private repository: Repository) {}

    public async Fetch(request: RequestParams) {
        return this.repository.Fetch(request)
    }

    public async Store(body: Store) {
        const item = await this.repository.FindUnique(body.name)
        if (item)
            throw new error(statusCode.BAD_REQUEST, 'Category Already Exist')
        const result = await this.repository.Store(body)

        return result
    }
}

export default Usecase
