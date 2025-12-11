# DB

## Init fresh clone

Install PostgreSQL 17 and create database users (password is the db name) with databases:

```bash
createuser all_personal_projects_prod -P --createdb
createdb all_personal_projects_prod -O all_personal_projects_prod
createuser all_personal_projects_staging -P --createdb
createdb all_personal_projects_staging -O all_personal_projects_staging
createuser all_personal_projects_dev -P --createdb
createdb all_personal_projects_dev -O all_personal_projects_dev
cd ./packages/db/
dotenv -f .env.prod run -- npx prisma migrate deploy
dotenv -f .env.staging run -- npx prisma migrate deploy
dotenv -f .env.dev run -- npx prisma migrate deploy
```

## Todos

-

## Done

- started with `schema.prisma` and tested migrations
- `copy.ts` to copy DBs, e.g. dev to staging
