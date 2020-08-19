# nixos
# https://github.com/prisma/docs/issues/445
./setup-nix.sh

npx prisma migrate save --experimental
npx prisma migrate up --experimental
ts-node prisma/seed.ts

TODO https://github.com/graphql-nexus/nexus/issues/962
TODO https://github.com/graphql-nexus/nexus/issues/761#issuecomment-627989689
TODO https://github.com/graphql/express-graphql/issues/427#issuecomment-451542124
https://github.com/chance-get-yours/express-graphql/pull/1/files


Fixing roundCount:
```sql
CREATE INDEX "Round_studentId" ON "Round" ( "studentId" );
CREATE INDEX "Runner_roundCount_id" ON "Runner" ( "roundCount" DESC, "id" ASC );

-- returns number of invalid rows
UPDATE "Runner" SET "roundCount" = (SELECT COUNT(*) FROM "Round" WHERE "studentId" = "Runner"."id") WHERE "roundCount" != (SELECT COUNT(*) FROM "Round" WHERE "studentId" = "Runner"."id");
```

## Dangerous

### Postgresql

#### Dropping database

```
psql --db sponsorenlauf
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### Mariadb / Mysql

#### Dropping database

```
mysql
DROP DATABASE sponsorenlauf;
```