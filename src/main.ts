import config from './config/config'
import Mongo from './database/mongo/mongo'
import Auth from './modules/auth/auth'
import Images from './modules/images/images'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const main = async () => {
    const logger = new Logger(config)
    const http = new Http(logger, config)
    await Mongo.Connect(logger, config)

    // Start Load Modules
    new Images(logger, http, config)
    new Auth(logger, http, config)
    // End Load Modules

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
