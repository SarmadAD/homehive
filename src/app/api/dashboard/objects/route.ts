import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request: Request) {
    const objects = prisma.rentalObject
  return NextResponse.json({});
}
