# B-Gym

Projeto full stack do B-Gym com:

- API REST em JavaScript com Express
- Aplicação Web em React para cadastro, login e acompanhamento do treino diário
- Documentação Swagger/OpenAPI
- Automação de testes de API com Mocha, Chai e Supertest
- Automação de testes Web com Cypress

O contrato principal da API está definido em [`./docs/swagger.yaml`](./docs/swagger.yaml).

## Requisitos

- Node.js 24+
- npm 11+

## Como executar

```bash
npm install
npm run build
npm start
```

Serviços disponíveis por padrão:

- Aplicação Web em `http://localhost:3000`
- Swagger renderizado em `http://localhost:3000/docs`
- Swagger estático em `http://localhost:3000/docs/swagger.yaml`
- Base da API em `http://localhost:3000/api`

## Desenvolvimento

Para rodar a interface Web em modo de desenvolvimento:

```bash
npm run dev:client
```

Para publicar a interface pelo Express, gere a build com:

```bash
npm run build
```

Para executar a API localmente em modo de desenvolvimento:

```bash
npm run dev
```

## Testes automatizados

Testes de API:

```bash
npm test
```

Ou diretamente:

```bash
npm run test:api
```

Testes Web end-to-end:

```bash
npm run test:web
```

Para abrir o Cypress em modo interativo:

```bash
npm run test:web:open
```

## Estrutura do projeto

- `src/`: Backend da API, regras de negócio, middleware e servidor Express
- `web/`: Aplicação Web em React
- `test/`: Automação de testes de API, fixtures e helpers
- `cypress/`: Automação de testes Web
- `docs/`: Especificação Swagger/OpenAPI
- `scripts/`: Scripts auxiliares de execução

## Endpoints implementados

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me/workout/today`
- `GET /api/me/workout/today/progress`
- `GET /api/me/workout/today/exercises/:exerciseId`
- `PUT /api/me/workout/today/exercises/:exerciseId/completion`

## Regras implementadas

- Cadastro com e-mail único
- Autenticação com bearer token JWT
- Ciclo fixo de 3 dias: superiores, inferiores e cardio
- Progresso diário persistido em memória por usuário
- Reinício automático do progresso quando um novo dia do ciclo inicia
