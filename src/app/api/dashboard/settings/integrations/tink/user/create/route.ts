import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const landlordId = searchParams.get("landlordId");

  try {
    if (!landlordId) {
      return NextResponse.json({ error: "Missing required fields landlordId" }, { status: 400 });
    }
    const createUserToken = await prisma.token.findFirst({
      where: { landlordId: landlordId, token_type: "user:create", state: 1 },
      orderBy: { createdAt: "desc" },
    });

    if (!createUserToken) {
      return NextResponse.json({ error: "Missing required authorization token" }, { status: 400 });
    }
    const response = await fetch("https://api.tink.com/api/v1/user/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${createUserToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_user_id: landlordId,
        market: "DE",
        locale: "de_DE",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to create user", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
