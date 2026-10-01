import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body Parser
app.use(express.json());

// Persistent Telegram Configuration Path
const TELEGRAM_CONFIG_PATH = path.resolve(__dirname, '.telegram-config.json');

interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
  notifyOnNewOrder: boolean;
  notifyOnDeposit: boolean;
}

// Default credentials provided by the user
const defaultTelegramConfig: TelegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '8192507842:AAGBawQqvEthsDcFmncon3Xr6rLHwb4s44I',
  chatId: process.env.TELEGRAM_CHAT_ID || '6607631932',
  enabled: true,
  notifyOnNewOrder: true,
  notifyOnDeposit: true,
};

// Helper: Load Telegram Configuration safely
function loadTelegramConfig(): TelegramConfig {
  try {
    if (fs.existsSync(TELEGRAM_CONFIG_PATH)) {
      const data = fs.readFileSync(TELEGRAM_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        botToken: parsed.botToken || defaultTelegramConfig.botToken,
        chatId: parsed.chatId || defaultTelegramConfig.chatId,
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : defaultTelegramConfig.enabled,
        notifyOnNewOrder: typeof parsed.notifyOnNewOrder === 'boolean' ? parsed.notifyOnNewOrder : defaultTelegramConfig.notifyOnNewOrder,
        notifyOnDeposit: typeof parsed.notifyOnDeposit === 'boolean' ? parsed.notifyOnDeposit : defaultTelegramConfig.notifyOnDeposit,
      };
    }
  } catch (err) {
    console.warn('Could not read .telegram-config.json, using defaults:', err);
  }
  return { ...defaultTelegramConfig };
}

// Helper: Save Telegram Configuration
function saveTelegramConfig(config: TelegramConfig): void {
  try {
    fs.writeFileSync(TELEGRAM_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write .telegram-config.json:', err);
  }
}

// Helper: Mask sensitive bot token for client
function maskToken(token: string): string {
  if (!token) return '';
  if (token.length <= 10) return '••••••••';
  const prefix = token.substring(0, 5);
  const suffix = token.substring(token.length - 4);
  return `${prefix}${'•'.repeat(token.length - 9)}${suffix}`;
}

// Helper: Send message to Telegram API
async function sendTelegramMessage(botToken: string, chatId: string, text: string): Promise<{ ok: boolean; description?: string; result?: any }> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const result = await response.json();
    return result as { ok: boolean; description?: string; result?: any };
  } catch (err: any) {
    return { ok: false, description: err?.message || 'Network error connecting to Telegram' };
  }
}

// ==========================================
// TELEGRAM API ENDPOINTS
// ==========================================

// 1. GET Current Telegram Configuration (Masked for Security)
app.get('/api/telegram/config', (req, res) => {
  const config = loadTelegramConfig();
  res.json({
    configured: Boolean(config.botToken && config.chatId),
    botTokenMasked: maskToken(config.botToken),
    chatId: config.chatId,
    enabled: config.enabled,
    notifyOnNewOrder: config.notifyOnNewOrder,
    notifyOnDeposit: config.notifyOnDeposit,
  });
});

// 2. POST Update Telegram Configuration
app.post('/api/telegram/config', (req, res) => {
  const current = loadTelegramConfig();
  const { botToken, chatId, enabled, notifyOnNewOrder, notifyOnDeposit } = req.body;

  let newBotToken = current.botToken;
  // Only update token if a new, unmasked token is provided
  if (botToken && typeof botToken === 'string' && botToken.trim() !== '' && !botToken.includes('•')) {
    newBotToken = botToken.trim();
  }

  const updated: TelegramConfig = {
    botToken: newBotToken,
    chatId: typeof chatId === 'string' && chatId.trim() !== '' ? chatId.trim() : current.chatId,
    enabled: typeof enabled === 'boolean' ? enabled : current.enabled,
    notifyOnNewOrder: typeof notifyOnNewOrder === 'boolean' ? notifyOnNewOrder : current.notifyOnNewOrder,
    notifyOnDeposit: typeof notifyOnDeposit === 'boolean' ? notifyOnDeposit : current.notifyOnDeposit,
  };

  saveTelegramConfig(updated);

  res.json({
    success: true,
    message: 'টেলিগ্রাম সেটিংস সফলভাবে সংরক্ষিত ও আপডেট হয়েছে!',
    config: {
      configured: Boolean(updated.botToken && updated.chatId),
      botTokenMasked: maskToken(updated.botToken),
      chatId: updated.chatId,
      enabled: updated.enabled,
      notifyOnNewOrder: updated.notifyOnNewOrder,
      notifyOnDeposit: updated.notifyOnDeposit,
    },
  });
});

// 3. POST Send Test Telegram Message
app.post('/api/telegram/test', async (req, res) => {
  const config = loadTelegramConfig();

  // Allow testing with custom token/chatId if provided in body
  const tokenToUse = (req.body?.botToken && !req.body.botToken.includes('•'))
    ? req.body.botToken.trim()
    : config.botToken;
  const chatIdToUse = req.body?.chatId ? req.body.chatId.trim() : config.chatId;

  if (!tokenToUse || !chatIdToUse) {
    return res.status(400).json({
      success: false,
      message: 'টেলিগ্রাম বট টোকেন বা চ্যাট আইডি কনফিগার করা হয়নি।',
    });
  }

  const now = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const message = [
    `🔔 <b>Jihan Store (জিহান স্টোর) - টেলিগ্রাম টেস্ট নোটিফিকেশন</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `✅ <b>কানেকশন স্ট্যাটাস:</b> সক্রিয় (Connected)`,
    `🤖 <b>বট:</b> Jihan Store Bot (@jihanstoreofficial009bot)`,
    `👤 <b>চ্যাট আইডি / ইউজার আইডি:</b> <code>${chatIdToUse}</code>`,
    `⏰ <b>বাংলাদেশ সময়:</b> ${now}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🎉 <i>অভিনন্দন! আপনার টেলিগ্রাম ইন্টিগ্রেশন সম্পূর্ণ প্রস্তুত। নতুন অর্ডার ও গুরুত্বপূর্ণ আপডেট এখন থেকে স্বয়ংক্রিয়ভাবে আপনার ফোনে আসবে।</i>`,
  ].join('\n');

  const tgRes = await sendTelegramMessage(tokenToUse, chatIdToUse, message);

  if (tgRes.ok) {
    return res.json({
      success: true,
      message: 'টেলিগ্রামে টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!',
      result: tgRes.result,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: `টেলিগ্রাম মেসেজ পাঠাতে ব্যর্থ: ${tgRes.description || 'Unknown Telegram Error'}`,
    });
  }
});

// 4. POST Send New Order Notification to Telegram
app.post('/api/telegram/notify-order', async (req, res) => {
  const config = loadTelegramConfig();

  if (!config.enabled || !config.notifyOnNewOrder || !config.botToken || !config.chatId) {
    return res.json({ success: false, message: 'টেলিগ্রাম নোটিফিকেশন নিষ্ক্রিয় বা কনফিগার করা নেই।' });
  }

  const order = req.body || {};
  const orderId = order.id || 'N/A';
  const customerName = order.customerName || 'সম্মানিত গ্রাহক';
  const customerPhone = order.customerPhone || 'N/A';
  const address = order.deliveryAddress || 'ঠিকানা দেওয়া হয়নি';
  const city = order.city || '';
  const grandTotal = typeof order.grandTotal === 'number' ? order.grandTotal : 0;
  const deliveryCharge = typeof order.deliveryCharge === 'number' ? order.deliveryCharge : 0;
  const paymentMethod = order.paymentMethod || 'Cash on Delivery';
  const paymentDetails = order.paymentDetails;
  const items = Array.isArray(order.items) ? order.items : [];

  const now = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const itemsList = items.map((it: any, idx: number) => {
    const pName = it.banglaName || it.productName || it.name || 'পণ্য';
    const variant = [it.color ? `রং: ${it.color}` : '', it.size ? `সাইজ: ${it.size}` : ''].filter(Boolean).join(', ');
    const variantText = variant ? ` (${variant})` : '';
    const qty = it.quantity || 1;
    const price = (it.price || 0) * qty;
    return `  ${idx + 1}. <b>${pName}</b>${variantText}\n      পরিমাণ: ${qty} টি | মূল্য: ৳${price.toLocaleString()}`;
  }).join('\n');

  let paymentInfo = `💳 <b>পেমেন্ট মাধ্যম:</b> ${paymentMethod}`;
  if (paymentDetails) {
    if (paymentDetails.trxId) {
      paymentInfo += `\n🏷️ <b>TrxID:</b> <code>${paymentDetails.trxId}</code>`;
    }
    if (paymentDetails.senderNumber) {
      paymentInfo += `\n📱 <b>প্রেরক নম্বর:</b> <code>${paymentDetails.senderNumber}</code>`;
    }
    if (paymentDetails.depositSlipInfo) {
      paymentInfo += `\n📄 <b>রেফারেন্স:</b> ${paymentDetails.depositSlipInfo}`;
    }
  }

  const message = [
    `🛍️ <b>নতুন অর্ডার গৃহীত হয়েছে! (New Order)</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📋 <b>অর্ডার আইডি:</b> #<code>${orderId}</code>`,
    `👤 <b>গ্রাহকের নাম:</b> ${customerName}`,
    `📞 <b>মোবাইল নম্বর:</b> <code>${customerPhone}</code>`,
    `📍 <b>ডেলিভারি এলাকা:</b> ${city || 'সাধারণ'}`,
    `🏠 <b>পূর্ণ ঠিকানা:</b> ${address}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 <b>অর্ডারকৃত পণ্যসমূহ:</b>`,
    itemsList || '  (কোনো পণ্য নেই)',
    `━━━━━━━━━━━━━━━━━━━━━━`,
    paymentInfo,
    `🚚 <b>ডেলিভারি চার্জ:</b> ${deliveryCharge === 0 ? 'FREE (৳০)' : `৳${deliveryCharge.toLocaleString()}`}`,
    `💰 <b>সর্বমোট প্রদেয় মূল্য:</b> <b>৳${grandTotal.toLocaleString()} BDT</b>`,
    `⏰ <b>অর্ডারের সময়:</b> ${now}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🚀 <i>Jihan Store – বিশ্বাসের সাথে অনলাইন শপিং</i>`,
  ].join('\n');

  const tgRes = await sendTelegramMessage(config.botToken, config.chatId, message);

  res.json({
    success: tgRes.ok,
    message: tgRes.ok ? 'টেলিগ্রাম নোটিফিকেশন পাঠানো হয়েছে' : tgRes.description,
  });
});

// 5. POST Send Alert Notification (e.g. Deposit Request / Withdrawal)
app.post('/api/telegram/notify-alert', async (req, res) => {
  const config = loadTelegramConfig();

  if (!config.enabled || !config.notifyOnDeposit || !config.botToken || !config.chatId) {
    return res.json({ success: false, message: 'টেলিগ্রাম নোটিফিকেশন বন্ধ রয়েছে।' });
  }

  const { title, message: alertMsg, customerName, amount, method, trxId } = req.body || {};

  const now = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const lines = [
    `⚠️ <b>${title || 'গুরুত্বপূর্ণ এডমিন এলার্ট'}</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
  ];

  if (customerName) lines.push(`👤 <b>গ্রাহক:</b> ${customerName}`);
  if (amount) lines.push(`💵 <b>পরিমাণ:</b> ৳${Number(amount).toLocaleString()} BDT`);
  if (method) lines.push(`🏦 <b>মাধ্যম:</b> ${method}`);
  if (trxId) lines.push(`🏷️ <b>TrxID / রেফারেন্স:</b> <code>${trxId}</code>`);
  if (alertMsg) lines.push(`📝 <b>বিবরণ:</b> ${alertMsg}`);

  lines.push(`⏰ <b>সময়:</b> ${now}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━`);

  const tgRes = await sendTelegramMessage(config.botToken, config.chatId, lines.join('\n'));

  res.json({
    success: tgRes.ok,
    message: tgRes.ok ? 'এলার্ট সফলভাবে পাঠানো হয়েছে' : tgRes.description,
  });
});

// ==========================================
// VITE SPA INTEGRATION & STATIC FILE SERVING
// ==========================================

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Jihan Store Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
