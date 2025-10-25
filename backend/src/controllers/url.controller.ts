import { Router } from "express"
import { createUrl, redirectToOriginal } from "../services/urlService"

const urlsRouter = Router()

urlsRouter.post('/', createUrl) //Quité "/url" y lo dejé como "/" porque "main.routes.ts" manejará el prefijo "urls"
urlsRouter.get('/:shortId', redirectToOriginal)

export default urlsRouter