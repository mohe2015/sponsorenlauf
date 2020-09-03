{ pkgs ? import <nixpkgs> {} }:
with pkgs;
mkShell {
    buildInputs = [
        yarn
        nodejs
        watchman
    ];
}
