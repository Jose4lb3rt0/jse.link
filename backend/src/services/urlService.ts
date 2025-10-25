import URL, { IURL } from "../models/url.model"
import { Request, Response } from "express"
import { ApiResponse } from "../types/Response"

export const createUrl = async (req: Request, res: Response<ApiResponse<IURL>>) => {
    try {
        const { originalUrl } = req.body

        if (!originalUrl) {
            return res.status(404).json({
                success: false,
                message: "La URL original es obligatoria.",
            })
        }

        const nuevaUrl = await URL.create({ originalUrl })
        return res.status(201).json({
            success: true,
            message: "Se ha creado la URL correctamente.",
            data: nuevaUrl
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Hubo un error al crear la URL."
        })
    }
}

export const redirectToOriginal = async (req: Request, res: Response<ApiResponse>) => {
    try {
        const { shortId } = req.params // Es parámetro, no body
        if (!shortId) return res.status(404).json({ success: false, message: "No se utilizó ningún URL." })

        const found = await URL.findOne({ shortId })
        if (!found) return res.status(404).json({ success: false, message: "URL no encontrada." })

        found.clicks++
        await found.save()

        return res.redirect(found.originalUrl)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al redirigir."
        })
    }
}