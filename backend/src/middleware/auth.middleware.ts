import { NextFunction, Request, Response } from "express"
import { env } from "../config/env"

export const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    if (!env.apiKey) {
        return res.status(503).json({
            success: false,
            message: "El servidor no tiene API key configurada.",
        })
    }

    const apiKey =
        req.header("x-api-key") ||
        req.header("authorization")?.replace(/^Bearer\s+/i, "")

    if (!apiKey || apiKey !== env.apiKey) {
        return res.status(401).json({
            success: false,
            message: "API key inválida o ausente. Usa el header x-api-key o Authorization Bearer.",
        })
    }

    next()
}
