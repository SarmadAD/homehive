import { Landlord, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
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
