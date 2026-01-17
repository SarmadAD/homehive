/*
  Warnings:

  - A unique constraint covering the columns `[renterId]` on the table `RentalAgreement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RentalAgreement" ADD COLUMN     "renterId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "RentalAgreement_renterId_key" ON "RentalAgreement"("renterId");
