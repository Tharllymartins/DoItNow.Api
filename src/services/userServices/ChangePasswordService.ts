import {getRepository} from "typeorm";
import User from "../../models/User";
import { compare, hash } from "bcryptjs";


interface Request {
    email: string;
    oldPassword: string;
    newPassword: string;
}

export default class ChangeUserPasswordService {
    public async execute({email, oldPassword, newPassword}: Request){

    const user = await getRepository(User).findOne({
        where: {
            email
        }
    })

    if(!user) {
        throw new Error("This e-mail doesn't exist!")
    }

    const oldPasswordMatch = await compare(oldPassword, user.password!)

    if(!oldPasswordMatch) {
        throw new Error("Password doesn't match")
    }

    const hashedNewPassword = await hash(newPassword, 8);

    const id = String(user?.id)

    await getRepository(User).update(id, {
        password: hashedNewPassword
    })
    }
}
