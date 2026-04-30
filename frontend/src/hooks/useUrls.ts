import { useMutation } from "@tanstack/react-query";
import { createUrl as createUrlService } from "@/services/UrlService";
import { toast } from "sonner";

export function useUrls() {
    const createUrl = useMutation({
        mutationFn: (originalUrl: string) => createUrlService(originalUrl),
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
