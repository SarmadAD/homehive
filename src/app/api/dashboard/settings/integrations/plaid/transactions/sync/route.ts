import { NextRequest, NextResponse } from "next/server";
import { Transaction } from "plaid";
import { plaidClient } from "src/app/api/utils/config";
import { prisma } from "src/app/db/db";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get("landlordId");

    if (!landlordId) {
      return NextResponse.json({ error: "landlordId not provided" }, { status: 400 });
    }

    const itemIds = await prisma.token.findMany({ where: { landlordId: landlordId, state: 1 }, select: { itemId: true } });

    const fullResult = await Promise.all(
      itemIds.map(async (item) => {
        return await syncTransactions(item.itemId ?? "", landlordId);
      })
    );

    return NextResponse.json(fullResult, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fetchNewSyncData(accessToken: string, initalCursor: string | null | undefined) {
  let keepGoing = false;
  const allData: any = { added: [], modified: [], removed: [], nextCursor: initalCursor };
  do {
    const result = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor: allData.nextCursor,
      options: { include_original_description: true },
    });
    const newData = result.data;
    allData.added = allData.added.concat(newData.added);
    allData.modified = allData.modified.concat(newData.modified);
    allData.removed = allData.removed.concat(newData.removed);
    allData.nextCursor = newData.next_cursor;
    keepGoing = newData.has_more;
  } while (keepGoing === true);
  return allData;
}

async function syncTransactions(itemId: string, landlordId: string) {
  const summary = { added: 0, removed: 0, modified: 0 };
  const token = await prisma.token.findFirst({ where: { itemId: itemId, state: 1 } });
  const accessToken = token?.access_token;
  const transactionCursor = token?.transactionCursor;
  if (accessToken) {
    const allData = await fetchNewSyncData(accessToken, transactionCursor);
    if (allData.added.length > 0) {
      const result = await createRentPayments(allData.added, landlordId);
      await saveCursorForItem(allData.nextCursor, itemId, landlordId);
      return result;
    }

    //Wenn sich ändert
    //wenn gelöscht wird
  }
}

async function saveCursorForItem(transactionCursor: string | null | undefined, itemId: string, landlordId: string) {
  try {
    await prisma.token.updateMany({ where: { landlordId: landlordId, itemId: itemId, state: 1 }, data: { transactionCursor } });
  } catch (error) {
    console.log(error);
  }
}

async function createRentPayments(transactions: Transaction[], landlordId: string) {
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

  const landlord = await prisma.landlord.findUnique({
    where: { id: landlordId },
    include: { rentalObjects: { include: { renter: true } }, rentalAgreements: { include: { renter: true } } },
  });

  if (landlord && landlord.rentalAgreements.length > 0) {
    const filteredTransactions: Transaction[] = [];

    // Iteriere über alle rentalObjects des landlords
    for (const rentalAgreement of landlord.rentalAgreements) {
      const totalRent = (rentalAgreement.baseRent ?? 0) + (rentalAgreement.serviceCharges ?? 0);

      // Iteriere über alle renter des aktuellen rentalObject
      const renterId = rentalAgreement.renter?.id;

      // Filtere die Transaktionen basierend auf der Miete des aktuellen rentalObject
      const transactionsForRentalObject = transactions.filter((transaction) => {
        // const containsRentKeyword =
        //   transaction.descriptions?.original?.toLowerCase().includes("miete") ||
        //   transaction.descriptions?.display?.toLowerCase().includes("miete");

        return transaction.amount === totalRent;
        // return Math.abs(transactionAmount) === totalRent && containsRentKeyword;
      });

      filteredTransactions.push(...transactionsForRentalObject);

      // Neue RentPayment-Einträge erstellen
      for (const transaction of transactionsForRentalObject) {
        const transactionId = transaction.transaction_id;

        // Überprüfen, ob die transactionId und renterId bereits in RentPayment existieren
        const existingPayment = await prisma.rentPayment.findFirst({
          where: { transactionId },
        });

        // Nur RentPayment erstellen, wenn renterId definiert ist
        if (!existingPayment && renterId) {
          // RentPayment erstellen, wenn die transactionId und renterId nicht existieren
          await prisma.rentPayment.create({
            data: {
              transactionId,
              landlordId,
              paymentAmount: transaction?.amount,
              paymentDate: new Date(transaction.authorized_date ?? transaction.date ?? new Date()),
              dueDate: new Date(), // ToDO: Entfernen, da in RentalAgreement schon vorhanden
              status: transaction.pending ? "NOTPAID" : "PAID",
              renterId: renterId,
              rentalObjectId: rentalAgreement.rentalObjectId,
            },
          });
        } else if (!renterId) {
          console.warn(`Kein renterId für rentalAgreement ${rentalAgreement.id}, RentPayment wird nicht erstellt.`);
        } else {
          console.log(`RentPayment mit transactionId ${transactionId} und renterId ${renterId} existiert bereits.`);
        }
      }
    }
    return filteredTransactions;
  }
  return [];
}
