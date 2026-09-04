import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task.model.js'; // Note o uso do .js aqui!

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus, { message: 'Status inválido. Use OPEN, IN_PROGRESS ou DONE' })
    status: TaskStatus;
}
