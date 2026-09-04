import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model.js';
import type { Task } from './task.model.js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task {
        const task = this.tasks.find((task) => task.id === id);
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }

    createTask(title: string, description: string): Task {
        const task: Task = {
            id: uuidv4(), // Gerando um ID único
            title,
            description,
            status: TaskStatus.OPEN, // Toda tarefa começa como OPEN
        };
        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const taskToDelete = this.getTaskById(id); // Já reaproveita o erro 404 se não achar
        this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
    }

    updateTaskStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
