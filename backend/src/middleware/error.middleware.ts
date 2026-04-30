import { NextFunction, Request, Response } from "express"

export const notFoundHandler = (req: Request, res: Response) => {
    return res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.originalUrl}`,
    })
}

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error)

    return res.status(500).json({
        success: false,
        message: "Ocurrió un error interno del servidor.",
    })
}