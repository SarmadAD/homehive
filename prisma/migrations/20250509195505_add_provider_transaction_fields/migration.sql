/*
  Warnings:

  - A unique constraint covering the columns `[transactionId,accountId,renterId]` on the table `RentPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RentPayment_transactionId_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_transactionId_accountId_renterId_key" ON "RentPayment"("transactionId", "accountId", "renterId");
