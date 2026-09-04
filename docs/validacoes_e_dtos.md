# DTOs e Validações no NestJS

Este documento resume a implementação da camada de segurança e validação de dados de entrada na API de Tarefas, utilizando os conceitos de **Data Transfer Objects (DTOs)** e **ValidationPipe**.

## 1. O que é um DTO?

DTO significa **Data Transfer Object** (Objeto de Transferência de Dados). É um padrão de projeto usado para encapsular dados e enviá-los de um subsistema para outro. 

No contexto da nossa API NestJS, os DTOs (como `CreateTaskDto` e `UpdateTaskStatusDto`) definem o formato exato (o "contrato") dos dados que esperamos receber do cliente (frontend, Postman, etc.) através da rede. Eles garantem que não vamos trafegar dados que não precisamos ou que não esperamos, e são o local ideal para definir as regras de validação.

## 2. Como funciona a Validação no NestJS?

A validação de dados no NestJS geralmente é feita usando uma combinação de dois pacotes: `class-validator` e `class-transformer`.

A mágica acontece quando ativamos o **`ValidationPipe`**. Pense nele como o "segurança na porta" da sua aplicação. Quando uma requisição HTTP chega:
1. O `ValidationPipe` intercepta a requisição antes dela chegar na lógica do seu Controller.
2. Ele olha para o tipo do parâmetro no Controller (ex: `createTaskDto: CreateTaskDto`).
3. Ele transforma o JSON recebido em uma classe real (graças ao `class-transformer`) e aplica as regras de validação definidas (os decorators do `class-validator`, como `@IsString()`).
4. Se o dado não passar nas regras, o `ValidationPipe` barra a requisição e retorna um erro `400 Bad Request` automático. Se estiver tudo certo, a requisição passa.

---

## 3. Alterações Realizadas na Aplicação

Para implementar este conceito, fizemos modificações em quatro níveis da aplicação:

### Nível Global: Habilitando o Pipe
**Arquivo alterado:** `src/main.ts`
Adicionamos `app.useGlobalPipes(new ValidationPipe());`. Isso ativou a proteção para a aplicação inteira, garantindo que todas as rotas passem pelo filtro de validação automaticamente.

### Nível de Dados: Criando os DTOs
**Arquivos criados:** `src/tasks/dto/create-task.dto.ts` e `src/tasks/dto/update-task-status.dto.ts`
Criamos as classes definindo as regras exatas de como os dados devem entrar:
- Usamos `@IsString()` e `@IsNotEmpty()` para garantir que o título e a descrição são strings válidas e não estão em branco.
- Usamos `@IsEnum(TaskStatus)` para garantir que uma tarefa só pode ter o status alterado para um dos valores aceitos (OPEN, IN_PROGRESS, DONE).

### Nível de Roteamento: O Controller
**Arquivo alterado:** `src/tasks/tasks.controller.ts`
Substituímos a extração manual de parâmetros.
Antes: `createTask(@Body('title') title: string, @Body('description') description: string)`
Depois: `createTask(@Body() createTaskDto: CreateTaskDto)`
Isso informa ao `ValidationPipe` que ele deve aplicar as regras definidas no `CreateTaskDto` ao corpo daquela requisição inteira.

### Nível de Negócios: O Service
**Arquivo alterado:** `src/tasks/tasks.service.ts`
Adaptamos a função para receber o DTO pronto e validado, utilizando a sintaxe de desestruturação (*destructuring*) do JavaScript: `const { title, description } = createTaskDto;`. Isso extrai as propriedades do DTO de forma limpa para a criação do objeto interno da Tarefa.
