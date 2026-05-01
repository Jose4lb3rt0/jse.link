import { z } from "zod"

export const urlSchema = z.object({
    originalUrl: z
        .string()
        .url("Debe ser una URL válida")
        .min(1, "La URL no puede estar vacía"),
    ttlSeconds: z
        .string()
        .optional()
        .refine((value) => !value || !Number.isNaN(Number(value)), "La expiración no es válida"),
})

export type UrlFormData = z.infer<typeof urlSchema>
