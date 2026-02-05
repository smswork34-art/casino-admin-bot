const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');

// Конфиг из переменных окружения
const BOT_TOKEN = process.env.BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// Проверка обязательных переменных
if (!BOT_TOKEN || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ ОШИБКА: Не заданы обязательные переменные окружения!');
  console.error('BOT_TOKEN:', !!BOT_TOKEN);
  console.error('SUPABASE_URL:', !!SUPABASE_URL);
  console.error('SUPABASE_KEY:', !!SUPABASE_KEY);
  process.exit(1);
}

console.log('✅ Переменные окружения загружены');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('🤖 Админ-бот казино запущен!');
console.log('👑 Админ ID:', ADMIN_CHAT_ID || 'не задан');

// Простая команда для проверки
bot.onText(/\/start/, (msg) => {
  console.log(`👤 Пользователь ${msg.from.id} запустил бота`);
  bot.sendMessage(msg.chat.id, '✅ Админ-бот казино работает! Используй /deposits');
});

// Проверка депозитов
bot.onText(/\/deposits/, async (msg) => {
  try {
    const { data, error } = await supabase
      .from('deposit_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Ошибка Supabase:', error);
      bot.sendMessage(msg.chat.id, '❌ Ошибка базы данных');
      return;
    }
    
    if (!data || data.length === 0) {
      bot.sendMessage(msg.chat.id, '📭 Нет ожидающих заявок');
      return;
    }
    
    bot.sendMessage(msg.chat.id, `💰 Ожидает: ${data.length} заявок\n\nИспользуй /deposits в мини-аппе`);
    
  } catch (error) {
    console.error('Ошибка:', error);
    bot.sendMessage(msg.chat.id, '❌ Произошла ошибка');
  }
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error.code, error.message);
});

console.log('🔄 Бот начал слушать сообщения...');
