import {z} from 'zod'

export const verifyCodeValidation = z.string().length(6, "Verify Code should have 6 characters")

export const verifySchema = z.object({
  verifyCode: verifyCodeValidation
}) 