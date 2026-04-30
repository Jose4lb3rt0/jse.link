import { NextFunction, Request, Response } from "express"
import redisClient from "../config/redisClient"

type LimitOptions = {
    keyPrefix: string
    limit: number
    windowSeconds: number
    message: string
}

const memoryStore = new Map<string, { count: number, expiresAt: number }>()

const increaseMemoryCounter = (key: string, windowSeconds: number) => {
    const now = Date.now()
    const saved = memoryStore.get(key)

    if (!saved || saved.expiresAt <= now) {
        const expiresAt = now + windowSeconds * 1000
        memoryStore.set(key, { count: 1, expiresAt })
        return { count: 1, retryAfter: windowSeconds }
    }

    saved.count += 1
    memoryStore.set(key, saved)

    return {
        count: saved.count,
        retryAfter: Math.max(1, Math.ceil((saved.expiresAt - now) / 1000)),
    }
}

const increaseCounter = async (key: string, windowSeconds: number) => {
    if (!redisClient.isReady) {
        return increaseMemoryCounter(key, windowSeconds)
    }

    try {
        const count = await redisClient.incr(key)

        if (count === 1) {
            await redisClient.expire(key, windowSeconds)
        }

        const retryAfter = await redisClient.ttl(key)
        return { count, retryAfter: retryAfter > 0 ? retryAfter : windowSeconds }
    } catch {
        return increaseMemoryCounter(key, windowSeconds)
    }
}

export const getClientIp = (req: Request) => {
    return (req.ip || req.socket.remoteAddress || "unknown").replace("::ffff:", "")
}

export const rateLimit = ({ keyPrefix, limit, windowSeconds, message }: LimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = getClientIp(req)
        const key = `${keyPrefix}:${ip}`
        const result = await increaseCounter(key, windowSeconds)

        res.setHeader("X-RateLimit-Limit", String(limit))
        res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - result.count)))

        if (result.count > limit) {
            res.setHeader("Retry-After", String(result.retryAfter))

            return res.status(429).json({
                success: false,
                message,
                data: {
                    retryAfterSeconds: result.retryAfter,
                },
            })
        }

        next()
    }
}

export const demoCreateLimit = (limit: number, windowSeconds: number) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const ip = getClientIp(req)
        const key = `demo_create_limit:${ip}`
        const result = await increaseCounter(key, windowSeconds)

        if (result.count > limit) {
            return res.status(429).json({
                success: false,
                message: `Se alcanzó el máximo de ${limit} URLs creadas para esta demo.`,
                data: {
                    retryAfterSeconds: result.retryAfter,
                },
            })
        }

        next()
    }
}