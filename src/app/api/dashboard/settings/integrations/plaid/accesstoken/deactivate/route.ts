import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "src/app/api/utils/config";
import { prisma } from "src/app/db/db";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");

    if (!landlordId) {
      return NextResponse.json({ isDeactivated: false, error: "landlordId not provided" }, { status: 200 });
    }

    const token = await prisma.token.findFirst({ where: { landlordId: landlordId, state: 1 } });
    if (token) {
      await plaidClient.itemRemove({
        access_token: token.access_token,
      });
      await prisma.token.updateMany({ where: { landlordId: landlordId, itemId: token.itemId }, data: { state: 0 } });
    }

    return NextResponse.json({ isDeactivated: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ isDeactivated: false, error: error.message }, { status: 200 });
  }
}
