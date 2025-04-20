import { Prisma, Renter as ClientRenter } from "@prisma/client";
import { InviteEmail } from "../../../../landlordportal/dashboard/renters/InviteEmail";
import { NextResponse } from "next/server";
import { Renter } from "prisma/types/renter";
import { prisma } from "src/app/db/db";
import { Resend } from "resend";
import { json } from "stream/consumers";

export async function GET(request: Request, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  if (landlordId) {
    const landlords = await prisma.landlord.findUnique({
      where: { id: landlordId },
      include: { renters: true },
    });
    if (landlords) {
      const filterRenterWithStateZero = landlords.renters.filter((renter) => renter.state !== 0);
      return NextResponse.json(filterRenterWithStateZero);
    }
    return NextResponse.json({ error: "error" });
  }
}

export async function POST(request: Request, { params }: { params: { landlordId: string } }) {
  try {
    const { landlordId } = params;
    const renter: Renter = await request.json();
    if (landlordId) {
      const createdRenter = await prisma.renter.create({
        data: {
          firstname: renter.firstname,
          firebaseUserId: "",
          surname: renter.surname,
          email: renter.email,
          image: "",
          createdAt: renter.createdAt,
          landlords: { connect: [{ id: landlordId }] },
        },
      });
      if (createdRenter) {
        const resend = new Resend("re_L94tobgR_A4GqBSz6sfiv9JN85W6za5jC");
        const data = await resend.emails.send({
          from: "invite@homehive.me",
          to: createdRenter.email,
          subject: "Einladung zum Mieter-Portal",
          react: InviteEmail({ renter: createdRenter }),
        });
        return NextResponse.json({ data }, { status: 200 });
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
