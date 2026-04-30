import URL, { IURL } from "../models/url.model"
import { Request, Response } from "express"
import { ApiResponse } from "../types/Response"
import redisClient from "../config/redisClient"
import { env } from "../config/env"

type CreateShortUrlInput = {
    originalUrl: string
    ttlSeconds?: number
    ip: string
}

const getCacheKey = (shortId: string) => `redirect:${shortId}`

const saveInCache = async (shortId: string, originalUrl: string, ttlSeconds?: number) => {
    if (!redisClient.isReady) return

    try {
        const seconds = ttlSeconds && ttlSeconds > 0 ? ttlSeconds : env.defaultCacheSeconds

        if (seconds > 0) {
            await redisClient.set(getCacheKey(shortId), originalUrl, { EX: seconds })
            return
        }

        await redisClient.set(getCacheKey(shortId), originalUrl)
    } catch (error) {
        console.warn("No se pudo guardar en Redis:", error)
    }
}

export const createShortUrl = async ({ originalUrl, ttlSeconds, ip }: CreateShortUrlInput) => {
    const expiresAt =
        ttlSeconds && ttlSeconds > 0
            ? new Date(Date.now() + ttlSeconds * 1000)
            : env.defaultUrlTtlSeconds > 0
                ? new Date(Date.now() + env.defaultUrlTtlSeconds * 1000)
                : null

    const newUrl = await URL.create({
        originalUrl,
        expiresAt
    })

    const cacheSeconds = expiresAt ? Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000)) : undefined
    await saveInCache(newUrl.shortId, newUrl.originalUrl, cacheSeconds)

    console.log(
        JSON.stringify({
            event: "url_created",
            ip,
            shortId: newUrl.shortId,
            timestamp: new Date().toISOString(),
        }),
    )

    return {
        shortId: newUrl.shortId,
        shortUrl: `${env.baseUrl}/${newUrl.shortId}`,
        originalUrl: newUrl.originalUrl,
        clicks: newUrl.clicks,
        expiresAt: newUrl.expiresAt || null,
        createdAt: newUrl.createdAt,
        note: "Integrar Google Safe Browsing o VirusTotal.",
    }
}

export const findOriginalUrl = async (shortId: string, ip: string) => {
    console.log(
        JSON.stringify({
            event: "redirect_request",
            ip,
            shortId,
            timestamp: new Date().toISOString(),
        }),
    )

    if (redisClient.isReady) {
        try {
            const cachedUrl = await redisClient.get(getCacheKey(shortId))

            if (cachedUrl) {
                await URL.updateOne({ shortId }, { $inc: { clicks: 1 } })
                return cachedUrl
            }
        } catch (error) {
            console.warn("No se pudo leer Redis:", error)
        }
    }

    const foundUrl = await URL.findOne({
        shortId,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
    })

    if (!foundUrl) {
        return null
    }

    await URL.updateOne({ shortId }, { $inc: { clicks: 1 } })

    const cacheSeconds = foundUrl.expiresAt
        ? Math.max(1, Math.floor((foundUrl.expiresAt.getTime() - Date.now()) / 1000))
        : undefined

    await saveInCache(foundUrl.shortId, foundUrl.originalUrl, cacheSeconds)

    return foundUrl.originalUrl
}
