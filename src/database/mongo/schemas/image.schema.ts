import { Schema } from 'mongoose'
import Mongo from '../mongo'
import config from '../../../config/config'

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
        },
        category: {
            type: String,
        },
        title: {
            type: String,
        },
        description: {
            type: String,
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

schema.pre('save', function (next) {
    if (this.file?.path) this.file.uri = `${config.file.uri}${this.file.path}`
    next()
})

export default Mongo.Model('images', schema)
