import urlsRouter from "../../controllers/url.controller"

const routeHandler = (app: any, prefix: string) => {
    app.use(`/${prefix}/urls`, urlsRouter)
    // app.use(`/${prefix}/users`, userRouter)
}

export default routeHandler