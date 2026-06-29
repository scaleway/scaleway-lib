import { z } from 'zod'
import type { Iamv1alpha1 } from './types/iam/index'

type TransformJWT = Omit<Iamv1alpha1.JWT, 'createdAt' | 'updatedAt' | 'expiresAt'> & {
  // As we stock de jwt into a cookie
  createdAt?: string | Date
  updatedAt?: string | Date
  expiresAt?: string | Date
}

type ValidateJWTSchema = {
  jwt?: TransformJWT
  token: string
  renewToken: string
}

export const jwtSchema: z.ZodType<ValidateJWTSchema> = z.object({
  jwt: z.object({
    audienceId: z.string().min(1),
    createdAt: z.union([z.string().min(1), z.date()]).optional(),
    expiresAt: z.union([z.string().min(1), z.date()]).optional(),
    ip: z.string().min(1),
    issuerId: z.string().min(1),
    jti: z.string().min(1),
    updatedAt: z.union([z.string().min(1), z.date()]).optional(),
    userAgent: z.string().min(1),
  }),
  renewToken: z.string().min(1),
  token: z.string().min(1),
})

export const audienceIdSchema = z.object({
  audienceId: z.string().min(1),
})
