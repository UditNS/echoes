// this schema is for the 6 digit otp which is a string
import * as z from 'zod'

export const verifySchema = z.object({
    code: z.string().length(6, {message: "Verification code must be 6 digit long"})
})