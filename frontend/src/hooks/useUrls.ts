import { useMutation } from "@tanstack/react-query";
import { createUrl as createUrlService } from "@/services/UrlService";
import { toast } from "sonner";

type CreateUrlInput = {
    originalUrl: string
    ttlSeconds?: number
}

export function useUrls() {
    const createUrl = useMutation({
        mutationFn: (input: CreateUrlInput) => createUrlService(input),
        onSuccess: () => {
            toast.success("URL creada con éxito.")
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    return {
        createUrl,
    }
}
