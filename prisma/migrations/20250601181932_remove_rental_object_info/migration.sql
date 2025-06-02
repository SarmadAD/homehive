/*
  Warnings:

  - You are about to drop the column `rentalObjectInfoId` on the `RentalObject` table. All the data in the column will be lost.
  - You are about to drop the `RentalObjectInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "RentalObject_rentalObjectInfoId_idx";

-- DropIndex
DROP INDEX "RentalObject_rentalObjectInfoId_key";

-- AlterTable
ALTER TABLE "RentalObject" DROP COLUMN "rentalObjectInfoId";

-- DropTable
DROP TABLE "RentalObjectInfo";
