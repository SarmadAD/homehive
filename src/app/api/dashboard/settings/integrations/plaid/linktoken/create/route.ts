import { NextRequest, NextResponse } from "next/server";
import { CountryCode, LinkTokenCreateRequest, Products } from "plaid";
import { plaidClient } from "src/app/api/utils/config";
// import { prisma } from "src/app/db/db"; // falls du User aus der DB holen willst

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");

    if (!landlordId) {
      return NextResponse.json({ error: "Missing landlordId" }, { status: 400 });
    }

    const plaidRequest: LinkTokenCreateRequest = {
      user: {
        client_user_id: landlordId,
      },
      client_name: "HomeHive",
      products: [Products.Transactions],
      language: "de",
      //   webhook: "https://webhook.example.com",
      redirect_uri: "http://localhost:3000/landlordportal/dashboard/settings/integrations",
      country_codes: [CountryCode.De],
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    return NextResponse.json(createTokenResponse.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
