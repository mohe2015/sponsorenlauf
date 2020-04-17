yalc add nexus
yarn

yarn install
env DATABASE_URL=file:dev.db yarn prisma migrate save --experimental
env DATABASE_URL=file:dev.db yarn prisma migrate up --experimental
yarn prisma generate
DATABASE_URL=file:dev.db yarn ts-node prisma/seed.ts
yarn dev