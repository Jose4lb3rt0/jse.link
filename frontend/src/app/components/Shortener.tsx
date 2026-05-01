import { useUrls } from "@/hooks/useUrls";
import { UrlFormData, urlSchema } from "@/schemas/urlSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster } from "sonner";
import { API_BASE_URL } from "@/api/apibase";

const EXPIRATION_OPTIONS = [
    { value: "86400", label: "1 día" },
    { value: "604800", label: "7 días" },
    { value: "2592000", label: "30 días" },
]

export default function Shortener() {
    const [copied, setCopied] = useState(false)
    const { createUrl } = useUrls()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            ttlSeconds: "2592000"
        }
    })

    const onSubmit = (data: UrlFormData) => {
        createUrl.mutate({
            originalUrl: data.originalUrl,
            ttlSeconds: data.ttlSeconds ? Number(data.ttlSeconds) : undefined
        }, {
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
                <select
                    {...register("ttlSeconds")}
                    className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                >
                    {EXPIRATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value} className="bg-slate-950 text-white">
                            Expira en {option.label}
                        </option>
                    ))}
                </select>
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
                    <div className="min-w-0 flex items-center gap-2">
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 underline font-medium break-all"
                        >
                            {shortUrl}
                        </a>
                        {createUrl.data?.data?.expiresAt && (
                            <p className="text-sm text-slate-300">
                                Expira el {new Date(createUrl.data.data.expiresAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <button onClick={handleCopy} className="text-indigo-400 hover:text-white flex items-center space-x-2 transition-colors">
                        <span className="text-sm font-bold">
                            {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
                        </span>
                    </button>
                </div>
            )}

            <p className="mt-4 text-sm text-slate-400">
                Los links se eliminan automáticamente al vencer su tiempo de expiración.
            </p>

            {/* <Toaster richColors position="top-center" /> */}
        </div>
    );
}
