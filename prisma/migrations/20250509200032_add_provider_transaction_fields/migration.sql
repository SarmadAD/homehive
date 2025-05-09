/*
  Warnings:

  - You are about to drop the column `accountId` on the `RentPayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId,renterId]` on the table `RentPayment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RentPayment_transactionId_accountId_renterId_key";

-- AlterTable
ALTER TABLE "RentPayment" DROP COLUMN "accountId";

-- CreateIndex
CREATE UNIQUE INDEX "RentPayment_transactionId_renterId_key" ON "RentPayment"("transactionId", "renterId");
