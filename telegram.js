import axios from "axios";

const BOT_TOKEN = "8925336900:AAHcI3ustXOZNqbPhNIiSrYV-WlCjvOAHzo";
const CHAT_ID = "608353314";

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


/* async function getUpdates() {
    const res = await axios.get(
        `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
    );
    console.log(JSON.stringify(res.data, null, 2));
}

getUpdates(); */