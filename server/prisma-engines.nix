{ stdenv, pkgs, pkg-config, openssl, zlib, lib }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.10.0";
  
  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ openssl zlib ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = version;
    sha256 = "2Hobuj0sz4VWtVIl4prMNiD17AWD+W6oad2jgRwK758=";
  };

  cargoSha256 = "pfTuXjrwR7yxccLpqZO6R79vyJZfNClhSEmgoyNDnm4=";

  meta = with stdenv.lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
