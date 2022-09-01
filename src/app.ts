import express from "express";
import routes from "./routes";
import uploadConfig from "./config/upload";
import swaggerUi from "swagger-ui-express"
import swaggerFile from "./swagger.json"


const app = express();
app.use(express.json());
app.use(routes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use('/files', express.static(uploadConfig.directory))


export default app;