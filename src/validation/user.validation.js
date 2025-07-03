const z = require('zod')

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name is required." }).max(100),
    email: z.string().email({ message: "Invalid email format." }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(/[A-Z]/, { message: 'Must have uppercase' })
        .regex(/[a-z]/, { message: 'Must have lowercase' })
        .regex(/\d/, { message: 'Must have number' })
        .regex(/[^A-Za-z0-9]/, { message: 'Must have special character' }),
    isAdmin: z.boolean().optional()
})

const loginSchema = z.object({
    email: z.string().trim().email({ message: "Invalid email format." }),
    password: z.string().trim().min(8, { message: 'Password must be at least 8 characters' })
})

module.exports = {
    signupSchema,
    loginSchema
}