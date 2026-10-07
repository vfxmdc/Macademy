import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      packageName,
      departureDate,
      returnDate,
      airline = "Flyadeal",
      roomType,
      room,
      roomPrice,
      mealOption,
      food,
      mealPrice,
      total,
      fullName,
      phone,
      hotel = "مكة المكرمة: فندق ريان الجوار | المدينة المنورة: فندق مركزي",
    } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID?.replace('$', '');

    if (!token || !chatId) {
      console.error('Missing Telegram credentials');
      return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
    }

    const finalRoom = roomType || room || 'غير محدد';
    const finalMeal = mealOption || food || 'بدون إعاشة';
    const fmtPrice = new Intl.NumberFormat('fr-DZ');

    const roomPriceText = roomPrice ? `${fmtPrice.format(roomPrice)} دج ` : '';
    const mealPriceText = mealPrice ? `${fmtPrice.format(mealPrice)} دج ` : '';

    const message = `
🕋 <b>طلب حجز عمرة جديد — MelGo Travel</b> 🕋

━━━━━━━━━━━━━━━━━━━━
📦 <b>الباقة:</b> ${packageName || 'عمرة مخصصة'}
🛫 <b>تاريخ الذهاب:</b> ${departureDate || 'غير محدد'}
🛬 <b>تاريخ العودة:</b> ${returnDate || 'غير محدد'}
✈️ <b>شركة الطيران:</b> ${airline}
🏨 <b>الفنادق:</b> ${hotel}
🛏 ${roomPriceText}<b>نوع الغرفة:</b> ${finalRoom}
🍽 ${mealPriceText}<b>الإعاشة:</b> ${finalMeal}

━━━━━━━━━━━━━━━━━━━━
💰 <b>السعر الإجمالي:</b> ${fmtPrice.format(total || 0)} دج

━━━━━━━━━━━━━━━━━━━━
👤 <b>الاسم الكامل:</b> ${fullName}
📞 <b>رقم الهاتف:</b> ${phone}
━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Telegram API Error:', err);
      return NextResponse.json({ error: 'Failed to send to Telegram' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
