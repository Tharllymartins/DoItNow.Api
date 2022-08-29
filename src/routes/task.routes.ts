import { Router } from "express";
import ensureAutheticated from "../middlewares/ensureAutheticated";
import { createTask, deleteTask, getTasks, getTasksByTag, updateTask } from "../controller/taskController";
import { getTags, updateTag, createTag, deleteTag } from "../controller/tagController"
import { createSubTask, deleteSubTask, updateSubTask } from "../controller/subtaskController"


const taskRouter = Router();
taskRouter.use(ensureAutheticated)

// Route to get tasks
taskRouter.get("/", getTasks);
taskRouter.get("/tag", getTags)
taskRouter.get("/tag/:tagId", getTasksByTag)
// Routes to create data (task, subtask)
taskRouter.post("/create", createTask);
taskRouter.post("/:taskId/subtask", createSubTask);
taskRouter.post("/tag", createTag);
// Routes to update data (task, subtask)
taskRouter.patch("/:id", updateTask);
taskRouter.patch("/subtask/:id", updateSubTask);
taskRouter.patch("/tag/:tagId", updateTag)
// Routes to delete data (task, subtask)
taskRouter.delete("/:id", deleteTask);
taskRouter.delete("/subtask/:id", deleteSubTask);
taskRouter.delete("/tag/:tagId", deleteTag)


export default taskRouter;