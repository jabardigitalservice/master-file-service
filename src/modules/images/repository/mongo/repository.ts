import Logger from '../../../../pkg/logger'
import { RequestParams } from '../../../../helpers/requestParams'
import imageSchema from '../../../../database/mongo/schemas/image.schema'
import { Store } from '../../entity/interface'

class Repository {
    constructor(private logger: Logger) {}

    public async Fetch({ offset, limit, keyword, category }: RequestParams) {
        const filter = {}

        if (keyword)
            Object.assign(filter, {
                title: {
                    $regex: new RegExp(keyword, 'i'),
                },
            })

        if (category)
            Object.assign(filter, {
                category: category,
            })

        const data = await imageSchema.find(filter).skip(offset).limit(limit)
        const count = await imageSchema.find(filter).count()

        return {
            data,
            count,
        }
    }

    public async Store(body: Store) {
        const schemaNew = new imageSchema(body)

        return schemaNew.save()
    }
}

export default Repository
