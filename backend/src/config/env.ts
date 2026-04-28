import { config } from "dotenv"

config()

const parseNumber = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback
    const parsed = Number(value)

    return Number.isFinite(parsed)
        ? parsed
        : fallback
}

const ensureTrailingSeconds = (ttlSeconds?: number): number | undefined => {
    if (!ttlSeconds || ttlSeconds <= 0) return undefined
    return ttlSeconds
}

const mongoUri =
    process.env.MONGODB_URI ||
    `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME || ""}?retryWrites=true&w=majority&appName=${process.env.DATABASE_CLUSTER || "Cluster0"}`

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: parseNumber(process.env.PORT, 5000),
    baseUrl: process.env.BASE_URL || `http://localhost:${parseNumber(process.env.PORT, 5000)}`,
    trustProxy: process.env.TRUST_PROXY === "true",
    mongoUri,
    redisUrl:
        process.env.REDIS_URL ||
        `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || "6379"}`,
    apiKey: process.env.API_KEY || "",
    redirectCacheTtlSeconds: parseNumber(process.env.REDIRECT_CACHE_TTL_SECONDS, 3600),
    postRateLimitPerMinute: parseNumber(process.env.POST_RATE_LIMIT_PER_MINUTE, 10),
    redirectRateLimitPerMinute: parseNumber(process.env.REDIRECT_RATE_LIMIT_PER_MINUTE, 100),
    demoQuotaPerWindow: parseNumber(process.env.DEMO_URL_QUOTA_MAX, 50),
    demoQuotaWindowSeconds: parseNumber(process.env.DEMO_URL_QUOTA_WINDOW_SECONDS, 86400),
    defaultUrlTtlSeconds: ensureTrailingSeconds(parseNumber(process.env.DEFAULT_URL_TTL_SECONDS, 0)),
    maxCustomUrlTtlSeconds: parseNumber(process.env.MAX_URL_TTL_SECONDS, 2592000),
    domainBlacklist: (process.env.DOMAIN_BLACKLIST || "localhost,example-malware.test")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
}

export const hasApiKeyConfigured = (): boolean => Boolean(env.apiKey)