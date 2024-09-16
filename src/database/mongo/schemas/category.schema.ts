import { Schema } from 'mongoose'
import Mongo from '../mongo'

const schema = new Schema(
    {
        name: {
            type: String,
            index: true,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        versionKey: false,
    }
)

export default Mongo.Model('categories', schema)
