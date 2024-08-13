import Logger from '../../../../pkg/logger'
import { RequestParams } from '../../../../helpers/requestParams'
import imageSchema from '../../../../database/mongo/schemas/image.schema'
import { Store } from '../../entity/interface'

class Repository {
    constructor(private logger: Logger) {}

    public async Fetch({
        offset,
        limit,
        keyword,
        category,
        sort_order,
        sort_by,
    }: RequestParams) {
        const filter = {}
        const sort = {}

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

        if (['created_at'].includes(sort_by)) {
            Object.assign(sort, {
                [sort_by]: sort_order,
            })
        }

        const data = await imageSchema
            .find(filter)
            .sort(sort)
            .skip(offset)
            .limit(limit)
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
