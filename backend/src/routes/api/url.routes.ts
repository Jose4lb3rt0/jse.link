import { Router } from "express"
import { requireApiKey } from "../../middleware/auth.middleware"
import { demoCreateLimit, rateLimit } from "../../middleware/rateLimit.middleware"
import { env } from "../../config/env"
import { validateCreateUrl } from "../../middleware/urlValidation.middleware"
import { createUrl } from "../../controllers/url.controller"

const router = Router()

router.post(
    "/",
    requireApiKey,
    rateLimit({
        keyPrefix: "post_urls",
        limit: env.postRateLimitPerMinute,
        windowSeconds: 60,
        message: "Has excedido el límite de creación de URLs por minuto.",
    }),
    demoCreateLimit(env.demoUrlLimit, env.demoUrlWindowSeconds),
    validateCreateUrl,
    createUrl
)

export default router