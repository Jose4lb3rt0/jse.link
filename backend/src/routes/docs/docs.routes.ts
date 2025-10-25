import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "URL Shortener API",
            version: "1.0.0",
            description: "API para el acortador de URLs (Express + TypeScript + MongoDB)",
        },
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:5000",
            },
        ],
        components: {
            schemas: {
                ApiResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean" },
                        message: { type: "string" },
                        data: { type: ["object", "array", "null"] }
                    }
                },
                UrlModel: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        shortId: { type: "string", example: "aZ8xB2" },
                        originalUrl: { type: "string", example: "https://example.com" },
                        clicks: { type: "integer", example: 0 },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                CreateUrlBody: {
                    type: "object",
                    required: ["originalUrl"],
                    properties: {
                        originalUrl: { type: "string", example: "https://example.com" }
                    }
                }
            }
        }
    },
    apis: [
        "./src/routes/**/*.ts",
        "./src/controllers/**/*.ts",
        "./src/docs/**/*.ts"
    ]
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

const docsHandler = (app: any, prefix: string) => {
    app.use(`/${prefix}`, swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}

export default docsHandler