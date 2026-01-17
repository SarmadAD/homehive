/*
  Warnings:

  - You are about to drop the column `renterId` on the `RentalAgreement` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "RentalAgreement_renterId_key";

-- AlterTable
ALTER TABLE "RentalAgreement" DROP COLUMN "renterId";
