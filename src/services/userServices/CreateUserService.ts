import { getRepository } from "typeorm";
import { hash } from "bcryptjs";
import User from "../../models/User";
import auth from "../../config/auth";
import {sign} from "jsonwebtoken";

interface Request{
    name: string;
    email: string;
    password: string;
}

interface Response {
    user: User
    token: string
}

/* It creates a new user and returns the user and a token */
class CreateUserService {
    public async execute({name, email, password}: Request): Promise<Response>{
        const userRepo = getRepository(User);
        const secret = process.env.SECRET ?? "";
        const checkUserEmailExist = await userRepo.findOne({
            where: {email}
        })

        if (checkUserEmailExist){
            throw new Error("User e-mail already exist!");
        }
        const hashedPassword = await hash(password, 8)

        const user = userRepo.create({
            name,
            email,
            password: hashedPassword
        })

        await userRepo.save(user);

        delete user.password;

        const { expiresIn } = auth.jwt

        const token = sign({ }, secret, {
            subject: user.id,
            expiresIn,
        });

        return {user, token};
    }
}

export default CreateUserService;