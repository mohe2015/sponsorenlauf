{ stdenv, pkgs, pkg-config, openssl, zlib, lib }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.6.0";
  
  nativeBuildInputs = [ pkg-config ];

  buildInputs = [ openssl zlib ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "mohe2015";
    repo = pname;
    rev = "fix-cargo-vendor";
    sha256 = "12r3zrbdnbnddm4xv0ixg4jscsdqyx8g1fgpg4lb53x4aw7dsqaf";
  };

  cargoSha256 = "1lhlnn9n15rz7p3b0bni04cbb2ski6ny2g2slapz52j004jmp98j";

  meta = with stdenv.lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}