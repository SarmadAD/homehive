-- AlterTable
ALTER TABLE "Landlord" ADD COLUMN     "hasAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priceId" TEXT;
