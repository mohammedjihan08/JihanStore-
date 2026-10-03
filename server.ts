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

// Body Parser with 50mb limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure public/uploads/logo directory exists
const UPLOADS_DIR = path.resolve(__dirname, 'public/uploads/logo');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
// Serve static uploads BEFORE Vite middlewares
app.use('/uploads', express.static(path.resolve(__dirname, 'public/uploads')));

// Persistent Logo Configuration Path
const LOGO_CONFIG_PATH = path.resolve(__dirname, '.logo-config.json');

function loadLogoConfig(): { logoUrl: string; updatedAt: string } {
  try {
    if (fs.existsSync(LOGO_CONFIG_PATH)) {
      const data = fs.readFileSync(LOGO_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not read .logo-config.json:', err);
  }
  return { logoUrl: '', updatedAt: '' };
}

function saveLogoConfig(config: { logoUrl: string; updatedAt: string }): void {
  try {
    fs.writeFileSync(LOGO_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write .logo-config.json:', err);
  }
}

// Persistent Telegram Configuration Path
const TELEGRAM_CONFIG_PATH = path.resolve(__dirname, '.telegram-config.json');

export interface SingleBotConfig {
  id: 'bot1' | 'bot2';
  name: string;
  botToken: string;
  chatId: string;
  isActive: boolean;
  username?: string;
}

export interface DualTelegramConfig {
  enabled: boolean;
  notifyOnNewOrder: boolean;
  notifyOnDeposit: boolean;
  lastUsedBot: 'bot1' | 'bot2';
  totalOrdersRotated: number;
  bot1: SingleBotConfig;
  bot2: SingleBotConfig;
}

// User-provided credentials
const defaultDualTelegramConfig: DualTelegramConfig = {
  enabled: true,
  notifyOnNewOrder: true,
  notifyOnDeposit: true,
  lastUsedBot: 'bot2', // Initialized so 1st order goes to Bot 1
  totalOrdersRotated: 0,
  bot1: {
    id: 'bot1',
    name: 'Bot 1 (Primary)',
    botToken: process.env.TELEGRAM_BOT_TOKEN || '8192507842:AAGBawQqvEthsDcFmncon3Xr6rLHwb4s44I',
    chatId: process.env.TELEGRAM_CHAT_ID || '6607631932',
    isActive: true,
    username: 'jihanstoreofficial009bot',
  },
  bot2: {
    id: 'bot2',
    name: 'Bot 2 (Rotation)',
    botToken: process.env.TELEGRAM_BOT2_TOKEN || '8627436875:AAGxH3Q4LQFkG1WrSTOKiF3Z9zyP4Fkd60k',
    chatId: process.env.TELEGRAM_CHAT_ID || '6607631932',
    isActive: true,
    username: 'jihanstore009bot',
  },
};

// Helper: Load Telegram Configuration safely
function loadDualTelegramConfig(): DualTelegramConfig {
  try {
    if (fs.existsSync(TELEGRAM_CONFIG_PATH)) {
      const data = fs.readFileSync(TELEGRAM_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);

      // Handle legacy single-bot structure migration if needed
      if (parsed.botToken && !parsed.bot1) {
        return {
          ...defaultDualTelegramConfig,
          bot1: {
            ...defaultDualTelegramConfig.bot1,
            botToken: parsed.botToken,
            chatId: parsed.chatId || defaultDualTelegramConfig.bot1.chatId,
          },
        };
      }

      return {
        enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : defaultDualTelegramConfig.enabled,
        notifyOnNewOrder: typeof parsed.notifyOnNewOrder === 'boolean' ? parsed.notifyOnNewOrder : defaultDualTelegramConfig.notifyOnNewOrder,
        notifyOnDeposit: typeof parsed.notifyOnDeposit === 'boolean' ? parsed.notifyOnDeposit : defaultDualTelegramConfig.notifyOnDeposit,
        lastUsedBot: parsed.lastUsedBot === 'bot1' ? 'bot1' : 'bot2',
        totalOrdersRotated: typeof parsed.totalOrdersRotated === 'number' ? parsed.totalOrdersRotated : 0,
        bot1: {
          id: 'bot1',
          name: parsed.bot1?.name || defaultDualTelegramConfig.bot1.name,
          botToken: parsed.bot1?.botToken || defaultDualTelegramConfig.bot1.botToken,
          chatId: parsed.bot1?.chatId || defaultDualTelegramConfig.bot1.chatId,
          isActive: typeof parsed.bot1?.isActive === 'boolean' ? parsed.bot1.isActive : defaultDualTelegramConfig.bot1.isActive,
          username: parsed.bot1?.username || defaultDualTelegramConfig.bot1.username,
        },
        bot2: {
          id: 'bot2',
          name: parsed.bot2?.name || defaultDualTelegramConfig.bot2.name,
          botToken: parsed.bot2?.botToken || defaultDualTelegramConfig.bot2.botToken,
          chatId: parsed.bot2?.chatId || defaultDualTelegramConfig.bot2.chatId,
          isActive: typeof parsed.bot2?.isActive === 'boolean' ? parsed.bot2.isActive : defaultDualTelegramConfig.bot2.isActive,
          username: parsed.bot2?.username || defaultDualTelegramConfig.bot2.username,
        },
      };
    }
  } catch (err) {
    console.warn('Could not read .telegram-config.json, using defaults:', err);
  }
  return { ...defaultDualTelegramConfig };
}

// Helper: Save Telegram Configuration
function saveDualTelegramConfig(config: DualTelegramConfig): void {
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
  return `${prefix}${'•'.repeat(Math.max(4, token.length - 9))}${suffix}`;
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
// TELEGRAM API ENDPOINTS (DUAL-BOT ROTATION)
// ==========================================

// 1. GET Current Dual-Bot Configuration (Masked)
app.get('/api/telegram/config', (req, res) => {
  const config = loadDualTelegramConfig();

  // Next bot calculation for UI preview
  let nextBot: 'bot1' | 'bot2' = 'bot1';
  if (config.bot1.isActive && config.bot2.isActive) {
    nextBot = config.lastUsedBot === 'bot1' ? 'bot2' : 'bot1';
  } else if (config.bot2.isActive) {
    nextBot = 'bot2';
  } else {
    nextBot = 'bot1';
  }

  res.json({
    enabled: config.enabled,
    notifyOnNewOrder: config.notifyOnNewOrder,
    notifyOnDeposit: config.notifyOnDeposit,
    lastUsedBot: config.lastUsedBot,
    nextBot,
    totalOrdersRotated: config.totalOrdersRotated,
    bot1: {
      id: 'bot1',
      name: config.bot1.name,
      botTokenMasked: maskToken(config.bot1.botToken),
      chatId: config.bot1.chatId,
      isActive: config.bot1.isActive,
      username: config.bot1.username || 'jihanstoreofficial009bot',
      configured: Boolean(config.bot1.botToken && config.bot1.chatId),
    },
    bot2: {
      id: 'bot2',
      name: config.bot2.name,
      botTokenMasked: maskToken(config.bot2.botToken),
      chatId: config.bot2.chatId,
      isActive: config.bot2.isActive,
      username: config.bot2.username || 'jihanstore009bot',
      configured: Boolean(config.bot2.botToken && config.bot2.chatId),
    },
  });
});

// 2. POST Update Telegram Dual-Bot Configuration
app.post('/api/telegram/config', (req, res) => {
  const current = loadDualTelegramConfig();
  const { enabled, notifyOnNewOrder, notifyOnDeposit, bot1, bot2 } = req.body;

  let newBot1Token = current.bot1.botToken;
  if (bot1?.botToken && typeof bot1.botToken === 'string' && bot1.botToken.trim() !== '' && !bot1.botToken.includes('•')) {
    newBot1Token = bot1.botToken.trim();
  }

  let newBot2Token = current.bot2.botToken;
  if (bot2?.botToken && typeof bot2.botToken === 'string' && bot2.botToken.trim() !== '' && !bot2.botToken.includes('•')) {
    newBot2Token = bot2.botToken.trim();
  }

  const updated: DualTelegramConfig = {
    ...current,
    enabled: typeof enabled === 'boolean' ? enabled : current.enabled,
    notifyOnNewOrder: typeof notifyOnNewOrder === 'boolean' ? notifyOnNewOrder : current.notifyOnNewOrder,
    notifyOnDeposit: typeof notifyOnDeposit === 'boolean' ? notifyOnDeposit : current.notifyOnDeposit,
    bot1: {
      id: 'bot1',
      name: bot1?.name || current.bot1.name,
      botToken: newBot1Token,
      chatId: typeof bot1?.chatId === 'string' && bot1.chatId.trim() !== '' ? bot1.chatId.trim() : current.bot1.chatId,
      isActive: typeof bot1?.isActive === 'boolean' ? bot1.isActive : current.bot1.isActive,
      username: bot1?.username || current.bot1.username,
    },
    bot2: {
      id: 'bot2',
      name: bot2?.name || current.bot2.name,
      botToken: newBot2Token,
      chatId: typeof bot2?.chatId === 'string' && bot2.chatId.trim() !== '' ? bot2.chatId.trim() : current.bot2.chatId,
      isActive: typeof bot2?.isActive === 'boolean' ? bot2.isActive : current.bot2.isActive,
      username: bot2?.username || current.bot2.username,
    },
  };

  saveDualTelegramConfig(updated);

  res.json({
    success: true,
    message: '২টি টেলিগ্রাম বটের কনফিগারেশন সফলভাবে আপডেট হয়েছে!',
    config: updated,
  });
});

// 3. POST Send Test Telegram Message (Specific Bot or Both)
app.post('/api/telegram/test', async (req, res) => {
  const config = loadDualTelegramConfig();
  const targetBotId = req.body?.targetBot || 'bot1'; // 'bot1' or 'bot2'

  const target = targetBotId === 'bot2' ? config.bot2 : config.bot1;

  const tokenToUse = (req.body?.botToken && !req.body.botToken.includes('•'))
    ? req.body.botToken.trim()
    : target.botToken;
  const chatIdToUse = req.body?.chatId ? req.body.chatId.trim() : target.chatId;

  if (!tokenToUse || !chatIdToUse) {
    return res.status(400).json({
      success: false,
      message: `${target.name}-এর বট টোকেন বা চ্যাট আইডি কনফিগার করা নেই।`,
    });
  }

  const now = new Date().toLocaleString('bn-BD', {
    timeZone: 'Asia/Dhaka',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const message = [
    `🔔 <b>Jihan Store (জিহান স্টোর) - ${target.name} টেস্ট মেসেজ</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `✅ <b>কানেকশন স্ট্যাটাস:</b> সক্রিয় (Online)`,
    `🤖 <b>বট:</b> ${target.name} (@${target.username || 'bot'})`,
    `👤 <b>চ্যাট আইডি:</b> <code>${chatIdToUse}</code>`,
    `⏰ <b>বাংলাদেশ সময়:</b> ${now}`,
    `━━━━━━━━━━━━━━━━━━━━━━`,
    `🔄 <b>অর্ডার রোটেশন মোড:</b> ২-বট পালাক্রমে অর্ডার নোটিফিকেশন সিস্টেম কার্যকর রয়েছে।`,
  ].join('\n');

  const tgRes = await sendTelegramMessage(tokenToUse, chatIdToUse, message);

  if (tgRes.ok) {
    return res.json({
      success: true,
      bot: target.name,
      message: `${target.name}-এ টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে!`,
      result: tgRes.result,
    });
  } else {
    return res.status(500).json({
      success: false,
      bot: target.name,
      message: `${target.name}-এ মেসেজ পাঠাতে ব্যর্থ: ${tgRes.description || 'Unknown error'}`,
    });
  }
});

// 4. POST Send New Order Notification with STRICT 2-BOT ROTATION
// Order 1 -> Bot 1, Order 2 -> Bot 2, Order 3 -> Bot 1, etc.
// NEVER send duplicate to both bots simultaneously!
app.post('/api/telegram/notify-order', async (req, res) => {
  const config = loadDualTelegramConfig();

  if (!config.enabled || !config.notifyOnNewOrder) {
    return res.json({ success: false, message: 'টেলিগ্রাম অর্ডার নোটিফিকেশন বন্ধ রয়েছে।' });
  }

  // Determine active bots
  const bot1Active = config.bot1.isActive && Boolean(config.bot1.botToken && config.bot1.chatId);
  const bot2Active = config.bot2.isActive && Boolean(config.bot2.botToken && config.bot2.chatId);

  if (!bot1Active && !bot2Active) {
    return res.json({ success: false, message: 'উভয় টেলিগ্রাম বট নিষ্ক্রিয় রয়েছে।' });
  }

  // Select target bot sequentially
  let selectedBotId: 'bot1' | 'bot2';

  if (bot1Active && bot2Active) {
    // Both active: alternate!
    // If last was bot1 -> now bot2
    // If last was bot2 -> now bot1
    selectedBotId = config.lastUsedBot === 'bot1' ? 'bot2' : 'bot1';
  } else if (bot1Active) {
    // Only Bot 1 active
    selectedBotId = 'bot1';
  } else {
    // Only Bot 2 active
    selectedBotId = 'bot2';
  }

  const primaryBot = selectedBotId === 'bot1' ? config.bot1 : config.bot2;
  const fallbackBot = selectedBotId === 'bot1' ? config.bot2 : config.bot1;
  const canFallback = selectedBotId === 'bot1' ? bot2Active : bot1Active;

  // Prepare message payload
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
  }

  const orderNumberInRotation = config.totalOrdersRotated + 1;
  const botLabel = selectedBotId === 'bot1' ? 'Bot 1 (Primary)' : 'Bot 2 (Rotation)';

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
    `🔄 <b>পালাক্রম:</b> অর্ডার নং #${orderNumberInRotation} → <b>${botLabel}</b>`,
    `🚀 <i>Jihan Store – বিশ্বাসের সাথে অনলাইন শপিং</i>`,
  ].join('\n');

  // Attempt to send ONLY to the selected bot
  let tgRes = await sendTelegramMessage(primaryBot.botToken, primaryBot.chatId, message);
  let deliveredBy = selectedBotId;

  // Failover to secondary active bot if primary failed
  if (!tgRes.ok && canFallback) {
    console.warn(`Failed sending to ${primaryBot.name}, failing over to ${fallbackBot.name}...`);
    tgRes = await sendTelegramMessage(fallbackBot.botToken, fallbackBot.chatId, message);
    if (tgRes.ok) {
      deliveredBy = fallbackBot.id;
    }
  }

  if (tgRes.ok) {
    // Record rotation state
    config.lastUsedBot = deliveredBy;
    config.totalOrdersRotated = orderNumberInRotation;
    saveDualTelegramConfig(config);

    res.json({
      success: true,
      deliveredBy,
      botName: deliveredBy === 'bot1' ? config.bot1.name : config.bot2.name,
      orderNumber: orderNumberInRotation,
      message: `অর্ডার সফলভাবে ${deliveredBy === 'bot1' ? config.bot1.name : config.bot2.name}-এ পাঠানো হয়েছে।`,
    });
  } else {
    res.status(500).json({
      success: false,
      message: `টেলিগ্রাম নোটিফিকেশন পাঠাতে ব্যর্থ: ${tgRes.description || 'Unknown error'}`,
    });
  }
});

// 5. POST Send Alert Notification (Deposits / Withdrawals)
app.post('/api/telegram/notify-alert', async (req, res) => {
  const config = loadDualTelegramConfig();

  if (!config.enabled || !config.notifyOnDeposit) {
    return res.json({ success: false, message: 'টেলিগ্রাম নোটিফিকেশন বন্ধ রয়েছে।' });
  }

  // Active bot for alert (prefers Bot 1, falls back to Bot 2)
  const targetBot = (config.bot1.isActive && config.bot1.botToken) ? config.bot1 : config.bot2;

  if (!targetBot.botToken || !targetBot.chatId) {
    return res.json({ success: false, message: 'বট কনফিগার করা নেই।' });
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
  lines.push(`🤖 প্রেরক: ${targetBot.name}`);

  const tgRes = await sendTelegramMessage(targetBot.botToken, targetBot.chatId, lines.join('\n'));

  res.json({
    success: tgRes.ok,
    message: tgRes.ok ? 'এলার্ট সফলভাবে পাঠানো হয়েছে' : tgRes.description,
  });
});

// ==========================================
// LOGO MANAGEMENT ENDPOINTS
// ==========================================

// 1. GET Current Active Logo
app.get('/api/logo', (req, res) => {
  const config = loadLogoConfig();
  res.json({
    success: true,
    logoUrl: config.logoUrl || '',
    updatedAt: config.updatedAt || '',
  });
});

// 2. POST Upload / Replace Logo
app.post('/api/logo/upload', (req, res) => {
  try {
    const { dataUrl, fileName, onlineUrl } = req.body || {};

    // Option A: Direct online URL provided
    if (onlineUrl && typeof onlineUrl === 'string' && onlineUrl.trim() !== '') {
      const cleanUrl = onlineUrl.trim();
      saveLogoConfig({ logoUrl: cleanUrl, updatedAt: new Date().toISOString() });
      return res.json({
        success: true,
        logoUrl: cleanUrl,
        message: 'অনলাইন লোগো URL সফলভাবে সেভ করা হয়েছে!',
      });
    }

    // Option B: Base64 / DataURL Image Upload
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'কোনো ইমেজ ডাটা পাওয়া যায়নি।',
      });
    }

    // Detect format from data:image/...;base64,...
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({
        success: false,
        message: 'অকার্যকর ইমেজ ফরম্যাট। অনুগ্রহ করে PNG, SVG, JPG বা WebP ইমেজ দিন।',
      });
    }

    let ext = matches[1].toLowerCase();
    if (ext === 'svg+xml') ext = 'svg';
    if (ext === 'jpeg') ext = 'jpg';

    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Remove any previous custom logo files in the upload directory so replace is clean
    try {
      if (fs.existsSync(UPLOADS_DIR)) {
        const existingFiles = fs.readdirSync(UPLOADS_DIR);
        for (const file of existingFiles) {
          if (file.startsWith('store_logo_')) {
            try {
              fs.unlinkSync(path.join(UPLOADS_DIR, file));
            } catch {}
          }
        }
      }
    } catch (err) {
      console.warn('Error cleaning previous logo files:', err);
    }

    const timestamp = Date.now();
    const newFileName = `store_logo_${timestamp}.${ext}`;
    const targetFilePath = path.join(UPLOADS_DIR, newFileName);

    fs.writeFileSync(targetFilePath, buffer);

    // Add cache busting param to URL so browsers instantly reload the new image
    const publicUrl = `/uploads/logo/${newFileName}?v=${timestamp}`;

    saveLogoConfig({
      logoUrl: publicUrl,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      logoUrl: publicUrl,
      message: 'লোগো সফলভাবে আপলোড ও কার্যকর হয়েছে!',
    });
  } catch (err: any) {
    console.error('Logo upload error:', err);
    res.status(500).json({
      success: false,
      message: `লোগো আপলোড ব্যর্থ: ${err?.message || 'সার্ভার ত্রুটি'}`,
    });
  }
});

// 3. DELETE / Remove Logo
app.delete('/api/logo', (req, res) => {
  try {
    // Delete custom logo files from disk
    if (fs.existsSync(UPLOADS_DIR)) {
      const existingFiles = fs.readdirSync(UPLOADS_DIR);
      for (const file of existingFiles) {
        if (file.startsWith('store_logo_')) {
          try {
            fs.unlinkSync(path.join(UPLOADS_DIR, file));
          } catch {}
        }
      }
    }

    saveLogoConfig({
      logoUrl: '',
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      logoUrl: '',
      message: 'লোগো সফলভাবে ডিলিট করা হয়েছে এবং ডিফল্ট লোগো সচল করা হয়েছে।',
    });
  } catch (err: any) {
    console.error('Logo delete error:', err);
    res.status(500).json({
      success: false,
      message: `লোগো ডিলিট ব্যর্থ: ${err?.message || 'সার্ভার ত্রুটি'}`,
    });
  }
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
