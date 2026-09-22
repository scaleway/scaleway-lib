import { z } from 'zod'
import type { Iamv1alpha1 } from './types/iam/index'

type TransformJWT = Omit<Iamv1alpha1.JWT, 'createdAt' | 'updatedAt' | 'expiresAt' | 'srn'> & {
  // As we stock de jwt into a cookie
  createdAt?: string | Date
  updatedAt?: string | Date
  expiresAt?: string | Date
  srn?: string
}

type ValidateJWTSchema = {
  jwt?: TransformJWT
  token: string
  renewToken: string
}

const dateScheme = z.union([z.string().min(1), z.date()])

const rawJwtSchema: z.ZodType<ValidateJWTSchema> = z.object({
  jwt: z.object({
    audienceId: z.string().min(1),
    createdAt: dateScheme.optional(),
    expiresAt: dateScheme.optional(),
    ip: z.string().min(1),
    issuerId: z.string().min(1),
    jti: z.string().min(1),
    updatedAt: dateScheme.optional(),
    userAgent: z.string().min(1),
    srn: z.string().optional(),
  }),
  renewToken: z.string().min(1),
  token: z.string().min(1),
})

export const jwtSchema = z.compile(rawJwtSchema)

export const audienceIdSchema = z.compile(
  z.object({
    audienceId: z.string().min(1),
  }),
)
