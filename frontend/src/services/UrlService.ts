import { apiFetch, API_BASE_URL } from "@/api/apibase";
import { ApiResponse, ShortUrlResponse } from "@/types/api";

export async function createUrl(originalUrl: string) {
    return apiFetch<ApiResponse<ShortUrlResponse>>("/urls", {
        method: "POST",
        body: JSON.stringify({ originalUrl })
    })
}

export async function getOriginalUrl(shortId: string) {
    return `${API_BASE_URL}/${shortId}`
}
