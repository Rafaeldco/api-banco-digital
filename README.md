# API Banco Digital

Projeto simples de uma API RESTful para um Banco Digital, os dados são persistidos em memória.
As funcionalidades são:

-   Criar conta bancária
-   Atualizar os dados do usuário da conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário
-   Excluir uma conta bancária

## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=123`
Esse endpoint lista todas as contas bancárias existentes.

### Criar conta bancária

#### `POST` `/contas`
Esse endpoint serve para criar uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`
Esse endpoint atualiza apenas os dados do usuário de uma conta bancária.


### Excluir Conta

#### `DELETE` `/contas/:numeroConta`
Esse endpoint serve para excluir uma conta bancária existente.

### Depositar

#### `POST` `/transacoes/depositar`
Esse endpoint serve para depositar um saldo em uma conta bancária.

### Sacar

#### `POST` `/transacoes/sacar`
Esse endpoint serve para realizar o saque de um valor em uma determinada conta bancária e registrar essa transação.

### Transferir

#### `POST` `/transacoes/transferir`
Esse endpoint permite a transferência de dinheiro de uma conta bancária para outra e registra essa transação.


### Saldo

#### `GET` `/transacoes/saldo?numero_conta=123&senha=123`
Esse endpoint retorna o saldo de uma conta bancária.


### Extrato

#### `GET` `/conta/extrato?numero_conta=123&senha=123`
Esse endpoint lista as transações realizadas de uma conta específica.


###### tags: `back-end` `nodeJS` `API REST`
