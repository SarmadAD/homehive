import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: Request, { params }: { params: { renterId: string } }) {
  const { renterId } = params;
  if (renterId) {
    const renter = await prisma.renter.findFirst({
      where: { id: renterId },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "renter not found" });
  }
}

export async function PUT(request: Request, { params }: { params: { renterId: string } }) {
  const { renterId } = params;
  const firebaseUserId: string = await request.text();
  if (renterId) {
    const renter = await prisma.renter.update({
      where: { id: renterId },
      data: {
        firebaseUserId: firebaseUserId,
      },
    });
    await prisma.userRole.create({
      data: {
        firebaseUserId: firebaseUserId,
        role: { connect: { id: "20f9fbe2-0855-11ee-be56-0242ac120052" } },
      },
    });
    if (renter) {
      return NextResponse.json(renter);
    }
    return NextResponse.json({ error: "renter not found" });
  }
}

export async function DELETE(request: Request, { params }: { params: { renterId: string } }) {
  try {
    const { renterId } = params;
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
