/*
  Warnings:

  - You are about to drop the column `firebaseUserId` on the `Landlord` table. All the data in the column will be lost.
  - You are about to drop the column `firebaseUserId` on the `Renter` table. All the data in the column will be lost.
  - You are about to drop the column `firebaseUserId` on the `UserRole` table. All the data in the column will be lost.
  - Added the required column `authenticatedUserId` to the `Landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authenticatedUserId` to the `Renter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authenticatedUserId` to the `UserRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Landlord_firebaseUserId_key";

-- AlterTable
ALTER TABLE "Landlord" DROP COLUMN "firebaseUserId",
ADD COLUMN     "authenticatedUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Renter" DROP COLUMN "firebaseUserId",
ADD COLUMN     "authenticatedUserId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" DROP COLUMN "firebaseUserId",
ADD COLUMN     "authenticatedUserId" UUID NOT NULL;
