'use strict';

const TelegramBot = require('node-telegram-bot-api');
const http        = require('http');
const fs          = require('fs');
const iconv       = require('iconv-lite');
const fetch       = require('node-fetch');
const request     = require('request');

const token = process.env.DATALEADBOT_TOKEN || '';
if (!token) {
  console.log('You didn\'t provide Telegram Bot Token! Exiting...');
  process.exit();
}
const options = {
  polling: true
};
const bot = new TelegramBot(token, options);

const imagesnapjs = require('imagesnapjs');
const filename = '/tmp/webcam.jpg';

const commands = require('./commands.js');

module.exports = {
  showHelp: (chatId) => bot.sendMessage(chatId, commands),

  sendMessageByBot: (chatId, msg) => bot.sendMessage(chatId, msg, { caption: 'I\'m a cute bot!' }),

  getBashQuote: (chatId) => {
    const options = {
      host: 'bash.im',
      port: 80,
      path: '/forweb/'
    };

    http.get(options, function(res) {
      res.pipe(iconv.decodeStream('win1251').collect((err, decodedBody) => {
        let content = getQuoteFromContent(decodedBody);
        content = removeAllMarkUp(content[1]);
        bot.sendMessage(chatId, content, { caption: 'I\'m a cute bot!' })
      }));
    });

    function removeAllMarkUp(str) {
      let cleanQuote = replaceAll(str, "<' + 'br>", '\n');
      cleanQuote = replaceAll(cleanQuote, "<' + 'br />", '\n');
      cleanQuote = replaceAll(cleanQuote, "&quot;", '\"');
      cleanQuote = replaceAll(cleanQuote, "&lt;", '>');
      cleanQuote = replaceAll(cleanQuote, "&gt;", '<');
      return cleanQuote;
    }

    function replaceAll (str, separatorStr, replaceStr) {
      return str.split(separatorStr).join(replaceStr);
    }

    function getQuoteFromContent(str) {
      let quoteBlock = str.replace('<\' + \'div id="b_q_t" style="padding: 1em 0;">', '__the_separator__');
      quoteBlock = quoteBlock.replace('<\' + \'/div><\' + \'small>', '__the_separator__');
      return quoteBlock.split('__the_separator__');
    }
  },

  getCatImage: (chatId) => {
    let photoUrl, photo;
    request({ 
      method: 'GET',
      uri: "http://thecatapi.com/api/images/get?format=src&type=jpg,png",
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        photoUrl = response.request.uri.href;
        photo = request(photoUrl);
        bot.sendPhoto(chatId, photo, { caption: 'Pretty, cute cat is here! Enjoy' });
      }
    });
  },

  getWebCamPicture: (chatId) => {
    fs.exists(filename, exists => {
      if(exists) fs.unlinkSync(filename);
      
      imagesnapjs.capture(filename, { cliflags: '-w 2' }, e => {
        console.log(e ? e : 'Success!');
        bot.sendPhoto(chatId, filename, { caption: "It's your photo!" });
      });
    })
  }
    
};