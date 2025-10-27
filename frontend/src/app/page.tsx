"use client"

import { useUrls } from "@/hooks/useUrls"
import { FormEvent, useState } from "react"
import { Toaster } from "sonner"

export default function Home() {
  const [url, setUrl] = useState("")
  const { createUrl } = useUrls()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    createUrl.mutate(url)
  }

  const shortUrl = createUrl.data?.data?.shortId
    ? `${API_BASE_URL}/api/urls/${createUrl.data.data.shortId}`
    : null

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto bg-white p-5 rounded-md">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="border px-2 py-1 rounded text-black w-full"
          />
          <button
            disabled={createUrl.isPending}
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 shrink-0"
          >
            {createUrl.isPending ? "Acortando..." : "Acortar URL"}
          </button>
        </form>

        {createUrl.error && <p className="text-red-500 mt-4">Error: {(createUrl.error as Error).message}</p>}

        {shortUrl && (
          <div className="mt-4">
            <p className="font-medium text-black">URL corta:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {shortUrl}
            </a>

          </div>
        )}
      </div>
      <Toaster />
    </div>
  )
}
