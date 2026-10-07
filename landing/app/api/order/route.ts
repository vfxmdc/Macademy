import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productName,
      productPrice,
      quantity = 1,
      fullName,
      phone,
      wilaya,
      address,
      notes
    } = body;

    const rawToken = process.env.TELEGRAM_BOT_TOKEN;
    const rawChatId = process.env.TELEGRAM_CHAT_ID;

    if (!rawToken || !rawChatId) {
      console.error('Missing Telegram credentials in env.local');
      return NextResponse.json({ 
        error: 'بيانات البوت غير مكتملة في ملف .env.local (يرجى التأكد من TELEGRAM_BOT_TOKEN و TELEGRAM_CHAT_ID)' 
      }, { status: 500 });
    }

    const token = rawToken.trim().replace(/^['"]|['"]$/g, '');
    const chatId = rawChatId.trim().replace(/^['"]|['"]$/g, '').replace('$', '');

    const priceNum = typeof productPrice === 'number' ? productPrice : parseInt(String(productPrice).replace(/\D/g, '')) || 0;
    const totalAmount = priceNum * quantity;
    const fmtPrice = new Intl.NumberFormat('fr-DZ');

    // HTML formatted message
    const htmlMessage = `
🛍️ <b>طلب شراء جديد — M Décoration</b>

━━━━━━━━━━━━━━━━━━━━
📦 <b>المنتج:</b> ${productName || 'غير محدد'}
💰 <b>سعر القطعة:</b> ${fmtPrice.format(priceNum)} دج
🔢 <b>الكمية:</b> ${quantity}
💵 <b>المبلغ الإجمالي:</b> ${fmtPrice.format(totalAmount)} دج

━━━━━━━━━━━━━━━━━━━━
👤 <b>اسم الزبون:</b> ${fullName}
📞 <b>رقم الهاتف:</b> ${phone}
📍 <b>الولاية:</b> ${wilaya || 'غير محدد'}
🏠 <b>العنوان / البلدية:</b> ${address || 'غير محدد'}
📝 <b>ملاحظات:</b> ${notes || 'لا يوجد'}
━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    // First attempt: with HTML parse_mode
    let response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlMessage,
        parse_mode: 'HTML',
      }),
    });

    let resData = await response.json().catch(() => null);

    // Fallback: If HTML fails, try plain text
    if (!response.ok || !resData?.ok) {
      const plainMessage = `
🛍️ طلب شراء جديد — M Décoration

📦 المنتج: ${productName || 'غير محدد'}
💰 سعر القطعة: ${fmtPrice.format(priceNum)} دج
🔢 الكمية: ${quantity}
💵 المبلغ الإجمالي: ${fmtPrice.format(totalAmount)} دج

👤 اسم الزبون: ${fullName}
📞 رقم الهاتف: ${phone}
📍 الولاية: ${wilaya || 'غير محدد'}
🏠 العنوان: ${address || 'غير محدد'}
📝 ملاحظات: ${notes || 'لا يوجد'}
      `.trim();

      response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: plainMessage,
        }),
      });

      resData = await response.json().catch(() => null);
    }

    if (!response.ok || !resData?.ok) {
      const errorDesc = resData?.description || 'فشل الاتصال بـ Telegram API';
      console.error('Telegram API Failure:', resData);

      // Give clear actionable advice if chat not found
      if (errorDesc.includes('chat not found') || errorDesc.includes('Forbidden')) {
        return NextResponse.json({ 
          error: `تنبيه التلغرام: يرجى فتح البوت في تطبيق تلغرام والضغط على زر /start أولاً لتفعيل استقبال الرسائل على Chat ID الخاص بك (${chatId}).` 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        error: `خطأ التلغرام: ${errorDesc}` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Order Exception:', error);
    return NextResponse.json({ error: `خطأ في السيرفر: ${error?.message || error}` }, { status: 500 });
  }
}
