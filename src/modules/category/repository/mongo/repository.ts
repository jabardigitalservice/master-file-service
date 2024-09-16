import Logger from '../../../../pkg/logger'
import { RequestParams } from '../../../../helpers/requestParams'
import categorySchema from '../../../../database/mongo/schemas/category.schema'
import { Store } from '../../entity/interface'

class Repository {
    constructor(private logger: Logger) {}

    public async Fetch({
        offset,
        limit,
        keyword,
        sort_order,
        sort_by,
    }: RequestParams) {
        const filter = {}
        const sort = {}

        if (keyword)
            Object.assign(filter, {
                name: {
                    $regex: new RegExp(keyword, 'i'),
                },
            })

        if (['created_at', 'name'].includes(sort_by)) {
            Object.assign(sort, {
                [sort_by]: sort_order,
            })
        }

        const data = await categorySchema
            .find(filter)
            .sort(sort)
            .skip(offset)
            .limit(limit)
        const count = await categorySchema.find(filter).count()

        return {
            data,
            count,
        }
    }

    public async Store(body: Store) {
        const schemaNew = new categorySchema(body)

        return schemaNew.save()
    }

    public async FindUnique(name: string) {
        const result = await categorySchema.findOne({
            name,
        })

        return result
    }
}

export default Repository
