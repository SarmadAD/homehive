import { Token } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";
import { TokenWithGrantTypeAndScope, OneTimeAccessToken, TokenWithScope } from "src/types/token";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const tokenInfo: OneTimeAccessToken | TokenWithGrantTypeAndScope | TokenWithScope = await request.json();

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

    const data = await response.json();

    if (data?.access_token) {
      const token = await prisma.token.create({
        data: {
          access_token: data.access_token,
          expires_in: data.expires_in,
          scope: data.scope,
          token_type: data.token_type,
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const landlordId = searchParams.get("landlordId");
  // const tokenInfo: TokenWithScope = await request.json();

  try {
    if (!landlordId) {
      return NextResponse.json({ error: "Missing required fields landlordId" }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_TINK_CLIENT_ID;
    const clientSecret = process.env.TINK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Missing Tink client credentials" }, { status: 500 });
    }

    const clientAccessToken = await prisma.token.findFirst({
      where: { landlordId: landlordId, scope: "authorization:grant", state: 1 },
      orderBy: { createdAt: "desc" },
    });
    const authorizationGrantResponse = await fetch("https://api.tink.com/api/v1/oauth/authorization-grant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clientAccessToken?.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        external_user_id: landlordId,
        scope: "user:delete,provider-consents:read,balances:read,accounts:read,transactions:read",
      }),
    });

    if (!authorizationGrantResponse.ok) {
      const errorData = await authorizationGrantResponse.json();
      return NextResponse.json({ error: "Failed to create authorization grant", details: errorData }, { status: authorizationGrantResponse.status });
    }

    const authorizationGrantData = await authorizationGrantResponse.json();

    const tokenResponse = await fetch("https://api.tink.com/api/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: authorizationGrantData.code,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return NextResponse.json({ error: "Failed to fetch user access token", details: errorData }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();

    await prisma.token.create({
      data: {
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in,
        scope: tokenData.scope,
        token_type: tokenData.token_type,
        landlord: {
          connect: { id: landlordId },
        },
      },
    });

    return NextResponse.json({ message: "User access token created successfully", token: tokenData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
