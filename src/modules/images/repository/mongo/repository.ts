import Logger from '../../../../pkg/logger'
import { RequestParams } from '../../../../helpers/requestParams'
import { ListLogo } from '../../../../database/constant/logo'

class Repository {
    constructor(private logger: Logger) {}

    public async Fetch(request: RequestParams) {
        const data = ListLogo
        return {
            data,
            count: data.length,
        }
    }
}

export default Repository
