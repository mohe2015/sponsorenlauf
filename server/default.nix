with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "sponsorenlauf-dev-environment";
  buildInputs = [ pkg-config zlib openssl nodejs ];
}
