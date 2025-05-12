/*
  Warnings:

  - The `transactionId` column on the `RentPayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[transactionId]` on the table `RentPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RentPayment" DROP COLUMN "transactionId",
ADD COLUMN     "transactionId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_transactionId_key" ON "RentPayment"("transactionId");
