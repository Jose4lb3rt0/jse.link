"use client"

import { createUrl } from "@/services/UrlService"
import { useMutation } from "@tanstack/react-query"
import { FormEvent, useState } from "react"

export default function Home() {
  const [url, setUrl] = useState("")

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (originalUrl: string) => createUrl(originalUrl)
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutate(url)
  }

  const shortUrl = data?.data?.shortId
    ? `${window.location.origin}/${data.data.shortId}`
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
            disabled={isPending}
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 shrink-0"
          >
            {isPending ? "Acortando..." : "Acortar URL"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">Error: {(error as Error).message}</p>}

        {shortUrl && (
          <div className="mt-4">
            <p className="font-medium text-black">URL corta:</p>
            <a href={shortUrl} className="text-blue-600 underline">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
