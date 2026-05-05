import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const payload = {
    company: formData.get("company"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    partNumber: formData.get("partNumber"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes")
  };

  return NextResponse.json(
    {
      message: "RFQ captured. Wire this route to CRM/email/quote orchestration in production.",
      payload
    },
    { status: 201 }
  );
}
