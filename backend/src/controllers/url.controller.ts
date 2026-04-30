import { NextFunction, Request, Response } from "express"
import { createShortUrl, findOriginalUrl } from "../services/urlService"
import { getClientIp } from "../middleware/rateLimit.middleware"

export const createUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = await createShortUrl({
            originalUrl: req.body.originalUrl,
            ttlSeconds: req.body.ttlSeconds,
            ip: getClientIp(req)
        })

        return res.status(201).json({
            success: true,
            message: "URL creada correctamente.",
            data: url,
        })
    } catch (error) {
        next(error)
    }
}

export const redirectToOriginal = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shortId = req.params.shortId

        if (!shortId) {
            return res.status(400).json({
                success: false,
                message: "Debes enviar un shortId.",
            })
        }

        const originalUrl = await findOriginalUrl(shortId, getClientIp(req))

        if (!originalUrl) {
            return res.status(404).json({
                success: false,
                message: "URL no encontrada o expirada.",
            })
        }

        return res.redirect(originalUrl)
    } catch (error) {
        next(error)
    }
}