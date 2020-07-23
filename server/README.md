# nixos
# https://github.com/prisma/docs/issues/445
nix-shell
cd prisma-engines
source .envrc
cargo build --release
cd ..
export PRISMA_MIGRATION_ENGINE_BINARY=./prisma-engines/target/release/migration-engine
export PRISMA_INTROSPECTION_ENGINE_BINARY=./prisma-engines/target/release/introspection-engine
export PRISMA_QUERY_ENGINE_BINARY=./prisma-engines/target/release/query-engine
export PRISMA_FMT_BINARY=./prisma-engines/target/release/prisma-fmt


# https://github.com/prisma/specs/blob/master/binaries/Readme.md#environment-variables

npx prisma migrate save --experimental
npx prisma migrate up --experimental
ts-node prisma/seed.ts

TODO https://github.com/graphql-nexus/nexus/issues/962
TODO https://github.com/graphql-nexus/nexus/issues/761#issuecomment-627989689
TODO https://github.com/graphql/express-graphql/issues/427#issuecomment-451542124
https://github.com/chance-get-yours/express-graphql/pull/1/files
