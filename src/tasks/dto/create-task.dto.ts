import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty({ message: 'O título não pode estar vazio' })
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}