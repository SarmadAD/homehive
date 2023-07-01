import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { RepairRequest } from "prisma/types/repairRequest";
import { prisma } from "src/app/db/db";

export async function PUT(request: Request, { params }: { params: { repairRequestId: string } }) {
  try {
    const { repairRequestId } = params;
    const repairRequest: RepairRequest = await request.json();
    if (repairRequestId) {
      const updatedRepairRequest = await prisma.repairRequest.update({
        where: { id: repairRequestId },
        data: { status: repairRequest.status },
      });
      if (updatedRepairRequest) {
        return NextResponse.json(updatedRepairRequest);
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
