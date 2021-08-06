{ stdenv, pkgs, pkg-config, openssl, zlib, lib, perl, protobuf }:
pkgs.rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "2.28.0";
  
  nativeBuildInputs = [ pkg-config perl protobuf ]; # https://github.com/open-telemetry/opentelemetry-rust/blob/main/opentelemetry-otlp/build.rs
  # https://docs.rs/prost-build/0.8.0/prost_build/index.html

  buildInputs = [ openssl ];

  doCheck = false; # would need some env variables from a file

  src = pkgs.fetchFromGitHub {
    owner = "prisma";
    repo = pname;
    rev = version;
    sha256 = "sha256-3EHL/ZkY2h8P3OwMH2azFL+fehx7Y/nRrp+g04mxr7E=";
  };

  PROTOC = "${protobuf}/bin/protoc";
  PROTOC_INCLUDE = "${protobuf}/include";

  cargoSha256 = "sha256-OnA6n9OfVMMalyDBcXdauhRsZnwePsaxmFEkzCXPELE=";

  meta = with lib; {
    description = "Engine components of Prisma 2.";
    homepage = "https://github.com/prisma/prisma-engines";
    license = licenses.asl20;
  };
}
