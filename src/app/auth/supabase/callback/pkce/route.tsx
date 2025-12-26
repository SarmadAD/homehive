import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthApiError, User } from "@supabase/supabase-js";
import { createClient } from "src/lib/supabase/server";
import { logger } from "src/lib/default-logger";
import { paths } from "src/paths";
import agent from "src/api/agent";
import { prisma } from "src/app/db/db";

export const dynamic = "force-dynamic";

// NOTE: If you have a proxy in front of this app
//  the request origin might be a local address.
//  Consider using `config.site.url` from `@/config` instead.

// NOTE: This is not a `Page` because we only redirect and it will never render React content.

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = req.nextUrl;

  if (searchParams.get("error")) {
    return NextResponse.json({ error: searchParams.get("error_description") || "Something went wrong" });
  }

  const code = searchParams.get("code");
  const renterId = searchParams.get("renterId");

  if (!code) {
    return NextResponse.json({ error: "Code is missing" });
  }

  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  const { error, data: user } = await supabaseClient.auth.exchangeCodeForSession(code);

  let next = searchParams.get("next") || paths.index;
  try {
    if (error) {
      return NextResponse.json({ error: error.message });
    }

    if (await checkIfUserIsLandlord(user.user)) {
      next = paths.landlordportal.dashboard.index;
    } else if (await checkIfUserIsRenter(user.user)) {
      next = paths.renterportal.dashboard.objects.index;
    } else if (renterId) {
      const renterExistsWithAuthenticatedUserId = await checkIfUserIsRenter(user.user);
      if (renterExistsWithAuthenticatedUserId) {
        next = paths.renterportal.dashboard.objects.index;
      } else if ((await checkIfRenterExists(renterId)) && !renterExistsWithAuthenticatedUserId) {
        await updateRenterAuthenticatedUserId(user.user, renterId);
        next = paths.renterportal.dashboard.objects.index;
      }
    } else {
      // If no renter nor a landlord exists, then the logical consecuence is to create a landlord, because renter can only be created by invting them in the landlord portal
      await callCreateLandlord(user.user);
      next = paths.landlordportal.dashboard.index;
    }
  } catch (err) {
    if (err instanceof AuthApiError && err.message.includes("code and code verifier should be non-empty")) {
      return NextResponse.json({ error: "Please open the link in the same browser" });
    }

    logger.error("Callback error", err);

    return NextResponse.json({ error: "Something went wrong" });
  }

  return NextResponse.redirect(new URL(next, origin));
}

async function checkIfRenterExists(renterId: string) {
  let result = false;
  try {
    const renter = await getRenter(renterId);
    if (renter && "error" in renter) {
      throw new Error(String(renter.error));
    } else {
      result = true;
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

async function checkIfUserIsLandlord(user: User) {
  let result = false;
  if (!user.id) return NextResponse.json({ error: "Authenticated User Id not there!" });
  const landlord = await getLandlord(user.id);
  if (landlord) {
    result = true;
  } else {
    result = false;
    // return NextResponse.json({ error: "landlord not found!" });
  }
  return result;
}

const getLandlord = async (authenticatedUserId: string) => {
  try {
    return await prisma.landlord.findFirst({
      where: { authenticatedUserId: authenticatedUserId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

async function checkIfUserIsRenter(user: User) {
  let result = false;
  if (!user.id) return NextResponse.json({ error: "Authenticated User ID not there!" });
  const renter = await getRenterWithAuthenticatedUserId(user.id);
  if (renter) {
    result = true;
  } else {
    result = false;
    // return NextResponse.json({ error: "renter not found!" });
  }
  return result;
}

const getRenterWithAuthenticatedUserId = async (authenticatedUserId: string) => {
  try {
    return await prisma.renter.findFirst({
      where: { authenticatedUserId: authenticatedUserId },
      include: { rentalObject: true },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

async function getRenter(renterId: string) {
  try {
    if (renterId) {
      const renter = await prisma.renter.findFirst({
        where: { id: renterId },
        include: { rentPayment: true },
      });
      return renter;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

async function updateRenterAuthenticatedUserId(user: User, renterId: string) {
  try {
    const authenticatedUserId = user.id;
    if (renterId && authenticatedUserId) {
      await updateAuthenticatedUserId(renterId, authenticatedUserId);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateAuthenticatedUserId(renterId: string, authenticatedUserId: string) {
  try {
    if (renterId) {
      const renter = await prisma.renter.update({
        where: { id: renterId },
        data: {
          authenticatedUserId: authenticatedUserId,
        },
      });
      await prisma.userRole.create({
        data: {
          authenticatedUserId: authenticatedUserId,
          role: { connect: { id: "20f9fbe2-0855-11ee-be56-0242ac120044" } },
        },
      });
      if (renter) {
        return renter;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function callCreateLandlord(user: User) {
  if (!user.id) return NextResponse.json({ error: "Authenticated User ID not there!" }, { status: 400 });
  await createLandlord(user.id);
  return NextResponse.json({ status: "Ok" }, { status: 200 });
}

const createLandlord = async (authenticatedUserId: string) => {
  try {
    // Get Landlord
    const landlordRole = await prisma.role.findUnique({
      where: { id: "20f9fbe2-0855-11ee-be56-0242ac120055" },
    });

    if (!landlordRole) {
      throw new Error("Role 'Landlord' not found in the database.");
    }
    //Create LandLord
    await prisma.landlord.create({
      data: { authenticatedUserId: authenticatedUserId },
    });
    //Assign User-Role Landlord
    await prisma.userRole.create({
      data: {
        authenticatedUserId: authenticatedUserId,
        role: { connect: { id: landlordRole.id } },
      },
    });
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};
