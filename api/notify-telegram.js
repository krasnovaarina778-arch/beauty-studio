export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const {
        service,
        price,
        duration,
        date,
        time,
        name,
        phone,
        comment
    } = req.body;

    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const MASTER_CHAT_ID = "8851422456";

    const message = `
💅 Новая запись в Beauty Studio

Услуга: ${service}
Цена: ${price} ₽
Продолжительность: ${duration}

📅 Дата: ${date}
🕐 Время: ${time}

👩 Клиент: ${name}
📱 Телефон: ${phone}

💬 Комментарий:
${comment || "Не указан"}
`;

    try {

        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    chat_id: MASTER_CHAT_ID,
                    text: message
                })
            }
        );

        const result = await response.json();

        if (!result.ok) {
            console.error("Telegram error:", result);

            return res.status(500).json({
                error: "Telegram error"
            });
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {

        console.error("Server error:", error);

        return res.status(500).json({
            error: "Server error"
        });
    }
}