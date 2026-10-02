export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const TELEGRAM_TOKEN =
        process.env.TELEGRAM_BOT_TOKEN;

    const WEBHOOK_URL =
        "https://beauty-studio-rho.vercel.app/api/telegram-webhook";

    try {

        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${encodeURIComponent(WEBHOOK_URL)}`
        );

        const result = await response.json();

        console.log("Telegram webhook:", result);

        return res.status(200).json(result);

    } catch (error) {

        console.error("Webhook error:", error);

        return res.status(500).json({
            error: "Failed to set webhook"
        });

    }

}