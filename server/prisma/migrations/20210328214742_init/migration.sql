-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'VIEWER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Runner" (
    "id" TEXT NOT NULL,
    "startNumber" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clazz" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "roundCount" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.name_unique" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Runner.startNumber_unique" ON "Runner"("startNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Runner.name_unique" ON "Runner"("name");

-- AddForeignKey
ALTER TABLE "Round" ADD FOREIGN KEY ("studentId") REFERENCES "Runner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Round" ADD FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
