import { NextRequest, NextResponse } from "next/server";

import { prisma } from "src/app/db/db";

export async function POST(request: Request) {
  const authenticatedUserId: string = await request.text();
  if (!authenticatedUserId) return NextResponse.json({ error: "authenticatedUserId not there!" }, { status: 400 });
  await createLandlord(authenticatedUserId);
  return NextResponse.json({ status: "Ok" }, { status: 200 });
}

const createLandlord = async (authenticatedUserId: string) => {
  try {
    // Get Landlord
    const landlordRole = await prisma.role.findUnique({
      where: { id: "20f9fbe2-0855-11ee-be56-0242ac120055" },
    });

    if (!landlordRole) {
      throw new Error("Role 'Landlord' not found in the database.");
    }
    //Create LandLord
    await prisma.landlord.create({
      data: { authenticatedUserId: authenticatedUserId },
    });
    //Assign User-Role Landlord
    await prisma.userRole.create({
      data: {
        authenticatedUserId: authenticatedUserId,
        role: { connect: { id: landlordRole.id } },
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};

export async function GET(request: NextRequest) {
  const authenticatedUserId = request.nextUrl.searchParams.get("aId");
  if (!authenticatedUserId) return NextResponse.json({ error: "authenticatedUserId not there!" });
  const landlord = await getLandlord(authenticatedUserId);
  if (landlord) {
    return NextResponse.json(landlord);
  }
  return NextResponse.json({ error: "landlord not found!" });
}

const getLandlord = async (authenticatedUserId: string) => {
  try {
    return await prisma.landlord.findFirst({
      where: { authenticatedUserId: authenticatedUserId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect;
  }
};
