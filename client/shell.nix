{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    buildInputs = [
        nodejs
        watchman
        nodePackages.npm-check-updates
    ];
}
