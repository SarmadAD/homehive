import { NextRequest, NextResponse } from "next/server";
import { plaidClient } from "src/app/api/utils/config";
import { prisma } from "src/app/db/db";

export async function POST(request: NextRequest) {
  try {
    const { public_token, landlordId } = await request.json();

    if (!public_token || !landlordId) {
      return NextResponse.json({ error: "public token or landlordId not provided" }, { status: 400 });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Speichere accessToken und itemId in der Datenbank
    await prisma.token.create({
      data: {
        access_token: accessToken,
        itemId: itemId,
        landlord: { connect: { id: landlordId } },
      },
    });

    return NextResponse.json({ public_token_exchange: "complete" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
