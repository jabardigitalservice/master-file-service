import config from '../../config/config'
import { GetFileUrl } from '../../helpers/url'
import Logger from '../../pkg/logger'
import { ListLogo } from '../constant/logo'
import Mongo from '../mongo/mongo'
import imageSchema from '../mongo/schemas/image.schema'

const run = async () => {
    const logger = new Logger(config)
    await Mongo.Connect(logger, config)

    const image = imageSchema

    const images = []
    for (const { title, filename } of ListLogo) {
        const path = 'logos/' + filename
        const category = 'logo'

        const data = {
            title,
            file: {
                path,
                size: 0,
                mimetype: 'image/svg+xml',
                originalname: filename,
                filename,
                uri: GetFileUrl(config.file.uri, path),
            },
            category,
            tags: [title, category],
        }

        images.push(image.updateOne({ title }, data, { upsert: true }))
    }

    await Promise.all(images)

    await Mongo.Disconnect()
}

export default run()
