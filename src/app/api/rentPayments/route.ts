import { RentPaymentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "src/app/db/db";
import getNextDueDateFromState from "src/utils/get-next-due-date";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");
    if (!landlordId) {
      return NextResponse.json({ error: "Missing required parameter: landlordId" }, { status: 400 });
    }

    const existingPayments = await prisma.rentPayment.findMany({
      where: { landlordId },
      select: {
        id: true,
        renterId: true,
        rentalObjectId: true,
      },
    });

    const rentalAgreements = await prisma.rentalAgreement.findMany({
      where: { landlordId },
      select: {
        id: true,
        rentalObjectId: true,
        baseRent: true,
        serviceCharges: true,
        dueDateState: true,
        renter: { select: { id: true } },
      },
    });

    const existingKey = new Set(existingPayments.map((p) => `${p.renterId}:${p.rentalObjectId}`));

    const toCreate = rentalAgreements
      .filter((a) => a.renter?.id && a.rentalObjectId)
      .filter((a) => !existingKey.has(`${a?.renter?.id}:${a.rentalObjectId}`))
      .map((a) => {
        const totalRent = (a.baseRent ?? 0) + (a.serviceCharges ?? 0);
        const nextDueDate = getNextDueDateFromState(a.dueDateState, new Date());

        return {
          rentalObjectId: a.rentalObjectId!,
          renterId: a.renter?.id ?? "",
          landlordId,
          paymentAmount: totalRent,
          dueDate: nextDueDate,
          paymentDate: nextDueDate,
          status: RentPaymentStatus.NOTPAID,
        };
      });

    if (toCreate.length > 0) {
      await prisma.rentPayment.createMany({
        data: toCreate,
        skipDuplicates: true,
      });
    }

    const payments = await prisma.rentPayment.findMany({
      where: { landlordId },
      include: { renter: { include: { rentalAgreement: true } } },
    });
    return NextResponse.json(payments, { status: 200 });
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
    // const transactions = [
    //   {
    //     id: "b83273b1b0924fc78d62da2157c89802",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-05-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1007",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "4e07786b1b824c47a7b308bd397eb129",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-04-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1051",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a73f8e7d45d9be7a22dc95715894",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-03-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1097",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a73f8e7d45d9be7a22dc95715895",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-02-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1666",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a73f8e7d45d9be7a22dc95715877",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-5500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-05-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1555",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a73f8e7d45d9be7a22dc95715077",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-4500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-01-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1885",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a13f8e7d45d9be7a22dc95715894",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-06-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1111",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a83f8e7d45d9be7a22dc95715894",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-07-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1112",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    //   {
    //     id: "0590a73f8e7d25d9be7a22dc95715894",
    //     accountId: "c683b4b42b214e468e38d76012221e0d",
    //     amount: {
    //       value: {
    //         unscaledValue: "-6500",
    //         scale: "1",
    //       },
    //       currencyCode: "EUR",
    //     },
    //     descriptions: {
    //       original: "Miete",
    //       display: "Miete",
    //     },
    //     dates: {
    //       booked: "2025-08-03",
    //     },
    //     identifiers: {
    //       providerTransactionId: "1113",
    //     },
    //     types: {
    //       type: "DEFAULT",
    //     },
    //     status: "BOOKED",
    //     providerMutability: "MUTABILITY_UNDEFINED",
    //   },
    // ];

    // const landlord = await prisma.landlord.findUnique({
    //   where: { id: landlordId },
    //   include: { rentalObjects: { include: { rentalObjectInfo: true, renter: true } } },
    // });

    // if (landlord && landlord.rentalObjects.length > 0) {
    //   const filteredTransactions: any[] = [];

    //   // Iteriere über alle rentalObjects des landlords
    //   for (const rentalObject of landlord.rentalObjects) {
    //     const totalRent = (rentalObject.rentalObjectInfo.baseRent ?? 0) + (rentalObject.rentalObjectInfo.serviceCharges ?? 0);

    //     // Iteriere über alle renter des aktuellen rentalObject
    //     for (const renter of rentalObject.renter) {
    //       const renterId = renter.id;

    //       // Filtere die Transaktionen basierend auf der Miete des aktuellen rentalObject
    //       const transactionsForRentalObject = transactions.filter((transaction: any) => {
    //         const transactionAmount = parseInt(transaction?.amount?.value?.unscaledValue) / Math.pow(10, parseInt(transaction?.amount?.value?.scale));
    //         // const containsRentKeyword =
    //         //   transaction.descriptions?.original?.toLowerCase().includes("miete") ||
    //         //   transaction.descriptions?.display?.toLowerCase().includes("miete");

    //         return Math.abs(transactionAmount) === totalRent;
    //         // return Math.abs(transactionAmount) === totalRent && containsRentKeyword;
    //       });

    //       filteredTransactions.push(...transactionsForRentalObject);

    //       // Neue RentPayment-Einträge erstellen
    //       for (const transaction of transactionsForRentalObject) {
    //         const transactionId = transaction.identifiers?.providerTransactionId;

    //         // Überprüfen, ob die transactionId und renterId bereits in RentPayment existieren
    //         const existingPayment = await prisma.rentPayment.findUnique({
    //           where: { transactionId, renterId },
    //         });

    //         if (!existingPayment) {
    //           // RentPayment erstellen, wenn die transactionId und renterId nicht existieren
    //           const transactionAmount =
    //             parseInt(transaction?.amount?.value?.unscaledValue) / Math.pow(10, parseInt(transaction?.amount?.value?.scale));

    //           await prisma.rentPayment.create({
    //             data: {
    //               transactionId,
    //               landlordId,
    //               paymentAmount: Math.abs(transactionAmount),
    //               paymentDate: new Date(transaction.dates?.booked),
    //               dueDate: new Date(),
    //               status: transaction.status === "BOOKED" ? "PAID" : "NOTPAID",
    //               renterId: renterId,
    //               rentalObjectId: rentalObject.id,
    //             },
    //           });
    //         } else {
    //           console.log(`RentPayment mit transactionId ${transactionId} und renterId ${renterId} existiert bereits.`);
    //         }
    //       }
    //     }
    //   }
    //   return NextResponse.json(transactions);
    // } else {
    //   return NextResponse.json({ error: "Landlord not found or no rental Objects found for the current landlord" }, { status: 404 });
    // }
  } catch (error) {
    console.error("Fehler:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
