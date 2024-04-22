# DevOps
Este projeto é resultado do desafio [DevOps da Potência Tech](https://fuchsia-astronaut-ba6.notion.site/Devops-Desafio-Autodidata-Pot-ncia-Tech-5349d9d8d220482ca5a70a495aae25d9).

Com a disponibilização da API o desafio foi realizar o deploy, a criação de pipelines e a configuração do docker.

## Descrição das implementações realizadas:

<details>
  <summary>
    <b>Configuração do docker-compose do banco de dados</b>
  </summary>

  Na raiz do projeto foi criado o arquivo `docker-compose.yml` que coloca o banco de dados em um container.
  <br>

  ```
version: '3.9'

services:
  db:
    image: postgres:latest
    container_name: prisma-docker-db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: prisma
      POSTGRES_PASSWORD: prisma
      POSTGRES_DB: prisma-db
    networks:
      - desafio-devops
```

Visto que o schema fornecido na API é do Prisma foi utilizada a imagem do Postgres.
</details>

<details>
  <summary>
    <b>Pipeline de teste end to end</b>
  </summary>

  Para o pipeline de teste end to end foi utilizado workflow do GitHub Actions.<br>
  Criado o arquivo `run-e2e-tests.yml` no caminho `.github/workflows`.

  ```
name: Run E2E Tests

on:
  pull_request:
    branches:
      - main

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Start Docker Compose services
        run: docker-compose up -d

      - name: Wait for services to start
        run: sleep 10

      - name: Run E2E tests
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NODE_ENV: ${{ secrets.NODE_ENV }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
        run: npm run test:e2e

      - name: Stop Docker Compose services
        run: docker-compose down
  ```

<br>

Este workflow utiliza o GitHub Actions para, quando aberto Pull Request na branch main:
- instalar as dependência do projeto
- subir o container Docker do banco de dados
- rodar os testes de integração

</details>

<details>
  <summary>
    <b>Pipeline de teste unitário</b>
  </summary>

  Para o pipeline de testes unitários foi utilizado workflow do GitHub Actions.<br>
  Criado o seguinte arquivo `run-unit-tests.yml` no caminho `.github/workflows`.

  ```
name: Run Unit Tests

on:
  pull_request:
    branches:
      - main

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test
  ```

  Este workflow utiliza o GitHub Actions para, quando aberto Pull Request na branch main:
  - instala as dependências
  - roda os testes unitários
</details>

<details>
  <summary>
    <b>Pipeline de deploy automatizado</b>
  </summary>

  Criado o arquivo `deploy.yml` no caminho `.github/workflows`. <br>
  O deploy foi realizado pelo [Render](https://render.com/).<br>
  Workflow do GitHub Actions
  ```
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Check out the repo
        uses: actions/checkout@v3

      - name: Deploy to production
        uses: JorgeLNJunior/render-deploy@v1.4.4
        with:
          api_key: ${{ secrets.RENDER_API_KEY }}
          service_id: ${{ secrets.SERVICE_ID }}
          wait_deploy: true
  ```
  Este workflow utiliza o GitHub Actions para realizar deploy no Render quando houver qualquer modificação na branch main.
</details>

## Quer testar?
Endpoint: https://desafio-2-devops.onrender.com/users. <br>
Método: POST <br>
Formato de body:
```
{
    "name": "Test",
    "email": "test@gmail.com",
    "password": "test"
}
```

## Stacks
GitHub | GitHubActions | Render | Postgree | Docker