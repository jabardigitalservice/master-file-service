import Joi from 'joi'
import { RegexSubdomain } from '../../../helpers/regex'

export const Store = Joi.object({
    name: Joi.string().regex(RegexSubdomain).required(),
})
