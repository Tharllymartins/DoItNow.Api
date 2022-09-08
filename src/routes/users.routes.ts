import { Router } from "express";
import ensureAutheticated from "../middlewares/ensureAutheticated";
import multer from "multer";
import uploadConfig from "../config/upload";
import { authUserController, changePasswordController, createUserController, forgotUserPasswordController, getUserController, uploadUserAvatarController } from "../controller/userController";

const usersRouter = Router();
const upload = multer(uploadConfig);


usersRouter.post("/signup", createUserController)

usersRouter.post("/auth", authUserController)

usersRouter.get("/auth/me", ensureAutheticated, getUserController)

usersRouter.patch('/avatar', ensureAutheticated, upload.single('avatar'), uploadUserAvatarController)

usersRouter.post("/forgot-password", forgotUserPasswordController)

usersRouter.patch("/change-password", changePasswordController)


export default usersRouter;