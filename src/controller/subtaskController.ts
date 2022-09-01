import { Request, Response } from "express";
import { getRepository } from "typeorm";
import SubTask from "../models/SubTask";
import Task from "../models/Task";




/**
 * It creates a subTask and saves it to the database.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @returns The subTask object
 */
export const createSubTask = async (req: Request, res: Response) => {
    try {
        const { name, status } = req.body;
        const { taskId }: any = req.params;
        const subTaskRepo = getRepository(SubTask)
        const taskRepo = getRepository(Task)
        const task = await taskRepo.findOne({ where: { id: taskId } })

        if (!task) {
            return res.status(400).json({ error: "Task not found" })
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

/**
 * It deletes a subtask from the database.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @returns The response is being returned.
 */
export const deleteSubTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const subtaskRepo = getRepository(SubTask)
        subtaskRepo.delete(id)
        
        return res.status(202).json()
    } catch (error) {
        return res.status(400).json({ error: error })
    }
}

/**
 * It takes the id of a subtask and updates it with the data from the request body.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @returns The updated subtask
 */
export const updateSubTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const subtaskRepo = getRepository(SubTask);
        const subTask = await subtaskRepo.findOne(id);
        if (!subTask) {
            return res.status(400).json({ msg: "Subtask not found!" })
        }
        await subtaskRepo.update(id, data)

        return res.status(202).send();
    } catch (error: Error | any) {
        return res.status(400).json({ error: error.message })
    }
}