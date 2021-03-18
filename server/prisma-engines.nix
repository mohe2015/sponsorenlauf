{ stdenv, pkgs, pkg-config, openssl, zlib, lib, perl }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.19.0";
  
  nativeBuildInputs = [ pkg-config perl ];

  buildInputs = [ openssl ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = version;
    sha256 = "TPY5HrW3WoVEvH6VansYfk7FNOOLcxfYReuNvT7rBxs=";
  };

  cargoSha256 = "TBdsmcomxRzw90CYzfqRu43N+HYPo1b/GJzXWOfHlJY=";

  meta = with lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
