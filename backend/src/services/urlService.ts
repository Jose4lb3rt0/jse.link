import URL, { IURL } from "../models/url.model"
import { Request, Response } from "express"
import { ApiResponse } from "../types/Response"
import redisClient from "../config/redisClient"

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

        await redisClient.set(nuevaUrl.shortId, nuevaUrl.originalUrl) // <-- key: value

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

        // REDIS CACHÉ
        const cachedURL = await redisClient.get(shortId) // agarrar la key
        if (cachedURL) {
            console.log(`⚡ URL obtenida desde Redis: ${cachedURL}`)
            return res.redirect(cachedURL)
        }

        // BUSQUEDA EN MONGO
        const found = await URL.findOne({ shortId })
        if (!found) return res.status(404).json({ success: false, message: "URL no encontrada." })

        found.clicks++
        await found.save()

        // SAVE EN REDIS
        await redisClient.set(shortId, found.originalUrl)

        return res.redirect(found.originalUrl)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al redirigir."
        })
    }
}