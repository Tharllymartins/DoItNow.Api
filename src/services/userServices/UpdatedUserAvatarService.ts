import { getRepository } from 'typeorm';
import User from '../../models/User';
import path from 'path';
import uploadConfig from '../../config/upload'
import fs from 'fs';

interface Request {
    user_id?: string;
    avatarFileName?: string;
}

/* This class is responsible for updating the user avatar, and it does so by finding the user, deleting
the old avatar, and saving the new avatar. */
class UpdatedUserAvatarService {
    public async execute({ user_id, avatarFileName }: Request): Promise<User>{
        const userRepo = getRepository(User);

        const user = await userRepo.findOne(user_id);

        if (!user){
            throw new Error('Only autheticated user can change avatar');
        }

        if (user.avatar) {
            // Deletar avatar anterior
            const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)

            const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

            if (userAvatarFileExists){
                await fs.promises.unlink(userAvatarFilePath)
            }
        }

        user.avatar = avatarFileName!;

        await userRepo.save(user);

        return user;
    }
}

export default UpdatedUserAvatarService;