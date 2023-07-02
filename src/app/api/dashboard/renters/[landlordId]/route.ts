import { Prisma, Renter as ClientRenter } from "@prisma/client";
import { NextResponse } from "next/server";
import { Renter } from "prisma/types/renter";
import { prisma } from "src/app/db/db";
import { Client, SendEmailV3_1, LibraryResponse } from "node-mailjet";

export async function GET(request: Request, { params }: { params: { landlordId: string } }) {
  const { landlordId } = params;
  if (landlordId) {
    const landlords = await prisma.landlord.findUnique({
      where: { id: landlordId },
      include: { renters: true },
    });
    if (landlords && landlords.renters.length > 0) {
      return NextResponse.json(landlords.renters);
    }
    return NextResponse.json({ error: "error" });
  }
}

export async function POST(request: Request, { params }: { params: { landlordId: string } }) {
  try {
    const { landlordId } = params;
    const renter: Renter = await request.json();
    if (landlordId) {
      const createdRenter = await prisma.renter.create({
        data: {
          firstname: renter.firstname,
          surname: renter.surname,
          email: renter.email,
          image: "",
          status: renter.status,
          createdAt: renter.createdAt,
          landlords: { connect: [{ id: landlordId }] },
        },
      });
      if (createdRenter) {
        sendInvite(createdRenter)
          .then((status) => {
            console.log(status);
            return NextResponse.json(status);
          })
          .catch((error) => {
            console.log("Fehler beim Senden der Einladung:", error);
            return NextResponse.json("Fehler beim Senden der Einladung:", error);
          });
      }
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientRustPanicError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json({ error: e.message });
    } else if (e instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json({ error: e.message });
    }
  }
}

async function sendInvite(createdRenter: ClientRenter) {
  const mailjet = new Client({
    apiKey: process.env.NEXT_PUBLIC_API_PUBLIC_KEY,
    apiSecret: process.env.NEXT_PUBLIC_API_SECRET_KEY,
  });

  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: "sarmadthebest@gmail.com",
        },
        To: [
          {
            Email: createdRenter.email,
          },
        ],
        Subject: "Einladung zum Mieter-Portal!",
        HTMLPart:
          "<h3>Hallo! Sie wurden von Ihrem Vermieter in das Mieter Portal eingeladen!</h3><br />Klicken Sie auf diesen Link um sich zu registrieren",
        TextPart: "Hallo! Sie wurden von Ihrem Vermieter in das Mieter Portal eingeladen! Klicken Sie auf diesen Link um sich zu registrieren",
      },
    ],
  };

  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet.post("send", { version: "v3.1" }).request(data);
  const { Status } = result.body.Messages[0];
  return Status;
}
