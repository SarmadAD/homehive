import { Prisma, Renter } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { objectId: string } }) {
  const { objectId } = params;
  if (objectId) {
    const rentalObject = await prisma.rentalObject.findFirst({
      where: { id: objectId },
      include: {
        renter: { include: { rentalAgreement: true, rentPayment: true } },
        rentalAgreement: true,
        rentalObjectInfo: true,
        repairRequests: { include: { renter: true } },
      },
    });
    if (rentalObject) {
      return NextResponse.json(rentalObject);
    }
    return NextResponse.json({ error: "rentalObject not found" });
  }
}

export async function PUT(request: Request, { params }: { params: { objectId: string } }) {
  try {
    const { objectId } = params;
    const rentalObject: RentalObject = await request.json();
    if (objectId) {
      const rentersId: Prisma.RenterWhereUniqueInput[] = rentalObject.renter.map((renter: Renter) => ({
        id: renter.id,
      }));
      const updatedRentalObject = await prisma.rentalObject.update({
        where: { id: objectId },
        data: {
          name: rentalObject.name,
          createdAt: rentalObject.createdAt,
          status: rentalObject.status,
          image: "",
          address: rentalObject.address,
          houseNr: rentalObject.houseNr,
          additionalHouseDetails: rentalObject.additionalHouseDetails,
          city: rentalObject.city,
          postalCode: rentalObject.postalCode,
          renter: { connect: rentersId },
          areaSize: rentalObject.areaSize,
          // rentalAgreement: {
          //   upsert: rentalObject.rentalAgreement.map((agreement) => ({
          //     where: { id: agreement.id },
          //     update: {
          //       dueDate: agreement.dueDate,
          //       dueDateState: agreement.dueDateState,
          //       renter: { connect: { id: agreement.renter?.id } },
          //     },
          //     create: {
          //       dueDate: agreement.dueDate,
          //       dueDateState: agreement.dueDateState,
          //       renter: { connect: { id: agreement.renter?.id } },
          //     },
          //   })),
          // },
          rentalObjectInfo: {
            update: {
              baseRent: rentalObject.rentalObjectInfo.baseRent,
              electricityCosts: rentalObject.rentalObjectInfo.electricityCosts,
              heatingCosts: rentalObject.rentalObjectInfo.heatingCosts,
              waterCosts: rentalObject.rentalObjectInfo.waterCosts,
            },
          },
        },
      });
      if (updatedRentalObject) {
        return NextResponse.json(updatedRentalObject);
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientRustPanicError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: e.message });
    }
  }
}
