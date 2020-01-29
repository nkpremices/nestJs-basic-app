import { User } from './../auth/user.entity';
import { GetTasksFilterDto } from './dto/get-all-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './taks.entity';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async creatTask(
    createTaskDto: CreateTaskDto,
    user: User,
    ): Promise<Task> {
    const task = new Task();
    task.description = createTaskDto.description;
    task.title = createTaskDto.title;
    task.status = TaskStatus.DONE;
    task.user = user;

    await task.save();

    delete task.user;

    return task;
  }

  async getTasks(
    { status, search }: GetTasksFilterDto,
    user: User,
    ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title Like :search OR task.description Like :search)', { search: `%${search}%` });
    }

    return query.getMany();
  }
}
