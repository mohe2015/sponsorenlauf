{ pkgs ? import <nixpkgs> {} }:
with pkgs;
let
  prisma-engines = (callPackage ./prisma-engines.nix {});
in
mkShell {
    buildInputs = [
        nodejs-16_x
        prisma-engines
        nodePackages.npm-check-updates
    ];
    shellHook = ''
        export PRISMA_MIGRATION_ENGINE_BINARY=${prisma-engines}/bin/migration-engine
        export PRISMA_INTROSPECTION_ENGINE_BINARY=${prisma-engines}/bin/introspection-engine
        export PRISMA_QUERY_ENGINE_BINARY=${prisma-engines}/bin/query-engine
        export PRISMA_FMT_BINARY=${prisma-engines}/bin/prisma-fmt
    '';
}
