# Autenticação com JWT e Guards no NestJS

Este documento resume os conceitos e a implementação da camada de segurança na nossa API, focada em proteger as rotas de tarefas garantindo que apenas usuários autorizados tenham acesso.

## 1. Para que serve a Autenticação JWT?

JWT (JSON Web Token) é um padrão da indústria usado para compartilhar informações de segurança entre um cliente e um servidor. No nosso caso, ele serve como uma "carteirinha VIP".

Em APIs modernas (REST), os servidores são *stateless* (sem estado), ou seja, o servidor não guarda a informação de que um usuário está logado na memória dele. Em vez disso, o servidor assina um token criptográfico e entrega ao cliente. O cliente, então, deve apresentar esse token a cada nova requisição para provar que é ele mesmo e que está autorizado.

## 2. O Fluxo de Utilização

O fluxo de autenticação e autorização com JWT funciona na seguinte ordem:

1. **Login (Autenticação):** O cliente envia suas credenciais (ex: usuário e senha) para a rota `/auth/login`.
2. **Geração do Token:** O servidor confere os dados. Se estiverem corretos, ele pega informações básicas (como o ID do usuário), cria um "payload", e **assina matematicamente** usando uma Chave Secreta (`secret`) que só o servidor conhece. O token gerado é devolvido ao cliente.
3. **Requisição Segura:** Quando o cliente quiser acessar uma rota protegida (como `GET /tasks`), ele precisa enviar esse token no cabeçalho (*header*) da requisição, no formato `Authorization: Bearer <seu_token_aqui>`.
4. **Validação (Guards):** Antes do Controller das tarefas ser acionado, o NestJS usa um "Guard" (Guarda-costas) para interceptar o pedido. Ele pega o token do cabeçalho e verifica a assinatura usando a mesma chave secreta. 
   - Se a assinatura bater e não estiver expirado, ele deixa passar. 
   - Se alguém tentou adulterar o token ou ele venceu, o Guard barra com um erro `401 Unauthorized`.

---

## 3. As Etapas de Implementação

Nossa implementação manual foi dividida em 4 partes principais:

### Passo 1: O Módulo de Autenticação (`AuthModule`)
Isolamos a responsabilidade criando o `AuthModule`. Nele, importamos o **`JwtModule`** oficial do NestJS. Foi aqui que definimos a nossa chave secreta (`secret: 'MINHA_CHAVE_SECRETA_MUITO_SEGURA'`) e o tempo de expiração do token (`1h`). O `global: true` foi usado para permitir que o serviço de validação seja usado no Guard facilmente.

### Passo 2: A Geração do Token (`AuthService` e `AuthController`)
- Criamos uma rota `POST /auth/login` que recebe o `username`.
- O `AuthService` pega esse `username` e usa o `jwtService.sign(payload)` para gerar a string gigantesca do token assinado. Isso elimina a necessidade de salvar a sessão no banco de dados.

### Passo 3: O Guarda-costas (`AuthGuard`)
Criamos um Guard que implementa a interface `CanActivate`. A função dele é simples e rigorosa:
1. Extrai a requisição HTTP e procura o cabeçalho `Authorization`.
2. Se não achar, lança o erro `UnauthorizedException`.
3. Se achar, ele tenta rodar o `verifyAsync()`. Se a matemática da criptografia não bater com a nossa Chave Secreta, ele barra. Se bater, ele injeta os dados decodificados do usuário na requisição (`request['user'] = payload`) e libera o acesso retornando `true`.

### Passo 4: Protegendo a Casa (`TasksController`)
Para finalizar, fomos até o nosso Controller de tarefas e simplesmente adicionamos uma anotação no topo da classe:
```typescript
@UseGuards(AuthGuard)
```
Essa única linha aplica toda a regra complexa do Passo 3 em **todas as rotas** dentro daquele Controller, bloqueando o acesso de usuários anônimos.
