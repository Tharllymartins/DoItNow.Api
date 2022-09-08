import Task from "../models/Task";
import { EntityRepository, Repository } from 'typeorm'


interface IOverView {
    total: number;
    todo: number;
    done: number;
    doing: number;
}

@EntityRepository(Task)
class TaskRepo extends Repository<Task> {
    public overView(tasks: any): IOverView{
        const { done, todo, doing } = tasks.reduce(
            (accum: IOverView, task: Task) => {
                switch (task.status) {
                    case "Done":
                        accum.done += 1;
                        break;
                    case "To do":
                        accum.todo += 1;
                        break;
                    case "Doing":
                        accum.doing += 1
                    default:
                        break;
                }
                return accum;
            },
            { //Formato do objeto accumulator
                todo: 0,
                doing: 0,
                done: 0,
                total: 0
            }
        );
        const total = done + todo + doing;
        return { todo, doing, done, total }
    }       
}

export default TaskRepo;