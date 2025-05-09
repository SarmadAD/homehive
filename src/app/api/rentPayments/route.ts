import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/app/db/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");
    if (!landlordId) {
      return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
    }
    const existingPayment = await prisma.rentPayment.findMany({
      where: { landlordId },
      include: { renter: true },
    });
    return NextResponse.json(existingPayment, { status: 200 });
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");

    if (!landlordId) {
      return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
    }
    const tokenResponse = await fetch(`${request.nextUrl.origin}/api/token?landlordId=${landlordId}`);
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch access token" });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: "Access token is empty or expired" });
    }

    const tinkResponse = await fetch("https://api.tink.com/data/v2/transactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!tinkResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: tinkResponse.status });
    }

    const transactionsResponse = await tinkResponse.json();
    const transactions = transactionsResponse.transactions;

    const rentPayments = await prisma.rentPayment.findMany({
      where: { landlordId },
    });

    if (rentalObjectInfo) {
      // Add here more criteria
      const searchCriteria = [
        // (transaction: any) => transaction.descriptions?.display?.toString() === "Miete",
        (transaction: any) => {
          const totalRent = (rentalObjectInfo.baseRent ?? 0) + (rentalObjectInfo.serviceCharges ?? 0);

          const transactionAmount =
            parseInt(transaction?.amount?.value?.unscaledValue) /
            Math.pow(10, parseInt(transaction?.amount?.value?.scale));

          return Math.abs(transactionAmount) === totalRent;
        },
      ];

      const filteredTransactions = transactions.filter((transaction: any) =>
        searchCriteria.some((criterion) => criterion(transaction))
      );

      // Neue RentPayment-Einträge erstellen
      for (const transaction of filteredTransactions) {
        const transactionId = transaction.id;

        // Überprüfen, ob die transactionId bereits in RentPayment existiert
        const existingPayment = await prisma.rentPayment.findFirst({
          where: { transactionId, renterId },
        });

        if (!existingPayment) {
          // RentPayment erstellen, wenn die transactionId nicht existiert

          const transactionAmount =
            parseInt(transaction?.amount?.value?.unscaledValue) /
            Math.pow(10, parseInt(transaction?.amount?.value?.scale));

          await prisma.rentPayment.create({
            data: {
              transactionId,
              landlordId,
              paymentAmount: Math.abs(transactionAmount),
              paymentDate: new Date(transaction.dates?.booked),
              dueDate: new Date(),
              status: transaction.status === "BOOKED" ? "PAID" : "NOTPAID",
              renterId: renterId!,
              rentalObjectId: renter?.rentalObject?.id!,
            },
          });
        } else {
          console.log(`RentPayment mit transactionId ${transactionId} existiert bereits.`);
        }
      }
      return NextResponse.json(filteredTransactions);
    } else {
      return NextResponse.json({ error: "Rental object info not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
