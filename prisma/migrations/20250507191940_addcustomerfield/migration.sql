/*
  Warnings:

  - A unique constraint covering the columns `[customerId]` on the table `Landlord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Landlord" ADD COLUMN     "customerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_customerId_key" ON "Landlord"("customerId");
