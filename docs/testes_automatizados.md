# Testes Automatizados no NestJS

Este documento detalha as suítes de testes unitários que implementamos para a nossa API, utilizando a sintaxe padrão do Jest/Vitest.

O objetivo principal dos testes unitários é testar a lógica de negócio (geralmente localizada nos Services) de forma isolada, rápida e previsível, sem precisar subir um banco de dados real ou depender de requisições HTTP demoradas.

## 1. Testando a Lógica Base (`TasksService`)

No arquivo `tasks.service.spec.ts`, testamos o "cérebro" da nossa gestão de tarefas. O foco aqui foi validar se a manipulação do nosso array em memória estava funcionando corretamente.

### Os Cenários Cobertos:
1. **Criação da Tarefa:**
   - *Objetivo:* Garantir que ao passar um título e uma descrição válidos (DTO), a função nos retorna um objeto de Tarefa bem formatado.
   - *Validações:* Conferimos se o `id` foi gerado (não é nulo) e se o `status` inicial foi corretamente definido para `OPEN`.
2. **Busca por ID (Caminho Feliz):**
   - *Objetivo:* Garantir que conseguimos resgatar uma tarefa recém criada.
   - *Validações:* Criamos uma tarefa de mentirinha e checamos se `getTaskById` retorna o objeto exato.
3. **Busca por ID (Cenário de Erro):**
   - *Objetivo:* Testar a resiliência do sistema e o tratamento de erros.
   - *Validações:* Tentamos buscar um ID que não existe e usamos o `.toThrow()` para garantir que a aplicação não simplesmente engole o problema, mas sim joga ativamente um erro `NotFoundException` (que o NestJS converte em erro 404 para o cliente).
4. **Atualização de Status:**
   - *Objetivo:* Garantir que a mutação de dados funciona.
   - *Validações:* Alteramos o status de uma tarefa para `DONE` e conferimos se a mudança foi salva na memória.

*Nota técnica:* Usamos o `beforeEach()` no topo do arquivo para recriar (`new TasksService()`) o serviço antes de CADA teste. Isso garante **Isolamento**: a tarefa criada no teste 1 não polui e não interfere no teste 2.

---

## 2. Testando com Dependências (`AuthService`)

No arquivo `auth.service.spec.ts`, encontramos um desafio diferente. O `AuthService` depende de um código externo para funcionar (o `JwtService` que assina os tokens).

Em um teste **unitário** estrito, nós NÃO queremos testar as bibliotecas dos outros, só o nosso código. Para isso, introduzimos o conceito de **Mock (Objeto Falso)**.

### O Cenário Coberto:
1. **Geração de Login e Token:**
   - *Objetivo:* Garantir que a função `login` cria o payload (conteúdo) correto e repassa para o assinador de tokens.
   - *Como fizemos (Mocks):* 
     1. Usamos `vi.fn()` para criar uma função falsa para o `sign` que sempre retorna a string `"token-falso-123"`.
     2. Injetamos esse serviço falso no construtor do nosso AuthService: `new AuthService(mockJwtService)`.
   - *Validações:* 
     - `.toHaveBeenCalledWith()`: Espionamos a função falsa para ver se o nosso código realmente a chamou passando o `{ sub: 1, username: 'george' }`. Isso garante que estamos montando a requisição para o gerador de tokens da maneira certa.
     - Conferimos se o `AuthService` pega o token retornado pela biblioteca e empacota direitinho dentro do objeto `{ access_token: ... }`.
