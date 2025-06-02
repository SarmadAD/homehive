import { NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);

  const landlordId = searchParams.get("landlordId");

  if (!landlordId) {
    return NextResponse.json({ error: "Missing required parameters landlordId" }, { status: 400 });
  }

  const clientAccessToken = await prisma.token.findFirst({
    where: { landlordId: landlordId, scope: "authorization:grant", state: 1 },
    orderBy: { createdAt: "desc" },
  });

  if (!clientAccessToken) {
    return NextResponse.json({ error: "Missing required clientAccessToken" }, { status: 400 });
  }
  try {
    const response = await fetch("https://api.tink.com/api/v1/oauth/authorization-grant/delegate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clientAccessToken.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        actor_client_id: "df05e4b379934cd09963197cc855bfe9",
        external_user_id: landlordId,
        id_hint: "End user name/username", // Optional: Benutzername oder Name des Endbenutzers
        scope: "authorization:read,authorization:grant,credentials:refresh,credentials:read,credentials:write,providers:read,user:read",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to create delegated authorization grant", details: errorData }, { status: response.status });
    }

    const code = await response.json();

    return NextResponse.json(code.code, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 });
  }
}
