// http://telegram.me/DataLeadBot
const DataLeadBot = require('node-telegram-bot-api');

const token = process.env.DATALEADBOT_TOKEN || '';
if (!token) {
  console.log('You didn\'t provide Telegram Bot Token! Exiting...');
  process.exit();
}
const options = {
  polling: true
};

const bot = new DataLeadBot(token, options);
const BotService = require('./telegram/bot.service.js');
// bot.setWebHook(url, 'public-crt-for-telegram.pem');

bot.getMe().then(me => {
    console.log(`Hello! My name is ${me.first_name}`);
    console.log(`My id is ${me.id}`);
    console.log(`And my username is @${me.username}`);
});

bot.on('text', function(msg) {
  const chatId  = msg.chat.id,
        msgText = msg.text,
        msgDate = msg.date,
        msgUser = msg.from.username;

  switch(msgText){
    case '/help':
      BotService.showHelp(chatId);
      break;
    case '/hello':
      BotService.sendMessageByBot(chatId, `Hello, ${msg.from.first_name}!`);
      break;
    case '/bash':
      BotService.getBashQuote(chatId);
      break;
    case '/cat':
      BotService.getCatImage(chatId);
      break;
    case '/selfie':
      BotService.getWebCamPicture(chatId);
      break;
    default:
          
  }

  console.log(msg);
});

// regexp are here
bot.onText(/\/echo (.+)/, (msg, match) => {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

//start group chat with bot
//https://telegram.me/DataLeadBot?startgroup=test
