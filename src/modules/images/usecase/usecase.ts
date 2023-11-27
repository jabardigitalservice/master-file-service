import { RequestParams } from '../../../helpers/requestParams'
import Logger from '../../../pkg/logger'
import Repository from '../repository/mongo/repository'

class Usecase {
    constructor(private logger: Logger, private repository: Repository) {}

    public async Fetch(request: RequestParams) {
        return this.repository.Fetch(request)
    }
}

export default Usecase
