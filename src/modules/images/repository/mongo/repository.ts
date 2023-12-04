import Logger from '../../../../pkg/logger'
import { RequestParams } from '../../../../helpers/requestParams'
import imageSchema from '../../../../database/mongo/schemas/image.schema'

class Repository {
    constructor(private logger: Logger) {}

    public async Fetch({ offset, limit }: RequestParams) {
        const data = await imageSchema.find().skip(offset).limit(limit)
        const count = await imageSchema.find().count()

        return {
            data,
            count,
        }
    }
}

export default Repository
