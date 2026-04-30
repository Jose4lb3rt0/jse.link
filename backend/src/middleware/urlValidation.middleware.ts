import { NextFunction, Request, Response } from "express"
import { env } from "../config/env"

const blockedProtocols = ["javascript:", "data:", "file:"]
const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0"]

const isPrivateIpv4 = (hostname: string) => {
    const parts = hostname.split(".").map(Number)
    if (parts.length !== 4 || parts.some(Number.isNaN)) return false

    const a = parts[0] ?? -1
    const b = parts[1] ?? -1

    return a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
}

const isBlacklistedDomain = (hostname: string) => {
    return env.domainBlacklist.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`))
}

export const validateCreateUrl = (req: Request, res: Response, next: NextFunction) => {
    const originalUrl = typeof req.body?.originalUrl === "string"
        ? req.body.originalUrl.trim()
        : ""

    const ttlSeconds = req.body?.ttlSeconds

    if (!originalUrl) {
        return res.status(400).json({
            success: false,
            message: "La URL original es obligatoria.",
        })
    }

    if (originalUrl.length > 2048) {
        return res.status(400).json({
            success: false,
            message: "La URL no puede superar 2048 caracteres.",
        })
    }

    let parsedUrl: URL

    try {
        parsedUrl = new URL(originalUrl)
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "La URL proporcionada no es válida."
        })
    }

    if (blockedProtocols.includes(parsedUrl.protocol)) {
        return res.status(400).json({
            success: false,
            message: "El protocolo no está permitido."
        })
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
            success: false,
            message: "Solo se permiten URLs http y https."
        })
    }

    const hostname = parsedUrl.hostname.toLowerCase()

    if (blockedHosts.includes(hostname) || isPrivateIpv4(hostname)) {
        return res.status(400).json({
            success: false,
            message: "No se permiten hosts locales o privados."
        })
    }

    if (parsedUrl.username || parsedUrl.password) {
        return res.status(400).json({
            success: false,
            message: "No se permiten credenciales dentro de la URL."
        })
    }

    if (isBlacklistedDomain(hostname)) {
        return res.status(400).json({
            success: false,
            message: "Este dominio está bloqueado."
        })
    }

    if (ttlSeconds !== undefined) {
        if (!Number.isInteger(ttlSeconds) || ttlSeconds <= 0) {
            return res.status(400).json({
                success: false,
                message: "ttlSeconds debe ser un número entero positivo."
            })
        }

        if (ttlSeconds > env.maxUrlTtlSeconds) {
            return res.status(400).json({
                success: false,
                message: `ttlSeconds no puede ser mayor a ${env.maxUrlTtlSeconds}.`
            })
        }
    }

    req.body.originalUrl = parsedUrl.toString()
    next()
}

export const validateShortId = (req: Request, res: Response, next: NextFunction) => {
    const shortId = req.params.shortId

    if (!shortId || !/^[A-Za-z0-9_-]{6,20}$/.test(shortId)) {
        return res.status(400).json({
            success: false,
            message: "El shortId no es válido."
        })
    }

    next()
}
