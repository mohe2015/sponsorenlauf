{ stdenv, pkgs, pkg-config, openssl, zlib, lib }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.9.0";
  
  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ openssl zlib ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = "${version}";
    sha256 = "+zIsJj27DXbbUcQuJmWb2REH7f9TBg/7JLHHq8XU6K4=";
  };

  cargoSha256 = "/34sqzdCcxSLbB8peqYQQjPrdASTSHE6Td30f0/iEcE=";

  meta = with stdenv.lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
