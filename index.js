const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "479215318:AAENNSIFasERmQy5i4rve48latNkAPejOwo";
const debug = require("./helpers.js");
const mongoose = require("mongoose");

mongoose
    .connect(
        "mongodb://KorotinDenysBot:11223344q4@ds113738.mlab.com:13738/telegram_bot"
    )
    .then(() => console.log("MongoDB has started"))
    .catch(e => console.log(e));

require("./person.model");
require("./date.model");
require("timers");

console.log("Bot has been started ...");

const bot = new TelegramBot(TOKEN, {
    polling: {
        interval: 300,
        autoStart: true,
        params: {
            timeout: 10
        }
    }
});

bot.onText(/\/gusi/, query => {
    const Person = mongoose.model("persons");
    const person = new Person({
        Name: query.from.first_name,
        Identificator: query.from.id
    });

    const current_date = new Date();
    const modelDate = mongoose.model("get_date");
    const date = new modelDate({
        getDate: current_date.getDate()
    });

    const get_model_date = modelDate
        .find({
            getDate: {
                $in: [current_date.getDate()]
            }
        })
        .then(dates => {
            if (current_date.getDate() == dates[0].getDate) {
                var curr_gus = "";
                modelDate.find(function(err, goose) {
                    bot.sendMessage(
                        query.chat.id,
                        `Сегодня уже определяли Гуся, это - ${goose[0].current_goose}`
                    );
                });
            }
        })
        .catch(e => {
            const person_array = [];
            Person.find(function(err, users) {
                for (let i = 0; i < users.length; i++) {
                    person_array.push(users[i].Name);
                }
                const what_is_the_goose = Math.floor(
                    Math.random() * person_array.length
                );
                const current_goose = person_array[what_is_the_goose];
                bot.sendMessage(
                    query.chat.id,
                    `Итак, поздравьте нашего Гуся дня - ${current_goose}`
                );

                const сurr_goose = new modelDate({
                    getDate: current_date.getDate(),
                    current_goose: current_goose
                });
               
                сurr_goose.save();
            });
        });
});
bot.onText(/\/year/, msg => {});

bot.onText(/\/help/, msg => {
    // bot.sendMessage(msg.chat.id, msg.chat.id)
    console.log(msg)

});

bot.onText(/\/donate/, msg => {
    const chaId = msg.chat.id;
    bot.sendInvoice(
        chaId,
        "Telegram Donate",
        "Best bot ever",
        "payload",
        "372774012:LIVE:9b70fade245922b9c177a6bb0806c6ee",
        "SOME_KEY",
        "UAH", [{
            label: "telegram_feed",
            amount: 2000
        }], {
            photo_url: "http://ono.org.ua/wp-content/uploads/2011/02/money_payment.jpg",
            need_name: true,
            is_flexible: true
        }
    );
});

bot.onText(/\/me/, msg => {});

bot.onText(/\/reg/, query => {
    const wasCreated = `Сорри, братан, но я тебя уже запоминал`;
    const willBeCreate = `Я тебя запомнил, Гусяра - ${query.from.first_name}`;

    const Person = mongoose.model("persons");
    const person = new Person({
        Name: query.from.first_name,
        Identificator: query.from.id
    });

    const getPerson = Person.find({
            Identificator: {
                $in: [query.from.id]
            }
        })
        .then(persons => {
            console.log(query);
            if (query.from.id == persons[0].Identificator) {
                bot.sendMessage(query.chat.id, wasCreated);
            }
        })
        .catch(e => {
            person.save();
            bot.sendMessage(query.chat.id, willBeCreate);
        });
});

bot.onText(/\/stat/, msg => {});

bot.on('message', msg=>{
    bot.sendMessage(msg.chat.id, `
    Вы можете воспользоваться такими командами:\n
    /me - Ваша статистка\n
    /reg - Зарегистрироваться в игре\n
    /stat - Статистика по всем пользователям\n
    /donate - Пожертвования проекту\n
    /help - Помощь по командам\n
    /year - Статистика за год\n
    /gusi - Определить гуся

    `)
})