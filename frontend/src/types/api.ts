export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
}

export interface URL {
    _id: string
    shortId: string
    originalUrl: string
    clicks: number
    createdAt: string
    updatedAt: string
}