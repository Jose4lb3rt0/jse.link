import { apiFetch } from "@/api/apibase";
import { ApiResponse, URL } from "@/types/api";

export async function createUrl(originalUrl: string) {
    return apiFetch<ApiResponse<URL>>('/url', { method: 'POST', body: JSON.stringify({ originalUrl }) })
}

export async function getOriginalUrl(shortId: string) {
    return apiFetch<ApiResponse<URL>>(`/url/${shortId}`)
}