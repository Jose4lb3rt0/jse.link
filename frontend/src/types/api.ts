export interface ApiResponse<T = unknown> {
    success: boolean
    message?: string
    data?: T
}

export interface ShortUrlResponse {
    shortId: string
    shortUrl: string
    originalUrl: string
    clicks: number
    expiresAt: string | null
    createdAt: string
    note?: string
}
