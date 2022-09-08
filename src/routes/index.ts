import { Router } from "express";
import todoRouter from "./task.routes"
import usersRouter from "./users.routes";
import cors from "cors";

const routes = Router();

routes.use(cors());
routes.use("/task", todoRouter);
routes.use("/user", usersRouter);



export default routes;
