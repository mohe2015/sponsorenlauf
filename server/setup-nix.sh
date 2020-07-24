yarn # install all packages, so the node_modules folder is available
nix-shell
git clone https://github.com/prisma/prisma-engines/
cd prisma-engines
source .envrc # idk if needed
cargo build --release
exit # nix-shell
cp target/release/introspection-engine ../node_modules/@prisma/cli/introspection-engine-linux-nixos
cp target/release/migration-engine ../node_modules/@prisma/cli/migration-engine-linux-nixos
cp target/release/query-engine ../node_modules/@prisma/cli/query-engine-linux-nixos
cp target/release/prisma-fmt ../node_modules/@prisma/cli/prisma-fmt-linux-nixos
cd ..
yarn prisma migrate save --experimental
# ...
