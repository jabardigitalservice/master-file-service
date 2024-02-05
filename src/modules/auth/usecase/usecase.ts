import Logger from '../../../pkg/logger'
import { Login } from '../entity/interface'
import { Config } from '../../../config/config.interface'
import Jwt from '../../../pkg/jwt'
import error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import { Translate } from '../../../helpers/translate'

class Usecase {
    constructor(
        private logger: Logger,
        private config: Config,
        private jwt: Jwt
    ) {}

    public async Login(body: Login) {
        if (body.password !== this.config.app.secret)
            throw new error(
                statusCode.UNAUTHORIZED,
                Translate('login_failed', {})
            )

        const access_token = this.jwt.Sign({ app: this.config.app.name })
        return {
            access_token,
        }
    }
}

export default Usecase
