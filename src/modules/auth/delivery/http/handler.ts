import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { Config } from '../../../../config/config.interface'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { Login } from '../../entity/schema'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Login() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const value = ValidateFormRequest(Login, req.body)
                const result = await this.usecase.Login(value)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return res.status(statusCode.OK).json({ data: result })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
