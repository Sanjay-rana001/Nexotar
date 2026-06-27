import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, websiteType, budget, message } = data;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials missing in environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration. Missing Telegram credentials." },
        { status: 500 }
      );
    }

    const text = `
🚀 *New Lead from Nexotar!*

👤 *Name:* ${name}
📧 *Email:* ${email}
🌐 *Website Type:* ${websiteType}
💰 *Budget:* ${budget}
📝 *Message:*
${message || "No additional message provided."}
    `;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to send message to Telegram." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Sent successfully!" });
  } catch (error) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
