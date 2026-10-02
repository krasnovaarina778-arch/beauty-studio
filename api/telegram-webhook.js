export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const TELEGRAM_TOKEN =
        process.env.TELEGRAM_BOT_TOKEN;

    const update = req.body;

    const message =
        update?.message;

    if (!message) {
        return res.status(200).json({
            ok: true
        });
    }

    const chatId =
        message.chat.id;

    const text =
        message.text || "";

    if (text === "/start") {

    const messageText = `
✨ BEAUTY STUDIO

Добро пожаловать в пространство красоты.

Маникюр · уход · индивидуальный дизайн

Выберите удобное время для записи —
всё можно оформить онлайн за несколько минут.

Будем рады видеть вас 🤍
`;

    await fetch(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                chat_id: chatId,

                photo:
                    "https://beauty-studio-rho.vercel.app/assets/master.webp",

                caption: messageText,

                reply_markup: {

                    inline_keyboard: [

                        [
                            {
                                text: "💅 Записаться онлайн",

                                web_app: {
                                    url:
                                        "https://beauty-studio-rho.vercel.app/"
                                }
                            }
                        ]

                    ]

                }

            })
        }
    );

}

    return res.status(200).json({
        ok: true
    });

}