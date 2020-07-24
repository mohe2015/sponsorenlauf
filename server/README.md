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
