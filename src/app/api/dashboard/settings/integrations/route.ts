import { Prisma, Renter, Token } from "@prisma/client";
import { NextResponse } from "next/server";
import { RentalObject } from "prisma/types/objects";
import { prisma } from "src/app/db/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const clientId = searchParams.get("clientId");
  const clientSecret = searchParams.get("clientSecret");
  const landlordId = searchParams.get("landlordId");

  if (!code || !clientId || !clientSecret || !landlordId) {
    return NextResponse.json({ error: "Missing required query parameters" }, { status: 400 });
  }
  try {
    const response = await fetch("https://api.tink.com/api/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to fetch token", details: errorData }, { status: response.status });
    }

    const data: Token = await response.json();

    if (data?.access_token) {
      await prisma.token.create({
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
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
