/*
  Warnings:

  - Added the required column `landlordId` to the `RentalAgreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalAgreement" ADD COLUMN     "landlordId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "RentalAgreement_landlordId_idx" ON "RentalAgreement"("landlordId");
