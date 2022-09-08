import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, JoinTable } from 'typeorm';
import SubTask from './SubTask';
import Tag from './Tag';
import User from './User';

@Entity('tasks')
class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    tagId: string;

    @ManyToOne(() => Tag, tags => tags.tasks, {eager: true})
    tag?: Tag;

    @Column()
    user_id?: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(type => SubTask, subtasks => subtasks.task, { eager: true })
    subtasks: SubTask[];

    @Column()
    name: string;

    @Column()
    status: 'To do' | 'Doing' | 'Done'

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

}


export default Task;