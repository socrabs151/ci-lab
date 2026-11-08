# ci-lab

Небольшой HTTP-сервис на Express, на котором собраны пайплайны для практики по CI/CD.

Демо: https://ci-lab-production.up.railway.app/health

## Стек

- Node.js 22, Express
- Jest + Supertest для тестов
- ESLint 9
- Docker
- Helm для Kubernetes

## Эндпоинты

| Метод | Путь | Описание |
|---|---|---|
| GET | `/health` | Проверка живости |
| GET | `/api/version` | Имя и версия из package.json |
| GET | `/api/users` | Тестовый список пользователей |
| POST | `/api/echo` | Возвращает тело запроса |

## Локальный запуск

```bash
npm ci
npm test
npm start
```

Приложение слушает порт 3000 (`PORT` переопределяет).

## Пайплайны

- `.github/workflows/ci.yml` — линт, тесты, сборка артефакта, уведомление на почту.
- `.github/workflows/release.yml` — релиз по тегу `v*` с changelog и прикреплённым архивом.
- `.gitlab-ci.yml` — тесты, SonarQube, сборка Docker-образа, миграции Flyway, деплой в Kubernetes через Helm.
- `.circleci/config.yml` — тесты и деплой на Railway при пуше в `main`.
- `Jenkinsfile` — многоэтапный пайплайн: сборка, тесты, SonarQube, Docker Hub, деплой в Railway.
- `helm/ci-lab` — чарт для Kubernetes.
- `db/migration` — миграции Flyway.

## Docker

```bash
docker compose up --build
```

Поднимает приложение и PostgreSQL 16.
