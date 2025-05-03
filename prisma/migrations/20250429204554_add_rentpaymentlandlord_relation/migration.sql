/*
  Warnings:

  - Added the required column `landlordId` to the `RentPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentPayment" ADD COLUMN     "landlordId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "RentPayment_landlordId_idx" ON "RentPayment"("landlordId");
