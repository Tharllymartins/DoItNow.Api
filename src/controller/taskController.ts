import { Request, Response } from "express";
import { getCustomRepository, getRepository } from "typeorm";
import Task from "../models/Task";
import TaskRepo from "../repositories/taskRepository";
import CreateTaskService from "../services/taskServices/CreateTaskService";



/* It gets all the tasks from the database that match the query parameters. */
export const getTasks = async (req: Request, res: Response) => {
    try {
        const taskRepo = getCustomRepository(TaskRepo);
        const user_id = req.user.id;
        const { status, tag } = req.query;
        const statusTypes = ["To do", "Doing", "Done"]
        let query = {}

        if (user_id) {
            Object.assign(query, { user_id })
        }

        if (tag) {
            Object.assign(query, { tagId: tag })
        }

        if (status) {
            Object.assign(query, { status: statusTypes[+status] })
        }

        const tasks = await taskRepo.find({
            where: query
        })

        const overView = taskRepo.overView(tasks);

        return res.json({ tasks, overView });
    } catch (error) {
        return res.status(400).send()
    }

}

/* It gets all tasks by tagId and returns the tasks and an overview of the tasks. */
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

        return res.json({ tasks, overView })
    } catch (error) {
        return res.status(400).send()
    }
}


/* It creates a task. */
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


/**
 * It takes the id of the task to be updated from the request params, the data to be updated from the
 * request body, gets the task repository, finds the task with the given id, updates the task with the
 * given data and returns a 202 response if successful or a 400 response if not.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object that will be sent back to the client.
 * @returns The updated task
 */
export const updateTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const taskRepo = getRepository(Task);

    try {
        const task = await taskRepo.findOne(id)
        if (!task) {
            return res.status(400).json({ msg: "Task not found" })
        }
        await taskRepo.update(id, data)

        return res.status(202).json()
    } catch (error) {
        return res.status(400).json()
    }
}


/* It deletes a task from the database by its id. */
export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params;
    const taskRepo = getRepository(Task);
    try {
        taskRepo.delete(id)
        return res.status(202).json()
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}


