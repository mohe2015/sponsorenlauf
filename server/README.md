
TODO FIXME add permissions again




You need database creation privileges for the shadow database

services.mysql = {
    enable = true;
    ensureUsers = [
      {
        name = "moritz";
        ensurePermissions = {
          "*.*" = "ALL PRIVILEGES";
        };
      }
    ];
    ensureDatabases = [ "sponsorenlauf" ];
  };




npm install
npx prisma migrate dev --name init


yarn ts-node prisma/seed.ts
yarn ts-node --transpile-only api/schema.ts
yarn ts-node-dev --no-notify --respawn --transpile-only api/app.ts

https://graphql-nexus-schema-website.netlify.app/


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
sudo -u postgres psql --u postgres
DROP DATABASE sponsorenlauf;
```

### Mariadb / Mysql

#### Dropping database

```
mysql
DROP DATABASE sponsorenlauf;
```