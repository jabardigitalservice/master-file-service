import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { GetMeta, GetRequestParams } from '../../../../helpers/requestParams'
import { Config } from '../../../../config/config.interface'
import { GetFileUrl } from '../../../../helpers/url'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase,
        private config: Config
    ) {}

    public Fetch() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const request = GetRequestParams(req.query)
                const { data, count } = await this.usecase.Fetch(request)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })

                return res.json({ data, meta: GetMeta(request, count) })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
