import {Request, Response} from "express";
import { getCustomRepository, getRepository } from "typeorm";
import SubTask from "../models/SubTask";
import Tag from "../models/Tag";
import Task from "../models/Task";
import TaskRepo from "../repositories/taskRepository";
import CreateTaskService from "../services/taskServices/CreateTaskService";


// Controllers to get information
export const getTasks = async (req: Request, res: Response) => {
    const taskRepo = getCustomRepository(TaskRepo);
    const user_id = req.user.id;
    const {status} = req.query;
    let tasks: Task[] = []

    try {
        if(status) {
            tasks = await taskRepo.find({
                where: {
                    user_id,
                    status
                }
            })
        } else {
            tasks = await taskRepo.find({
                where: {
                    user_id
                }
            })
        }
    
        const overView = taskRepo.overView(tasks);
    
        return res.json({tasks, overView}); 
    } catch (error) {
        return res.status(400).send()
    }

}

export const getTasksByTag = async (req: Request, res: Response) => {
    const { tagId } = req.params;
    const taskRepo = getCustomRepository(TaskRepo);
    try {
        const tasks = await taskRepo.find({
            where: {
                tagId
            }
        })

        const overView = taskRepo.overView(tasks)
    
        return res.json({tasks, overView})
    } catch (error) {
        return res.status(400).send()
    }
}

export const getTags = async (req: Request, res: Response) => {
    const tagRepo = getRepository(Tag);
    const userId = req.user.id;
    try {
        const tags = await tagRepo.find({
            where: {
                userId
            }
        })

        return res.json(tags);
    } catch (error) {
        return res.status(400).send()
    }
    
}

// Controllers to create data
export const createTask = async (req: Request, res: Response) => {
    const { name, tagId } = req.body;
    const { id } = req.user;
    const createTaskService = new CreateTaskService;
    try {
        const task = await createTaskService.execute({
            name,
            id,
            tagId
        })
    
        return res.status(201).send()
    } catch (error) {
        return res.status(400).json()
    }
}

export const createSubTask = async (req: Request, res: Response) => {
    const { name, status } = req.body;
    const { taskId }: any = req.params;
    const subTaskRepo = getRepository(SubTask)
    const taskRepo = getRepository(Task)

    try {

        const task = await taskRepo.findOne({where:{id: taskId}})

        if(!task) {
            return res.status(400).json({error: "Task not found"})
        }
        const subTask = subTaskRepo.create({
            name,
            status,
            taskId
        })
    
        await subTaskRepo.save(subTask);
    
        return res.status(201).json(subTask)
    } catch (error) {
        return res.status(400).send()
    }

}

export const createTag = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = req.user.id;
    const tagRepo = getRepository(Tag);

    try {
        const tag = tagRepo.create({
            name,
            userId
        })

        await tagRepo.save(tag)

        return res.json(tag)
    } catch (error) {
        return res.status(400).json({error: "Error"})
    }
}

// Controllers to update data
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const taskRepo = getRepository(Task);

    try {
        const task = await taskRepo.findOne(id)
        if (!task) {
            return res.status(400).json({msg: "Task not found"})
        }
        await taskRepo.update(id, data)

        return res.status(202).json()
    } catch (error) {
        return res.status(400).json()
    }
}

export const updateSubTask =  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const subtaskRepo = getRepository(SubTask);

    try {
        const subTask = await subtaskRepo.findOne(id);
        if(!subTask) {
            return res.status(400).json({msg: "Subtask not found!"})
        }
        await subtaskRepo.update(id, data)
        
        return res.status(202).send();
    } catch (error: Error | any) {
        return res.status(400).json({error: error.message})
    }
}

export const updateTag = async (req: Request, res: Response) => {
    const {tagId} = req.params;
    const data = req.body;
    const tagRepo = getRepository(Tag);

    try {
        const tag = await tagRepo.findOne(tagId);
        if(!tag){
            return res.status(400).json({error: "Tag not found!"});
        }
        await tagRepo.update(tagId, data)
        return res.status(202).send();
    } catch (error) {
        return res.status(400);
    }
}

// Controllers to delete data
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const taskRepo = getRepository(Task);
    try {
        taskRepo.delete(id)
        return res.status(202).json()
    } catch (error) {
        return res.status(400).json({error: error})
    }
}

export const deleteSubTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const subtaskRepo = getRepository(SubTask)
    try {
        subtaskRepo.delete(id)
        return res.status(202).json()
    } catch (error) {
        return res.status(400).json({error: error})
    }
}

export const deleteTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const tagrepo = getRepository(Tag);
    try {
        tagrepo.delete(id);

        return res.status(204).json()
    } catch (error) {
        return res.status(400).send()
    }

}