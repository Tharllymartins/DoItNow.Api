import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Tag from "../models/Tag";


/**
 * It gets all the tags for a user.
 * @param {Request} req - Request - the request object
 * @param {Response} res - Response - the response object
 * @returns An array of tags
 */
export const getTags = async (req: Request, res: Response) => {
    try {
        const tagRepo = getRepository(Tag);
        const userId = req.user.id;
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

/**
 * It takes a tagId from the request params, and a data object from the request body, and then it finds
 * the tag with the given tagId, and if it exists, it updates it with the data object.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object
 * @returns The updated tag
 */
export const updateTag = async (req: Request, res: Response) => {
    const { tagId } = req.params;
    const data = req.body;
    const tagRepo = getRepository(Tag);

    try {
        const tag = await tagRepo.findOne(tagId);
        if (!tag) {
            return res.status(400).json({ error: "Tag not found!" });
        }
        await tagRepo.update(tagId, data)
        return res.status(202).send();
    } catch (error) {
        return res.status(400);
    }
}

/**
 * It creates a new tag and saves it to the database.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object
 * @returns The tag object
 */
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
        return res.status(400).json({ error: "Error" })
    }
}

/**
 * It deletes a tag from the database.
 * @param {Request} req - Request - the request object
 * @param {Response} res - Response - the response object
 * @returns The response object.
 */
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