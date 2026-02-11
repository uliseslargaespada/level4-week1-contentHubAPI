# level4-week1-contentHubAPI

This is a simple API project for a content hub API

### **Assignments for Day 1**

1. Add `GET /posts/:id` (with a 404 if missing) + tests
2. Add `DELETE /posts/:id` + tests and validations

### Assignments for Day 2

1. Add a different strategy to the pagination on the posts and comments
2. Add a query param to add the post comments in the get post response


## Content for Week 2

### Fix the Prisma issue
1. Remove the node_modules and package-lock.json
2. We need to install the updated versions of prisma and @prisma/client, they are given on the official site
```bash
npm install prisma
npm install @prisma/client @prisma/adapter-pg pg dotenv
```
3. You might get a vulnerability error, run `npm audit fix --force`
4. Modify the jsconfig.json
5. Run prisma npx initializer
```bash
npx prisma init --output ../generated/prisma
```
6. Run a migration or a reset
```bash
npx prisma migrate reset
npx prisma migrate dev --name init
```
7. Run the generate file and add it to the post install
```bash
npx prisma generate
```

