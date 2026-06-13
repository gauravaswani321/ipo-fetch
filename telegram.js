import axios from "axios";

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

export async function sendTelegramMessage(text) {
    return axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
            chat_id: CHAT_ID,
            text,
            parse_mode: "HTML",
            disable_web_page_preview: true
        }
    );
}