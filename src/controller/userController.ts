import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import AuthUserService from "../services/userServices/AuthUserService";
import CreateUserService from "../services/userServices/CreateUserService";
import UpdatedUserAvatarService from "../services/userServices/UpdatedUserAvatarService";
import ForgotUserPassword from "../services/userServices/ForgotUserPasswordService";
import ChangeUserPasswordService from "../services/userServices/ChangePasswordService";


export const getUserController = async (req: Request, res: Response) => {

    try {
        const id = req.user.id;
        const userRepo = getRepository(User)
        const user = await userRepo.findOne({
            select: ["name", "email", "avatar"],
            where: {
                id
            }
        }) as User
    
        if(!user){
            return res.status(400).json()
        }
        
        return res.json(user)
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }

}

export const authUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const authUser = new AuthUserService;
        const  user  = await authUser.execute({
            email,
            password
        })
        
        return res.json(
            user
        )
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

export const createUserController = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        const createUser = new CreateUserService;
        const user = await createUser.execute({
            email,
            name,
            password
        })

        return res.status(201).json(user)
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

export const uploadUserAvatarController = async (req: Request, res: Response) => {
    try {
        const updateUserAvatar = new UpdatedUserAvatarService();
        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFileName: req.file?.filename
        })
        
        delete user.password;

        return res.json(user)
    } catch (error: Error | any) {
        return res.json({error: error.message})
    }
}

export const forgotUserPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const forgotUserPasswordService = new ForgotUserPassword()
        const passwordChanged = await forgotUserPasswordService.execute({email})

        return res.send("success!")
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

export const changePasswordController = async (req: Request, res: Response) => {
    try {
        const {email, oldPassword, newPassword} = req.body;

        const changePasswordService = new ChangeUserPasswordService();

        await changePasswordService.execute({
            email,
            newPassword,
            oldPassword
        })

        return res.send("success!")

    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}
