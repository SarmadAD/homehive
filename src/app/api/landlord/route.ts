import { Landlord, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { firebaseUserId }: Partial<Landlord> = await req.json();
  if (!firebaseUserId) return NextResponse.json({ error: "firebaseUserId not there!" });
  await createLandlord(firebaseUserId);
  return NextResponse.json({ status: "Ok" });
}

const createLandlord = async (firebaseUserId: string) => {
  try {
    await prisma.landlord.create({
      data: { firebaseUserId: firebaseUserId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};

export async function GET(req: NextRequest) {
  const firebaseUserId = req.nextUrl.searchParams.get("fbId");
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
