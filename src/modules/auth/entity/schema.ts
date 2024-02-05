import Joi from 'joi'

export const Login = Joi.object({
    password: Joi.string().required(),
})
