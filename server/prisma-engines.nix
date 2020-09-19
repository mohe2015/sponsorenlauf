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
    rev = "2.8.0-dev.16";
    sha256 = "pvmQuPt/I/gN9y5kI4m+bi/lPBI8ozd/9ux6ZiyJop8=";
  };

  cargoSha256 = "J2qCXJtcv7eCKWKMv/UTGbCBtGDaj4I5WeNZngS0mRs=";

  meta = with stdenv.lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
