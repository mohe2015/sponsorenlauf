{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    buildInputs = [
        bashInteractive
        nodejs-16_x
        watchman
        nodePackages.npm-check-updates
    ];
}
