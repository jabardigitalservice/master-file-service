import { Schema } from 'mongoose'
import Mongo from '../mongo'

const schema = new Schema(
    {
        file: {
            path: String,
            size: Number,
            mimetype: String,
            originalname: String,
            filename: String,
            uri: String,
        },
        caption: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
            default: null,
        },
        tags: {
            type: [String],
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

export default Mongo.Model('images', schema)
