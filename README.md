# B-Gym API

API REST em JavaScript com Express e banco de dados em memoria para implementar o contrato definido em `./docs/swagger.yaml`.
Agora o projeto tambem inclui uma aplicacao Web em React para cadastro, login e acompanhamento do treino diario.

## Requisitos

- Node.js 24+
- npm 11+

## Como executar

```bash
npm install
npm run build
npm start
```

Servidor padrao:

- `http://localhost:3000`
- Aplicacao Web em `http://localhost:3000`
- Swagger renderizado em `http://localhost:3000/docs`
- Swagger estatico em `http://localhost:3000/docs/swagger.yaml`
- Base da API em `http://localhost:3000/api`

## Desenvolvimento do frontend

```bash
npm run dev:client
```

Para publicar a interface pelo Express, gere a build com:

```bash
npm run build
```

## Endpoints implementados

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/me/workout/today`
- `GET /api/me/workout/today/progress`
- `GET /api/me/workout/today/exercises/:exerciseId`
- `PUT /api/me/workout/today/exercises/:exerciseId/completion`

## Regras implementadas

- cadastro com e-mail unico
- autenticacao com bearer token JWT
- ciclo fixo de 3 dias: superiores, inferiores e cardio
- progresso diario persistido em memoria por usuario
- reinicio automatico do progresso quando um novo dia do ciclo inicia
