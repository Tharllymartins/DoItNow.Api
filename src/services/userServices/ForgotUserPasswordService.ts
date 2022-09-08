import {getRepository} from "typeorm";
import User from "../../models/User";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { hash } from "bcryptjs";
import AppError from "../../error/AppError";


interface Request {
    email: string;
}

/* It receives an e-mail, searches for the user in the database, generates a new password, sends it to
the user's e-mail and updates the database with the new password. */
export default class ForgotUserPassword {
    public async execute({email}: Request){

    const user = await getRepository(User).findOne({
        where: {
            email
        }
    })

    if(!user) {
        throw new AppError("This e-mail doesn't exist!")
    }

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "fad0ff04fcf79a",
            pass: "334c4e3de3719c"
        }
    });

    const newPassword = crypto.randomBytes(4).toString("hex")

    transport.sendMail({
        from: "Adm <147dcf0296-0fb847@inbox.mailtrap.io>",
        to: email,
        subject: "Recuperação de senha",
        text: "Sua nova senha é " + newPassword
    }).then(
        async () => { 
            const hashedPassword = await hash(newPassword, 8);
            const id = String(user?.id)
            await getRepository(User).update(id, {
                password: hashedPassword
            })
        }
    )
    
    }
}
