import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const batchName = formData.get("batchName");
  const notes = formData.get("notes");

  return NextResponse.json(
    {
      message: "Import batch queued. Replace with CSV parsing, validation, and search reindex jobs.",
      batch: {
        batchName,
        notes,
        status: "Queued"
      }
    },
    { status: 202 }
  );
}
