/*
  Warnings:

  - A unique constraint covering the columns `[role]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `postalCode` on the `RentalObject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "RentalObject" DROP COLUMN "postalCode",
ADD COLUMN     "postalCode" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Token" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "accessToken" TEXT NOT NULL,
    "expiresIn" INTEGER NOT NULL,
    "idHint" TEXT,
    "scope" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "landlordId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Token_landlordId_idx" ON "Token"("landlordId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role"("role");
