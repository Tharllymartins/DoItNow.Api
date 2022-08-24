import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import AuthUserService from "../services/AuthUserService";
import CreateUserService from "../services/CreateUserService";
import UpdatedUserAvatarService from "../services/UpdatedUserAvatarService";
import { hash } from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import ForgotUserPassword from "../services/ForgotUserPasswordService";


const getUserController = async (req: Request, res: Response) => {

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

const authUserController = async (req: Request, res: Response) => {
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

const createUserController = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        const createUser = new CreateUserService;
        await createUser.execute({
            email,
            name,
            password
        })
        const authUser = new AuthUserService;
        const user  = await authUser.execute({
            email,
            password
        })
        return res.status(201).json(user)
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

const uploadUserAvatarController = async (req: Request, res: Response) => {
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

const forgotUserPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const forgotUserPasswordService = new ForgotUserPassword()
        const passwordChanged = await forgotUserPasswordService.execute({email})

        return res.send("success!")
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

export {
    getUserController,
    authUserController,
    createUserController,
    uploadUserAvatarController,
    forgotUserPasswordController
}