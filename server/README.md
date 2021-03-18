
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



https://nexusjs.org/docs/plugins/prisma/removing-the-nexus-plugin-prisma


npm install
npx prisma migrate dev --name init


npx ts-node --transpile-only api/schema.ts
npx ts-node-dev --no-notify --respawn --transpile-only api/app.ts


```sql
VACUUM FULL VERBOSE ANALYZE;

EXPLAIN ANALYZE 

psql --db sponsorenlauf -XqAt -f explain.sql > analyze.json
https://explain.dalibo.com/

# important
CREATE INDEX "Round_studentId" ON "Round" ( "studentId" );

CREATE INDEX "Runner_roundCount_id" ON "Runner" ( "roundCount" DESC, "id" ASC );

# TO FIX the roundCount if it ever gets out of sync
UPDATE "Runner" SET "roundCount" = (SELECT COUNT(*) FROM "Round" WHERE "studentId" = "Runner"."id") WHERE "roundCount" != (SELECT COUNT(*) FROM "Round" WHERE "studentId" = "Runner"."id");


SELECT * FROM "Runner" WHERE "Runner".id > 'ckdlmkrac31231f1gq65owfd1g' ORDER BY "Runner"."roundCount" DESC, "Runner".id ASC LIMIT 25;
 Limit  (cost=0.28..2.81 rows=25 width=55) (actual time=0.128..0.160 rows=25 loops=1)
   ->  Index Scan using "Runner_roundCount_id" on "Runner"  (cost=0.28..101.75 rows=999 width=55) (actual time=0.126..0.153 rows=25 loops=1)
         Index Cond: (id > 'ckdlmkrac31231f1gq65owfd1g'::text)
 Planning Time: 0.564 ms
 Execution Time: 0.215 ms
(5 rows)
```
