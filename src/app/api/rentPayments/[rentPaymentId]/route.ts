import { DueDateOfRent, Prisma, RentPayment, RentPaymentStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";
import getNextDueDateFromState from "src/utils/get-next-due-date";

export async function PUT(request: Request, { params }: { params: { rentPaymentId: string } }) {
  try {
    const { rentPaymentId } = params;
    if (!rentPaymentId) return NextResponse.json({ error: "No rentPaymentId" }, { status: 400 });

    const currentRentPayment = await prisma.rentPayment.findUnique({
      where: { id: rentPaymentId },
      include: {
        renter: {
          include: {
            rentalAgreement: true,
          },
        },
      },
    });

    if (!currentRentPayment) {
      return NextResponse.json({ error: "RentPayment not found" }, { status: 404 });
    }

    const newStatus = currentRentPayment.status === RentPaymentStatus.PAID ? RentPaymentStatus.NOTPAID : RentPaymentStatus.PAID;

    await prisma.rentPayment.update({
      where: { id: currentRentPayment.id },
      data: { status: newStatus },
    });

    if (newStatus === RentPaymentStatus.PAID) {
      const dueDateState = currentRentPayment.renter?.rentalAgreement?.dueDateState;
      if (dueDateState) {
        const nextDueDate = getNextDueDateFromState(dueDateState, currentRentPayment.dueDate);

        const existingNextPayment = await prisma.rentPayment.findFirst({
          where: {
            renterId: currentRentPayment.renterId,
            dueDate: nextDueDate,
          },
        });

        if (!existingNextPayment) {
          await prisma.rentPayment.create({
            data: {
              renterId: currentRentPayment.renterId,
              paymentAmount: currentRentPayment.paymentAmount,
              dueDate: nextDueDate,
              paymentDate: nextDueDate,
              status: RentPaymentStatus.NOTPAID,
              rentalObjectId: currentRentPayment.rentalObjectId,
              landlordId: currentRentPayment.landlordId,
            },
          });
        }
      }
    }
    const allRentPayments = await prisma.rentPayment.findMany({
      where: { landlordId: currentRentPayment.landlordId },
      include: {
        renter: {
          include: {
            rentalAgreement: true,
          },
        },
      },
    });

    return NextResponse.json(allRentPayments);
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
