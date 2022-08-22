import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/User";
import AuthUserService from "../services/AuthUserService";
import CreateUserService from "../services/CreateUserService";
import UpdatedUserAvatarService from "../services/UpdatedUserAvatarService";


const getUserController = async (req: Request, res: Response) => {
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
}

const authUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
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
    const { email, name, password } = req.body;
    const createUser = new CreateUserService;
    try {
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

const uploadUserAvatarController = async (req: Request, res: Response) => {
    try {
        const updateUserAvatar = new UpdatedUserAvatarService();
        const user = await updateUserAvatar.execute({
            user_id: req.user.id,
            avatarFileName: req.file?.filename
        })
        
        delete user.password;

        return res.json(user)
    } catch (error) {
        return res.json({error: error})
    }
}


export {
    getUserController,
    authUserController,
    createUserController,
    uploadUserAvatarController
}