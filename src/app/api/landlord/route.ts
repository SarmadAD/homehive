import { Landlord } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function POST(request: Request) {
  const firebaseUserId: string = await request.text();
  if (!firebaseUserId) return NextResponse.json({ error: "firebaseUserId not there!" });
  await createLandlord(firebaseUserId);
  return NextResponse.json({ status: "Ok" });
}

const createLandlord = async (firebaseUserId: string) => {
  try {
    //create landlord
    await prisma.landlord.create({
      data: { firebaseUserId: firebaseUserId },
    });
    //assign user-Role Landlord
    await prisma.userRole.create({
      data: {
        firebaseUserId: firebaseUserId,
        role: { connect: { id: "20f9fbe2-0855-11ee-be56-0242ac130052" } },
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};

export async function GET(request: NextRequest) {
  const firebaseUserId = request.nextUrl.searchParams.get("fbId");
  if (!firebaseUserId) return NextResponse.json({ error: "firebaseUserId not there!" });
  const landlord = await getLandlord(firebaseUserId);
  if (landlord) {
    return NextResponse.json(landlord);
  }
  return NextResponse.json({ error: "landlord not found!" });
}

const getLandlord = async (firebaseUserId: string) => {
  try {
    return await prisma.landlord.findUnique({
      where: { firebaseUserId: firebaseUserId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};
