import { apiFetch, API_BASE_URL } from "@/api/apibase";
import { ApiResponse, ShortUrlResponse } from "@/types/api";

type CreateUrlInput = {
    originalUrl: string
    ttlSeconds?: number
}

export async function createUrl({ originalUrl, ttlSeconds }: CreateUrlInput) {
    return apiFetch<ApiResponse<ShortUrlResponse>>("/urls", {
        method: "POST",
        body: JSON.stringify({
            originalUrl,
            ...(ttlSeconds ? { ttlSeconds } : {})
        })
    })
}

export async function getOriginalUrl(shortId: string) {
    return `${API_BASE_URL}/${shortId}`
}
