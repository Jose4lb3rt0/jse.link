import { z } from "zod"

export const urlSchema = z.object({
    originalUrl: z
        .string()
        .url("Debe ser una URL válida")
        .min(1, "La URL no puede estar vacía"),
})

export type UrlFormData = z.infer<typeof urlSchema>
