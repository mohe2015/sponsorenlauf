{ stdenv, pkgs, pkg-config, openssl, zlib, lib, perl }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.17.0";
  
  nativeBuildInputs = [ pkg-config perl ];

  buildInputs = [ openssl zlib ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = "2.17.0";
    sha256 = "42p8O05tz7AbGPGVITjrRtvt7PoAL10tQi5+fvvBy+M=";
  };

  cargoSha256 = "iiSXmKIImm9CxXW5HmxUM9Me5wtGueLVjRhtGWksz4s=";

  meta = with lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
