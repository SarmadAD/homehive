/*
  Warnings:

  - The `rentalAgreementId` column on the `Renter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `renterId` on the `RentPayment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rentalObjectId` on the `RentPayment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rentalObjectId` on the `RentalAgreement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rentalObjectInfoId` on the `RentalObject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `landlordId` on the `RentalObject` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `rentalObjectId` on the `RepairRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `UserRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "Renter_email_key";

-- AlterTable
ALTER TABLE "RentPayment" DROP COLUMN "renterId",
ADD COLUMN     "renterId" UUID NOT NULL,
DROP COLUMN "rentalObjectId",
ADD COLUMN     "rentalObjectId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RentalAgreement" DROP COLUMN "rentalObjectId",
ADD COLUMN     "rentalObjectId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "RentalObject" DROP COLUMN "rentalObjectInfoId",
ADD COLUMN     "rentalObjectInfoId" UUID NOT NULL,
DROP COLUMN "landlordId",
ADD COLUMN     "landlordId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Renter" DROP COLUMN "rentalAgreementId",
ADD COLUMN     "rentalAgreementId" UUID;

-- AlterTable
ALTER TABLE "RepairRequest" DROP COLUMN "rentalObjectId",
ADD COLUMN     "rentalObjectId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "roleId",
ADD COLUMN     "roleId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "RentPayment_renterId_idx" ON "RentPayment"("renterId");

-- CreateIndex
CREATE INDEX "RentPayment_rentalObjectId_idx" ON "RentPayment"("rentalObjectId");

-- CreateIndex
CREATE INDEX "RentalAgreement_rentalObjectId_idx" ON "RentalAgreement"("rentalObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalObject_rentalObjectInfoId_key" ON "RentalObject"("rentalObjectInfoId");

-- CreateIndex
CREATE INDEX "RentalObject_rentalObjectInfoId_idx" ON "RentalObject"("rentalObjectInfoId");

-- CreateIndex
CREATE INDEX "RentalObject_landlordId_idx" ON "RentalObject"("landlordId");

-- CreateIndex
CREATE UNIQUE INDEX "Renter_rentalAgreementId_key" ON "Renter"("rentalAgreementId");

-- CreateIndex
CREATE INDEX "Renter_rentalAgreementId_idx" ON "Renter"("rentalAgreementId");

-- CreateIndex
CREATE INDEX "RepairRequest_rentalObjectId_idx" ON "RepairRequest"("rentalObjectId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");
