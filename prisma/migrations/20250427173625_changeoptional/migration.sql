-- AlterTable
ALTER TABLE "RentPayment" ALTER COLUMN "transactionId" DROP NOT NULL;

-- DropEnum
DROP TYPE "RentalObjectStatus";
