import { getRepository } from "typeorm"
import Tag from "../../models/Tag";
import Task from "../../models/Task";


interface Request {
    name: string;
    id?: string;
    tagId?: string;
}

/* It creates a task and saves it to the database */
export default class CreateTaskService {
    public async execute({ name, id, tagId }: Request): Promise<Task>{
        const taskRepo = getRepository(Task)
        const tagRepo = getRepository(Tag)

        const userExist = taskRepo.findOne({
            where: {
                user_id: id
            }
        });

        const tagExist = tagRepo.findOne({
            where: {
                id: tagId
            }
        })

        if (!userExist){
            throw new Error("User does not exist!")
        }

        if (!tagExist) {
            throw new Error("Tag does not exist")
        }

        const task = taskRepo.create({
            name,
            user_id: id,
            tagId,
            status: "To do"
        })

        await taskRepo.save(task);

        delete task.user_id;

        return task;
        
    }
}