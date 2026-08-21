import { NextResponse } from "next/server";
import { getAdminClient } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const receiptNumber = String(body.receipt_number || "").trim();
    const total = Number(body.total_amount);
    if (!receiptNumber || !Number.isFinite(total) || total < 0) return NextResponse.json({ error: "Invalid receipt" }, { status: 400 });
    const { error } = await getAdminClient().from("sales_receipts").insert({
      receipt_number: receiptNumber, total_amount: total, payment_method: body.payment_method, notes: body.notes || null
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Receipt could not be saved" }, { status: 500 });
  }
}
