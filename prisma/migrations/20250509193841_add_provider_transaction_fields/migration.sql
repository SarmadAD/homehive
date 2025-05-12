/*
  Warnings:

  - A unique constraint covering the columns `[transactionId,accountId]` on the table `RentPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RentPayment" ADD COLUMN     "accountId" UUID,
ALTER COLUMN "transactionId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_transactionId_accountId_key" ON "RentPayment"("transactionId", "accountId");
