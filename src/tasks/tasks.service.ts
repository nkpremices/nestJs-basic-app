import { User } from './../auth/user.entity';
import { TaskRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-all-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './taks.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  getAllTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
    ): Promise<Task[]> {
    return this.taskRepository.getTasks(getTasksFilterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!task) {
      throw new NotFoundException('Item not Found');
    }
    return task;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
    ): Promise<Task> {
    return this.taskRepository.creatTask(createTaskDto, user);
  }

  async deleteTask(
    id: number,
    user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException('Item not Found');
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
