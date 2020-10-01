{ stdenv, pkgs, pkg-config, openssl, zlib, lib }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.8.0";
  
  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ openssl zlib ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = "2.8.0";
    sha256 = "RlCs/HdVxt72ln9jZFjFsyucaO/S+mqQ1sTUQEZpL1I=";
  };

  cargoSha256 = "SHKrJt4WrgDECFNGHzW/f42jJVKJzwqPWyHca3thrZA=";

  meta = with stdenv.lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
