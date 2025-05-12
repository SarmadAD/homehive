/*
  Warnings:

  - A unique constraint covering the columns `[authenticatedUserId]` on the table `Landlord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Landlord_authenticatedUserId_key" ON "Landlord"("authenticatedUserId");
