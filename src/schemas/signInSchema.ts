import * as z from 'zod'

export const signInSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password length must be 6 characters long"})
})