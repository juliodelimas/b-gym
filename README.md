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
npm run build:web
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
npm run dev:web
```

Para publicar a interface pelo Express, gere a build com:

```bash
npm run build
```

Ou diretamente:

```bash
npm run build:web
```

Para executar a API localmente em modo de desenvolvimento:

```bash
npm run dev
```

Ou diretamente:

```bash
npm run dev:api
```

## Testes automatizados

Para rodar somente os testes de API:

```bash
npm run test:api
```

Para rodar toda a suíte automatizada:

```bash
npm test
```

Ou diretamente:

```bash
npm run test:all
```

Testes Web end-to-end:

```bash
npm run test:web
```

Esse comando gera a build da interface, sobe a aplicação localmente e executa a suíte Cypress em modo headless.

Para abrir o Cypress em modo interativo:

```bash
npm run test:web:open
```

Para gerar apenas a build usada nos testes Web:

```bash
npm run test:web:prepare
```

O relatório HTML da execução Web é gerado em `cypress/reports/index.html`.

## Pipeline

O repositório possui um workflow do GitHub Actions em [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).

Ele executa:

- `npm run test:api`
- `npm run test:web`

Ao final, a pipeline publica os relatórios HTML e JSON como artefatos da execução:

- `test/reports`
- `cypress/reports`

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
