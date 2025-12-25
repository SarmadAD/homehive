import { Prisma, Renter } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  if (landlordId) {
    const rentalObjects = await prisma.rentalObject.findMany({
      where: { landlordId: landlordId, state: 1 },
      include: { renter: { where: { state: 1 } }, repairRequests: true, rentPayment: true },
    });
    if (rentalObjects.length > 0) {
      return NextResponse.json(rentalObjects);
    }
    return NextResponse.json([]);
  }
}

export async function POST(request: Request, { params }: { params: { landlordId: string } }) {
  try {
    const { landlordId } = params;
    const rentalObject: RentalObject = await request.json();
    if (landlordId) {
      const rentersId: Prisma.RenterWhereUniqueInput[] = rentalObject.renter.map((renter: Renter) => ({
        id: renter.id,
      }));

      const createdRentalObject = await prisma.rentalObject.create({
        data: {
          name: rentalObject.name,
          createdAt: rentalObject.createdAt,
          image: "",
          address: rentalObject.address,
          houseNr: rentalObject.houseNr,
          additionalHouseDetails: rentalObject.additionalHouseDetails,
          city: rentalObject.city,
          postalCode: rentalObject.postalCode,
          areaSize: rentalObject.areaSize,
          renter: { connect: rentersId },
          rentPayment: {
            create: rentalObject.rentPayment.map((rentPayment) => ({
              paymentAmount: rentPayment.paymentAmount,
              dueDate: rentPayment.dueDate,
              paymentDate: rentPayment.paymentDate,
              renter: { connect: { id: rentPayment.renter?.id } },
              status: rentPayment.status,
              landlord: { connect: { id: landlordId } },
            })),
          },
          landlord: {
            connect: {
              id: rentalObject.landlord.id,
            },
          },
        },
        include: { renter: true },
      });
      if (createdRentalObject) {
        return NextResponse.json(createdRentalObject);
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
    throw e;
  }
}
