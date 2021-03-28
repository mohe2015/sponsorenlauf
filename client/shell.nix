{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    buildInputs = [
        nodejs-15_x
        watchman
        nodePackages.npm-check-updates
    ];
}
