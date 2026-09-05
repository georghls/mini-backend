import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach } from 'vitest';
import { TasksService } from './tasks.service.js';
import { TaskStatus } from './task.model.js';

describe('TasksService', () => {
    let tasksService: TasksService;

    // O beforeEach roda ANTES de cada teste individual (it).
    // Isso garante que todo teste comece com um TasksService "zerado", 
    // sem lixo de testes anteriores.
    beforeEach(() => {
        tasksService = new TasksService();
    });

    describe('createTask', () => {
        it('deve criar uma nova tarefa e retornar o objeto criado', () => {
            // AÇÃO: chamamos a função que queremos testar
            const task = tasksService.createTask({
                title: 'Testar aplicação',
                description: 'Escrever testes com Vitest/Jest',
            });

            // RESULTADO ESPERADO (Asserções)
            expect(task.id).toBeDefined(); // O ID foi gerado?
            expect(task.title).toEqual('Testar aplicação');
            expect(task.status).toEqual(TaskStatus.OPEN); // Começou como OPEN?
        });
    });

    describe('getTaskById', () => {
        it('deve retornar uma tarefa caso o ID exista', () => {
            // Preparação: criamos uma tarefa primeiro para ter o que buscar
            const mockTask = tasksService.createTask({
                title: 'Nova Tarefa',
                description: 'Desc',
            });

            // Ação: buscamos a tarefa pelo ID recém gerado
            const result = tasksService.getTaskById(mockTask.id);

            // Resultado
            expect(result).toBeDefined();
            expect(result.id).toEqual(mockTask.id);
        });

        it('deve jogar um erro (NotFoundException) caso a tarefa não exista', () => {
            // Quando testamos erros, passamos a ação dentro de uma "arrow function"
            // para que o expect possa capturar a explosão (erro) sem quebrar o programa.
            expect(() => {
                tasksService.getTaskById('id-falso-123');
            }).toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('deve atualizar o status de uma tarefa com sucesso', () => {
            // Preparação
            const mockTask = tasksService.createTask({
                title: 'Tarefa para atualizar',
                description: 'Desc',
            });

            // Ação: mudar status para DONE
            const result = tasksService.updateTaskStatus(mockTask.id, TaskStatus.DONE);

            // Resultado
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});
