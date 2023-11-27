import config from './config/config'
import Images from './modules/images/images'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const main = async () => {
    const logger = new Logger(config)
    const http = new Http(logger, config)

    // Start Load Modules
    new Images(logger, http, config)
    // End Load Modules

    http.Run(config.app.port.http)

    return {
        http,
    }
}

export default main()
