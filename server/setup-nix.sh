#! /usr/bin/env nix-shell
#! nix-shell -i bash -p pkg-config zlib openssl nodejs

#yarn # install all packages, so the node_modules folder is available

git clone https://github.com/prisma/prisma-engines/
cd prisma-engines
source .envrc # idk if needed
cargo build --release
cd ..

cp prisma-engines/target/release/introspection-engine node_modules/@prisma/cli/introspection-engine-linux-nixos
cp prisma-engines/target/release/migration-engine node_modules/@prisma/cli/migration-engine-linux-nixos
cp prisma-engines/target/release/query-engine node_modules/@prisma/cli/query-engine-linux-nixos
cp prisma-engines/target/release/prisma-fmt node_modules/@prisma/cli/prisma-fmt-linux-nixos

cp prisma-engines/target/release/introspection-engine node_modules/@prisma/sdk/introspection-engine-linux-nixos
cp prisma-engines/target/release/migration-engine node_modules/@prisma/sdk/migration-engine-linux-nixos
cp prisma-engines/target/release/query-engine node_modules/@prisma/sdk/query-engine-linux-nixos
cp prisma-engines/target/release/prisma-fmt node_modules/@prisma/sdk/prisma-fmt-linux-nixos
