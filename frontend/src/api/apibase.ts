export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const API_URL = API_BASE_URL.startsWith('http')
    ? `${API_BASE_URL}/api`
    : `https://${API_BASE_URL}/api`;

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || ""

export class ApiClientError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApiClientError"
        this.status = status
    }
}

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const headers = new Headers(options.headers || {})
    headers.set("Content-Type", "application/json")

    if (API_KEY) {
        headers.set("x-api-key", API_KEY)
    }

    const res = await fetch(`${API_URL}${path}`, {
        headers,
        ...options
    })

    if (!res.ok) {
        let message = `Error ${res.status}`

        try {
            const errorBody = await res.json() as { message?: string }
            message = errorBody.message || message
        } catch {
            const text = await res.text()
            message = text || message
        }

        throw new ApiClientError(message, res.status)
    }

    return res.json() as Promise<T>
}
