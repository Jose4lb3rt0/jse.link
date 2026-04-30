import { useUrls } from "@/hooks/useUrls";
import { UrlFormData, urlSchema } from "@/schemas/urlSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { API_BASE_URL } from "@/api/apibase";

export default function Shortener() {
    const [copied, setCopied] = useState(false)
    const { createUrl } = useUrls()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema)
    })

    const onSubmit = (data: UrlFormData) => {
        createUrl.mutate(data.originalUrl, {
            onSuccess: () => {
                reset()
                setCopied(false)
            }
        })
    }

    const shortUrl = createUrl.data?.data?.shortId
        ? `${API_BASE_URL}/${createUrl.data.data.shortId}`
        : null

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl!)
            setCopied(true)

            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Falló al copiar: ', error);
        }
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative flex-grow min-w-0">
                    <input
                        type="url"
                        {...register("originalUrl")}
                        placeholder="Pega tu URL aquí..."
                        required
                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
                <button
                    disabled={createUrl.isPending}
                    type="submit"
                    className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap"
                >
                    {createUrl.isPending ? "Acortando..." : "Acortar URL"}
                </button>
            </form>

            {errors.originalUrl && <p className="text-red-500 mt-4">Error: {errors.originalUrl.message}</p>}
            {createUrl.error && !errors.originalUrl && (
                <p className="text-red-500 mt-4">Error: {createUrl.error.message}</p>
            )}

            {shortUrl && (
                <div className="flex mt-5 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-6 py-4">
                    <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 underline font-medium break-all"
                    >
                        {shortUrl}
                    </a>
                    <button onClick={handleCopy} className="text-indigo-400 hover:text-white flex items-center space-x-2 transition-colors">
                        <span className="text-sm font-bold">
                            {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
                        </span>
                    </button>
                </div>
            )}

            <Toaster richColors position="top-center" />
        </div>
    );
}
