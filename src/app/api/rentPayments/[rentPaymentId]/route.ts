import { Prisma, RentPayment } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function PUT(request: Request, { params }: { params: { rentPaymentId: string } }) {
  try {
    const { rentPaymentId } = params;
    const rentPayment: RentPayment = await request.json();
    if (rentPaymentId) {
      const updatedRentPayment = await prisma.rentPayment.update({
        where: { id: rentPaymentId },
        data: { status: rentPayment.status },
      });
      if (updatedRentPayment) {
        return NextResponse.json(updatedRentPayment);
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
