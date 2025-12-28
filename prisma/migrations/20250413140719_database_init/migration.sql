-- CreateEnum
CREATE TYPE "RentalObjectStatus" AS ENUM ('INHABITED', 'UNINHABITED');

-- CreateEnum
CREATE TYPE "DueDateOfRent" AS ENUM ('FIRSTMONTH', 'MIDDLEMONTH', 'ENDMONTH');

-- CreateEnum
CREATE TYPE "RentPaymentStatus" AS ENUM ('PAID', 'NOTPAID', 'INARREARS');

-- CreateEnum
CREATE TYPE "RepairRequestStatus" AS ENUM ('REQUESTED', 'REJECTED', 'DONE', 'CANCELED', 'INPROGRESS');

-- CreateTable
CREATE TABLE "RentalObject" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" "RentalObjectStatus" NOT NULL,
    "address" TEXT NOT NULL,
    "houseNr" INTEGER NOT NULL,
    "additionalHouseDetails" TEXT DEFAULT '',
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "areaSize" INTEGER NOT NULL,
    "rentalObjectInfoId" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RentalObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Renter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firebaseUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surname" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rentalObjectId" TEXT,
    "rentalAgreementId" TEXT,
    "state" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Renter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Landlord" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firebaseUserId" TEXT NOT NULL,

    CONSTRAINT "Landlord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalObjectInfo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "baseRent" INTEGER NOT NULL,
    "heatingCosts" INTEGER NOT NULL,
    "waterCosts" INTEGER NOT NULL,
    "electricityCosts" INTEGER NOT NULL,

    CONSTRAINT "RentalObjectInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairRequest" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "status" "RepairRequestStatus" NOT NULL,
    "comment" TEXT DEFAULT '',
    "renterId" TEXT NOT NULL,
    "rentalObjectId" TEXT NOT NULL,

    CONSTRAINT "RepairRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firebaseUserId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentPayment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "RentPaymentStatus" NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "renterId" TEXT NOT NULL,
    "rentalObjectId" TEXT NOT NULL,

    CONSTRAINT "RentPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalAgreement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dueDateState" "DueDateOfRent" NOT NULL,
    "rentalObjectId" TEXT NOT NULL,

    CONSTRAINT "RentalAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LandlordToRenter" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RentalObject_rentalObjectInfoId_key" ON "RentalObject"("rentalObjectInfoId");

-- CreateIndex
CREATE INDEX "RentalObject_rentalObjectInfoId_idx" ON "RentalObject"("rentalObjectInfoId");

-- CreateIndex
CREATE INDEX "RentalObject_landlordId_idx" ON "RentalObject"("landlordId");

-- CreateIndex
CREATE UNIQUE INDEX "Renter_email_key" ON "Renter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Renter_rentalAgreementId_key" ON "Renter"("rentalAgreementId");

-- CreateIndex
CREATE INDEX "Renter_rentalObjectId_idx" ON "Renter"("rentalObjectId");

-- CreateIndex
CREATE INDEX "Renter_rentalAgreementId_idx" ON "Renter"("rentalAgreementId");

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_firebaseUserId_key" ON "Landlord"("firebaseUserId");

-- CreateIndex
CREATE INDEX "RepairRequest_renterId_idx" ON "RepairRequest"("renterId");

-- CreateIndex
CREATE INDEX "RepairRequest_rentalObjectId_idx" ON "RepairRequest"("rentalObjectId");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "RentPayment_renterId_idx" ON "RentPayment"("renterId");

-- CreateIndex
CREATE INDEX "RentPayment_rentalObjectId_idx" ON "RentPayment"("rentalObjectId");

-- CreateIndex
CREATE INDEX "RentalAgreement_rentalObjectId_idx" ON "RentalAgreement"("rentalObjectId");

-- CreateIndex
CREATE UNIQUE INDEX "_LandlordToRenter_AB_unique" ON "_LandlordToRenter"("A", "B");

-- CreateIndex
CREATE INDEX "_LandlordToRenter_B_index" ON "_LandlordToRenter"("B");
