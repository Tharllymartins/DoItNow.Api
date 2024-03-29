import { getRepository } from "typeorm";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken";
import User from "../../models/User";
import auth from "../../config/auth";
import AppError from "../../error/AppError";

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

/* It receives an email and password, checks if the user exists, checks if the password matches, and
returns a token and the user */
class AuthUserService{
    public async execute({email, password}: Request): Promise<Response> {
        const userRepo = getRepository(User);
        const secret = process.env.SECRET ?? ""
        const user = await userRepo.findOne({
            where: { email }
        })

        if (!user){
            throw new AppError("Incorrect e-mail/password");
        }
        
        const passwordMatched = await compare(password, user.password!)

        if (!passwordMatched){
            throw new AppError("Incorrect e-mail/password");
        }
        
        const { expiresIn } = auth.jwt

        const token = sign({ }, secret, {
            subject: user.id,
            expiresIn,
        });
        
        delete user.password, user.id;

        return {
            user,
            token
        };
    }
}

export default AuthUserService;