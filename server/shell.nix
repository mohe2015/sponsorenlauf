{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    buildInputs = [
        nodejs-16_x
        prisma-engines
        nodePackages.npm-check-updates
    ];
}
