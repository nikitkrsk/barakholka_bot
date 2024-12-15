import { Telegraf } from 'telegraf';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
let userSubscriptions = {};

const predefinedGroups = {
  дети: ['игрушки', 'малыш', 'детская', 'родител', 'школ'],
  автомобили: ['машина', 'авто', 'гоночный', 'SUV', 'седан', 'электрокар'],
  технологии: ['клавиатура', 'мышь', 'мышка', 'провод', 'гаджет', 'робот', 'софт'],
  часы: ['часы', 'наручные часы', 'хронометр', 'Rolex', 'G-Shock']
};


const loadSubscriptions = () => {
  try {
    if (fs.existsSync('subscriptions.json')) {
      const data = fs.readFileSync('subscriptions.json', 'utf8');
      userSubscriptions = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading subscriptions:', error);
    userSubscriptions = {};
  }
};

const saveSubscriptions = () => {
  try {
    fs.writeFileSync('subscriptions.json', JSON.stringify(userSubscriptions, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
};


bot.start((ctx) => {
  ctx.reply(
    'Добро пожаловать! Вы можете добавить ключевые слова для отслеживания сообщений из Акронис барахолки. Используйте /help, чтобы узнать больше о доступных командах.'
  );
});

bot.help((ctx) => {
  ctx.reply(
    `Список доступных команд:
    /add <ключевое слово> - добавить ключевое слово для отслеживания.
    /remove <ключевое слово> - удалить ключевое слово из вашего списка.
    /list - показать список ваших ключевых слов.
    /groups - показать доступные категории ключевых слов.
    /add_group <категория> - подписаться на категорию ключевых слов.
    /remove_group <категория> - отписаться от категории ключевых слов.
    /clear - удалить все ключевые слова.`
  );
});



bot.command('add', (ctx) => {
  const userId = ctx.from.id;
  const keyword = ctx.message?.text.split(' ').slice(1).join(' ').trim();

  if (!keyword) {
    return ctx.reply('Пожалуйста, укажите ключевое слово. Пример: /add машина');
  }

  if (!userSubscriptions[userId]) {
    userSubscriptions[userId] = [];
  }

  if (userSubscriptions[userId].includes(keyword)) {
    return ctx.reply('Это ключевое слово уже есть в вашем списке.');
  }

  userSubscriptions[userId].push(keyword);
  saveSubscriptions();
  ctx.reply(`Ключевое слово добавлено: "${keyword}"`);
});

bot.command('groups', (ctx) => {
  let message = 'Доступные категории:\n';
  Object.entries(predefinedGroups).forEach(([groupName, keywords]) => {
    message += `- ${groupName}: ${keywords.join(', ')}\n`;
  });
  ctx.reply(message);
});

bot.command('list', (ctx) => {
  const userId = ctx.from.id;
  const keywords = userSubscriptions[userId] || [];
  if (keywords.length === 0) {
    return ctx.reply('У вас нет ключевых слов.');
  }
  ctx.reply(`Ваши ключевые слова: ${keywords.join(', ')}`);
});

bot.command('add_group', (ctx) => {
  const userId = ctx.from.id;
  const groupName = ctx.message?.text.split(' ').slice(1).join(' ').trim().toLowerCase();

  if (!groupName || !predefinedGroups[groupName]) {
    return ctx.reply('Неверное название категории. Используйте /groups, чтобы увидеть доступные категории.');
  }

  if (!userSubscriptions[userId]) {
    userSubscriptions[userId] = [];
  }

  // Add group keywords to the user's subscription list
  const groupKeywords = predefinedGroups[groupName];
  groupKeywords.forEach((keyword) => {
    if (!userSubscriptions[userId].includes(keyword)) {
      userSubscriptions[userId].push(keyword);
    }
  });

  saveSubscriptions(); // Save changes to file
  ctx.reply(`Вы подписались на категорию "${groupName}". Добавлены ключевые слова: ${groupKeywords.join(', ')}`);
});

bot.command('remove_group', (ctx) => {
  const userId = ctx.from.id;
  const groupName = ctx.message?.text.split(' ').slice(1).join(' ').trim().toLowerCase();

  if (!groupName || !predefinedGroups[groupName]) {
    return ctx.reply('Неверное название категории. Используйте /groups, чтобы увидеть доступные категории.');
  }

  if (!userSubscriptions[userId] || userSubscriptions[userId].length === 0) {
    return ctx.reply('У вас нет ключевых слов для удаления.');
  }

  const groupKeywords = predefinedGroups[groupName];
  userSubscriptions[userId] = userSubscriptions[userId].filter(
    (keyword) => !groupKeywords.includes(keyword)
  );

  saveSubscriptions();
  ctx.reply(`Вы отписались от категории "${groupName}". Удалены ключевые слова: ${groupKeywords.join(', ')}`);
});

bot.command('remove', (ctx) => {
  const userId = ctx.from.id;
  const keyword = ctx.message?.text.split(' ').slice(1).join(' ').trim();

  if (!keyword) {
    return ctx.reply('Пожалуйста, укажите ключевое слово для удаления. Пример: /remove машина');
  }

  if (!userSubscriptions[userId] || userSubscriptions[userId].length === 0) {
    return ctx.reply('У вас нет ключевых слов для удаления.');
  }

  const index = userSubscriptions[userId].indexOf(keyword);

  if (index === -1) {
    return ctx.reply(`Ключевое слово "${keyword}" не найдено в вашем списке.`);
  }

  userSubscriptions[userId].splice(index, 1);
  saveSubscriptions();
  ctx.reply(`Ключевое слово удалено: "${keyword}"`);
});

bot.command('clear', (ctx) => {
  const userId = ctx.from.id;

  if (!userSubscriptions[userId] || userSubscriptions[userId].length === 0) {
    return ctx.reply('У вас нет ключевых слов для удаления.');
  }

  delete userSubscriptions[userId];
  saveSubscriptions();
  ctx.reply('Все ваши ключевые слова удалены.');
});

bot.on('message', (ctx) => {
  const chatId = ctx.chat.id;

  if (chatId > 0) return;

  if ('text' in ctx.message) {
    const messageText = ctx.message.text;

    Object.entries(userSubscriptions).forEach(([userId, keywords]: any) => {
      keywords.forEach((keyword) => {
        if (messageText.toLowerCase().includes(keyword.toLowerCase())) {
          bot.telegram.forwardMessage(userId, chatId, ctx.message.message_id)
            .catch((error) => console.error(`Failed to forward message to ${userId}:`, error));
        }
      });
    });
  } else if ('photo' in ctx.message && 'caption' in ctx.message) {
    const captionText = ctx.message.caption;

    Object.entries(userSubscriptions).forEach(([userId, keywords]: any) => {
      keywords.forEach((keyword) => {
        if (captionText.toLowerCase().includes(keyword.toLowerCase())) {
          bot.telegram.forwardMessage(userId, chatId, ctx.message.message_id)
            .catch((error) => console.error(`Failed to forward photo message to ${userId}:`, error));
        }
      });
    });
  } else {
    console.log('Unhandled message type or message without text:', ctx.message);
  }
});

loadSubscriptions();
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
