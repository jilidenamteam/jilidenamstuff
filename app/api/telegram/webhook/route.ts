import { NextResponse } from "next/server";
import { getAdminClient } from "../../../../lib/supabase";

type TelegramUpdate = { message?: { chat: { id: number }; from?: { id: number; first_name?: string }; text?: string; location?: { latitude: number; longitude: number } } };

async function sendMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text }) });
}

export async function POST(request: Request) {
  if (request.headers.get("x-telegram-bot-api-secret-token") !== process.env.TELEGRAM_WEBHOOK_SECRET) return new NextResponse("Unauthorized", { status: 401 });
  const update = await request.json() as TelegramUpdate;
  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });
  const command = message.text?.trim().split(/\s+/)[0].toLowerCase();
  const chatId = message.chat.id;
  if (command === "/start" || command === "/help") await sendMessage(chatId, "Welcome to Jilid Enam Operations.\n\nInventory: /stockcount, /purchase, /wastage\nHR: /in, /out, /leave, /claim\n\nUse /in or /out then share your location.");
  else if (command === "/in" || command === "/out") await sendMessage(chatId, "Please send your current Telegram location now. Your attendance will be logged for manager review.");
  else if (message.location) {
    const { error } = await getAdminClient().from("attendance_events").insert({ telegram_chat_id: chatId, event_type: "location_submission", latitude: message.location.latitude, longitude: message.location.longitude, occurred_at: new Date().toISOString() });
    await sendMessage(chatId, error ? "Your location could not be saved. Please notify your manager." : "Location received. Your attendance has been submitted.");
  } else await sendMessage(chatId, "I do not recognise that command. Send /help to see available actions.");
  return NextResponse.json({ ok: true });
}
