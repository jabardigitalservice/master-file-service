import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Request, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { GetMeta, GetRequestParams } from '../../../../helpers/requestParams'
import {
    ValidateFormRequest,
    ValidateParams,
} from '../../../../helpers/validate'
import { Search, Store } from '../../entity/schema'
import { unlinkSync } from 'fs'
import error from '../../../../pkg/error'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    private getDataFormRequest = (req: any) => {
        return ValidateFormRequest(Store, {
            caption: req.body.caption,
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            tags: req.body.tags,
            file: req.file || {},
            compression: req.body.compression,
            quality: req.body.quality,
            convertTo: req.body.convertTo,
        })
    }

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

    public Store() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const value = this.getDataFormRequest(req)
                const result = await this.usecase.Store(value)
                this.logger.Info(statusCode[statusCode.CREATED], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.CREATED
                    ),
                })

                return res
                    .status(statusCode.CREATED)
                    .json({ data: result, message: 'CREATED' })
            } catch (error) {
                return next(error)
            } finally {
                unlinkSync(this.http.dest + '/' + req.file.filename)
            }
        }
    }

    public Search() {
        return async (req: any, res: Response, next: NextFunction) => {
            try {
                const value = ValidateFormRequest(Search, req.query)
                const isExist = await this.usecase.Search(value)
                this.logger.Info(statusCode[statusCode.OK], {
                    additional_info: this.http.AdditionalInfo(
                        req,
                        statusCode.OK
                    ),
                })
                const message = isExist ? 'Available' : 'Not Available'
                return res.status(statusCode.OK).json({ message })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
