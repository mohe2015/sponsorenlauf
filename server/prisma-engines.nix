{ fetchFromGitHub
, lib
, openssl
, pkg-config
, protobuf
, rustPlatform
}:

rustPlatform.buildRustPackage rec {
  pname = "prisma-engines";
  version = "3.0.1";

  src = fetchFromGitHub {
    owner = "prisma";
    repo = "prisma-engines";
    rev = version;
    sha256 = "sha256-nMueE7BpLL7xI4/tJO9QgKcZSqLMr0AJudOb2cf0Bmc=";
  };

  # Use system openssl.
  OPENSSL_NO_VENDOR = 1;

  cargoSha256 = "sha256-5xD/no5iT2Eh6fF6JNJopMQcasxe/6JJEy11I4PlWbA=";

  nativeBuildInputs = [ pkg-config ];
  buildInputs = [ openssl protobuf ];

  preBuild = ''
    export PROTOC=${protobuf}/bin/protoc
    export PROTOC_INCLUDE="${protobuf}/include";
    export OPENSSL_DIR=${lib.getDev openssl}
    export OPENSSL_LIB_DIR=${openssl.out}/lib
  '';

  # Tests are long to compile
  doCheck = false;

  meta = with lib; {
    description = "A collection of engines that power the core stack for Prisma";
    homepage = "https://www.prisma.io/";
    license = licenses.asl20;
    maintainers = with maintainers; [ pamplemousse ];
  };
}
