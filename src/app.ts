import express from "express";
import routes from "./routes";
import uploadConfig from "./config/upload";
import swaggerUi from "swagger-ui-express"
import swaggerFile from "./swagger.json"
import { NextFunction, Response, Request } from "express";
import AppError from "./error/AppError";


const app = express();
app.use(express.json());
app.use(routes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/files', express.static(uploadConfig.directory))
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statuscode).json({
            message: err.message
        })
    }

    return res.status(500).json({
        message: `Internal server error: ${err.message}`
    })
})


export default app;