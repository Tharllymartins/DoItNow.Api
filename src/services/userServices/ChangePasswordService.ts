import {getRepository} from "typeorm";
import User from "../../models/User";
import { compare, hash } from "bcryptjs";
import AppError from "../../error/AppError";


interface Request {
    email: string;
    currentPassword: string;
    newPassword: string;
}

/* It receives an email, current password and new password, checks if the email exists, checks if the old
password matches the one in the database, hashes the new password and updates the user's password */
export default class ChangeUserPasswordService {
    public async execute({email, currentPassword, newPassword}: Request){

    const user = await getRepository(User).findOne({
        where: {
            email
        }
    })

    if(!user) {
        throw new AppError("User not found")
    }

    const currentPasswordMatch = await compare(currentPassword, user.password!)

    if(!currentPasswordMatch) {
        throw new AppError("Current password is incorrect")
    }

    const hashedNewPassword = await hash(newPassword, 8);

    const id = String(user?.id)

    await getRepository(User).update(id, {
        password: hashedNewPassword
    })
    }
}
