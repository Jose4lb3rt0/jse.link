import { env } from "../../config/env"
import { redirectToOriginal } from "../../controllers/url.controller"
import { rateLimit } from "../../middleware/rateLimit.middleware"
import { validateShortId } from "../../middleware/urlValidation.middleware"
import urlRoutes from "./url.routes"

const routeHandler = (app: any, prefix: string) => {
    app.use(`/${prefix}/urls`, urlRoutes)
    app.get(
        // "/:shortId([A-Za-z0-9_-]{6,20})",
        "/:shortId",
        rateLimit({
            keyPrefix: "public_redirect",
            limit: env.getRateLimitPerMinute,
            windowSeconds: 60,
            message: "Has excedido el límite de redirecciones por minuto.",
        }),
        validateShortId,
        redirectToOriginal
    )
}

export default routeHandler