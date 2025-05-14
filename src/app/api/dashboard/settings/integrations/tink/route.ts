import { Token } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";
import { CreateUserToken, OneTimeAccessToken } from "src/types/token";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const tokenInfo: OneTimeAccessToken | CreateUserToken = await request.json();

  const clientId = process.env.NEXT_PUBLIC_TINK_CLIENT_ID;
  const clientSecret = process.env.TINK_CLIENT_SECRET;

  const landlordId = searchParams.get("landlordId");

  if (!tokenInfo || !clientId || !clientSecret || !landlordId) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }
  try {
    const response = await fetch("https://api.tink.com/api/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        ...tokenInfo,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to fetch token", details: errorData }, { status: response.status });
    }

    const data: Token = await response.json();

    if (data?.access_token) {
      const token = await prisma.token.create({
        data: {
          access_token: data.access_token,
          expires_in: data.expires_in,
          id_hint: data.id_hint,
          scope: data.scope,
          token_type: data.scope,
          landlord: {
            connect: { id: landlordId },
          },
        },
      });
      return NextResponse.json(token, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
