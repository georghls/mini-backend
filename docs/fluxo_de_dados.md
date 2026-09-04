# Fluxo de Dados e Arquitetura no NestJS

Este documento resume os conceitos fundamentais da arquitetura do NestJS que foram discutidos durante o desenvolvimento da primeira versão da API de Tarefas. Entender a responsabilidade de cada uma dessas partes e como elas se comunicam é essencial.

## 1. A Função de cada Componente

### Model (Modelo)
Define o "formato" ou a "forma" dos dados. No nosso caso, o `task.model.ts` diz que toda Tarefa precisa obrigatoriamente ter um `id`, um `title`, uma `description` e um `status`. O Model garante que o TypeScript valide os tipos, evitando que dados incompletos ou incorretos sejam criados. Ele dita as regras dos dados, mas não executa lógica.

### Controller (Controlador)
É a **porta de entrada** da sua API. A única função do Controller é receber as requisições HTTP (GET, POST, etc.) que vêm do mundo externo, extrair as informações relevantes (como a URL, o ID, ou o corpo da requisição) e encaminhar isso para quem realmente sabe o que fazer (o Service). Ele não deve ter regras de negócio complexas.

### Service (Serviço)
É o **cérebro** da aplicação, onde fica toda a **regra de negócio**. É aqui que salvamos no banco de dados (no nosso caso, no array em memória), validamos cenários de negócio, etc. O Service recebe a ordem do Controller, faz o trabalho pesado e devolve o resultado.

### Module (Módulo)
É o **empacotador** ou **organizador**. O NestJS não sabe automaticamente quem pode conversar com quem. O `TasksModule` junta o `TasksController` e o `TasksService` e diz para o framework: *"Ei, estes arquivos fazem parte da funcionalidade de Tarefas e estão interligados"*. Ele organiza a Injeção de Dependência (permitindo que o Service seja instanciado e usado dentro do Controller).

---

## 2. O Fluxo de Dados na Prática (Criando uma Tarefa)

Podemos imaginar o fluxo de dados através de uma analogia com um restaurante:
*   O **Cliente** (Postman, navegador, frontend) é a pessoa fazendo o pedido.
*   O **Controller** é o garçom.
*   O **Service** é o cozinheiro.
*   O **Model** é a receita.

Quando fazemos um `POST` para `/tasks` passando um título e uma descrição:

1. **A Chegada (Controller):** O método `createTask` dentro do `TasksController` é acionado pelo roteador do NestJS. Ele usa o `@Body()` para extrair o `title` e a `description` da requisição HTTP (o garçom anota o pedido).
2. **O Repasse:** O Controller não cria a tarefa; ele simplesmente repassa esses dados brutos chamando `tasksService.createTask(title, description)`.
3. **A Regra de Negócio (Service & Model):** O Service recebe os dados e aplica as regras: gera um ID único, define que o status inicial obrigatório é `TaskStatus.OPEN`, cria um objeto seguindo estritamente as regras do **Model** (`Task`), e adiciona ao seu array interno.
4. **A Devolução:** O Service retorna o objeto Tarefa criado e válido para quem o chamou (o Controller).
5. **A Resposta Final (Controller):** O Controller recebe a Tarefa finalizada e a empacota em uma resposta HTTP (convertendo para JSON e adicionando o status code adequado, como `201 Created`), devolvendo-a para o Cliente.

**Resumo da regra de ouro:** Tudo que envolver comunicação com o mundo externo (rotas, headers, status HTTP) fica no Controller. Toda a lógica interna de manipulação e regra de negócio fica no Service!
