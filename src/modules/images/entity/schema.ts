import Joi from 'joi'
import config from '../../../config/config'
import { RegexSanitize } from '../../../helpers/regex'
import { categories } from '../../../database/constant/image'

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
    caption: Joi.string().regex(RegexSanitize).optional(),
    category: Joi.string()
        .valid(...categories)
        .required(),
    tags: Joi.array()
        .items(Joi.string().alphanum())
        .optional()
        .default([])
        .unique((a, b) => a == b, { ignoreUndefined: true }),
    title: Joi.string().regex(RegexSanitize).optional().default(null),
    description: Joi.string().regex(RegexSanitize).optional().default(null),
    file,
})
