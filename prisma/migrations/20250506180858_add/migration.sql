-- AlterTable
ALTER TABLE "RentalObjectInfo" ADD COLUMN     "serviceCharges" INTEGER,
ALTER COLUMN "baseRent" DROP NOT NULL,
ALTER COLUMN "heatingCosts" DROP NOT NULL,
ALTER COLUMN "waterCosts" DROP NOT NULL,
ALTER COLUMN "electricityCosts" DROP NOT NULL;
