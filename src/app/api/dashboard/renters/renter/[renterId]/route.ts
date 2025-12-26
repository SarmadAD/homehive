import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

type Params = { renterId: string };

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const { renterId } = await params;
  if (renterId) {
    const renter = await prisma.renter.findUnique({
      where: { id: renterId },
      include: { rentPayment: true, rentalAgreement: true },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "Renter not found" });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { renterId } = await params;
    const authenticatedUserId: string = await request.text();
    if (renterId) {
      const renter = await prisma.renter.update({
        where: { id: renterId },
        data: {
          authenticatedUserId: authenticatedUserId,
        },
      });
      await prisma.userRole.create({
        data: {
          authenticatedUserId: authenticatedUserId,
          role: { connect: { id: "20f9fbe2-0855-11ee-be56-0242ac120044" } },
        },
      });
      if (renter) {
        return NextResponse.json(renter);
      }
      return NextResponse.json({ error: "renter not found" });
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

export async function DELETE(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { renterId } = await params;

    await prisma.rentalAgreement.deleteMany({
      where: { renter: { id: renterId } },
    });

    if (renterId) {
      const deletedRenter = await prisma.renter.update({
        where: { id: renterId },
        data: {
          state: 0,
        },
      });
      if (deletedRenter) {
        return NextResponse.json(deletedRenter);
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
