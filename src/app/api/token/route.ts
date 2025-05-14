import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const landlordId = searchParams.get("landlordId");

  if (!landlordId) {
    return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
  }

  try {
    const token = await prisma.token.findFirst({
      where: { landlordId, state: 1 },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json({ access_token: "", expires_in: 0, id_hint: "", scope: "", token_type: "" }, { status: 200 });
    }
    if (token) {
      const tokenCreatedAt = new Date(token.createdAt).getTime();
      const tokenExpiresAt = tokenCreatedAt + token.expires_in * 1000;
      const now = Date.now();

      if (now >= tokenExpiresAt) {
        return NextResponse.json({ access_token: "", expires_in: 0, id_hint: "", scope: "", token_type: "" }, { status: 200 });
      }

      return NextResponse.json(token, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const landlordId = searchParams.get("landlordId");

  if (!landlordId) {
    return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
  }
  try {
    const updatedTokens = await prisma.token.updateMany({
      where: { landlordId: landlordId, state: 1 },
      data: {
        state: 0,
      },
    });
    return NextResponse.json(updatedTokens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
