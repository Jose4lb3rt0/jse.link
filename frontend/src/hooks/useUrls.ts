import { useMutation } from "@tanstack/react-query";
import { createUrl as createUrlService } from "@/services/UrlService";
import { ApiResponse, URL } from "@/types/api";
import { toast } from "sonner";

export function useUrls() {
    const createUrl = useMutation({
        mutationFn: (originalUrl: string) => createUrlService(originalUrl),
        onSuccess: (data) => { toast.success("URL creada con éxito.") },
        onError: (error) => { toast.error(`Error: ${error.message}`) },
    })

    return {
        createUrl,
    }
}