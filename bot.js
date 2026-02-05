const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// Конфиг
const BOT_TOKEN = '8546972046:AAFMR0WqJ0x_xBtosVmieypofIjHcnMtySY';
const SUPABASE_URL = 'https://okfakvtsevlyvbbfzyla.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FY7dJEwFGZxImSE_Qyad9Q_M0zQGOY0';
const ADMIN_CHAT_ID = 8155919358; // твой ID

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🤖 Бот запущен!');

// Простая команда
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Админ-бот казино работает!');
});

// Проверка депозитов
bot.onText(/\/check/, async (msg) => {
    const { data } = await supabase
        .from('deposit_requests')
        .select('*')
        .eq('status', 'pending');
    
    bot.sendMessage(msg.chat.id, `Ожидает: ${data?.length || 0} заявок`);
});
