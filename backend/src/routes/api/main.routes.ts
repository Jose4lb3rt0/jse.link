import urlsRouter from "../../controllers/url.controller"
import { redirectToOriginal } from "../../services/urlService"

const routeHandler = (app: any, prefix: string) => {
    app.use(`/${prefix}/urls`, urlsRouter) //Ruta CRUD
    app.get("/:shortId", redirectToOriginal) //Ruta pública
}

export default routeHandler