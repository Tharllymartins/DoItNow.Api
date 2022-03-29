import { getRepository } from "typeorm";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";
import User from "../models/User";
import auth from "../config/auth";

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

class AuthUserService{
    public async execute({email, password}: Request): Promise<Response> {
        const userRepo = getRepository(User);
        const user = await userRepo.findOne({
            where: { email }
        })

        if (!user){
            throw new Error("Incorrect e-mail/password");
        }
        
        const passwordMatched = await compare(password, user.password!)

        if (!passwordMatched){
            throw new Error("Incorrect e-mail/password");
        }
        
        const { expiresIn, secret } = auth.jwt

        const token = sign({ }, secret, {
            subject: user.id,
            expiresIn,
        });
        
        delete user.password;

        return {
            user,
            token
        };
    }
}

export default AuthUserService;