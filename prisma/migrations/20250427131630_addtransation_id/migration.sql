/*
  Warnings:

  - Added the required column `transactionId` to the `RentPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentPayment" ADD COLUMN     "transactionId" TEXT NOT NULL;
