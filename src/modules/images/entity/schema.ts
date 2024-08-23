import Joi from 'joi'
import config from '../../../config/config'
import { RegexSanitize } from '../../../helpers/regex'

const file = Joi.object({
    path: Joi.string().required(),
    size: Joi.number().max(config.file.max).required(),
    mimetype: Joi.string()
        .valid(...config.file.type)
        .required(),
    originalname: Joi.string().regex(RegexSanitize).required(),
    filename: Joi.string().required(),
})

export const Store = Joi.object({
    category: Joi.string().alphanum().required(),
    title: Joi.string().regex(RegexSanitize).optional().default(null),
    description: Joi.string().regex(RegexSanitize).optional().default(null),
    compression: Joi.boolean().optional().default(false),
    quality: Joi.number().min(1).max(100).when('compression', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    convertTo: Joi.string().valid('jpeg', 'webp').when('compression', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    file,
})

export const Search = Joi.object({
    category: Joi.string().alphanum().required(),
    filename: Joi.string().regex(RegexSanitize).required(),
})
