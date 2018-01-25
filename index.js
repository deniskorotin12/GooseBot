const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '479215318:AAENNSIFasERmQy5i4rve48latNkAPejOwo';
const debug = require('./helpers.js');
const mongoose = require('mongoose');

mongoose.connect('mongodb://KorotinDenysBot:11223344q4@ds113738.mlab.com:13738/telegram_bot')
    .then(() => console.log('MongoDB has started'))
    .catch(e => console.log(e))


require('./person.model')
require('./date.model')
require('timers');





console.log('Bot has been started ...');

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
})


bot.on('message', msg => {
    msg.text != '/gusi' ? bot.sendMessage(msg.chat.id, 'Напишите /gusi  для начала.') : null;
});


bot.onText(/\/gusi/, msg => {

    const chatId = msg.chat.id;
    const inlineText = `Выберите кнопку, чтобы \n
    принять участика в определинии *Гуся*\n
    или зарегистрировать себя.
    `;

    bot.sendMessage(chatId, inlineText, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: 'Запомнить Пользователя',
                    callback_data: 'remember_me'
                }],
                [{
                    text: 'Определить Гуся дня',
                    callback_data: 'find_goose'
                }]
            ],

        },
        parse_mode: 'Markdown'
    })

});
bot.onText(/\/gusi2018/, msg => {

});

bot.onText(/\/gusihelp/, msg => {

});

bot.onText(/\/danate/, msg => {

});

bot.onText(/\/gusime/, msg => {

});

bot.onText(/\/gusistat/, msg => {

});


bot.on('callback_query', query => {
    // Человек

    const Person = mongoose.model('persons');
    const person = new Person({
        Name: query.from.first_name,
        Identificator: query.from.id
    });
    const wasCreated = `Сорри, братан, но я тебя уже запоминал`;
    const willBeCreate = `Я тебя запомнил, Гусяра - ${query.from.first_name}`;

    // Дата 
    const current_date = new Date();
    const modelDate = mongoose.model('get_date');
    const date = new modelDate({
        getDate: current_date.getDate()
    });
    if (query.data == 'remember_me') {

        const getPerson = Person
            .find({
                Identificator: {
                    '$in': [query.from.id]
                }
            })
            .then(persons => {

                if (query.from.id == persons[0].Identificator) {
                    bot.answerCallbackQuery(query.id, wasCreated)
                }
            })
            .catch(e => {
                person.save();
                bot.answerCallbackQuery(query.id, willBeCreate);
            })
    } else {

        const get_model_date = modelDate
            .find({
                getDate: {
                    '$in': [current_date.getDate()]
                }
            })
            .then(dates => {

                if (current_date.getDate() == dates[0].getDate) {
                    var curr_gus = '';
                    modelDate.find(function(err, goose) {
                        bot.answerCallbackQuery(query.id, `Сегодня уже определяли Гуся, это - ${goose[0].current_goose}`);
                    });
                }
            })
            .catch(e => {
                const person_array = [];
                Person.find(function(err, users) {
                    for (let i = 0; i < users.length; i++) {
                        person_array.push(users[i].Name);
                    }
                    const what_is_the_goose = Math.floor(Math.random() * person_array.length);
                    const current_goose = person_array[what_is_the_goose]
                    bot.answerCallbackQuery(query.id, `Итак, поздравьте нашего Гуся дня - ${current_goose}`);

                    const сurr_goose = new modelDate({
                        getDate: current_date.getDate(),
                        current_goose: current_goose
                    });

                    сurr_goose.save();
                })
            })

        // bot.answerCallbackQuery(query.id, date.getDate);
    }
});