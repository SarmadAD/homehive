import { Prisma, Renter as ClientRenter } from "@prisma/client";
import { NextResponse } from "next/server";
import { Renter } from "prisma/types/renter";
import { prisma } from "src/app/db/db";
import { createClient } from "@supabase/supabase-js";

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
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request, { params }: { params: { landlordId: string } }) {
  try {
    const { landlordId } = params;
    const renter: Renter = await request.json();
    if (landlordId) {
      const createdRenter = await prisma.renter.create({
        data: {
          firstname: renter.firstname,
          authenticatedUserId: "00000000-0000-0000-0000-000000000000",
          surname: renter.surname,
          email: renter.email,
          image: "",
          createdAt: renter.createdAt,
          landlords: { connect: [{ id: landlordId }] },
        },
      });
      if (createdRenter) {
        const buildRegisterLink =
          process.env.NODE_ENV === "production"
            ? `https://homehive.me/auth/supabase/sign-up/invite/:renterId?renterId=${createdRenter.id}`
            : `http://localhost:3000/auth/supabase/sign-up/invite/:renterId?renterId=${createdRenter.id}`;

        const { error } = await supabase.auth.admin.inviteUserByEmail(createdRenter.email, {
          redirectTo: buildRegisterLink,
        });
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(createdRenter, { status: 200 });
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
