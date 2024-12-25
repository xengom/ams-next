# DB

```bash
docker run -d \
  --name ams-db \
  -e POSTGRES_USER=dec \
  -e POSTGRES_PASSWORD=Abraham1! \
  -e POSTGRES_DB=ams \
  -p 5432:5432 \
  postgres -c search_path=public
```

# Prisma

```bash
npx prisma migrate dev --name init
```
