import axios from "axios";
import { sendTelegramMessage } from "./telegram.js";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

async function run() {
    const [gmpResponse, ipoResponse] = await Promise.all([
        axios.get("https://webnodejs.investorgain.com/cloud/v2/index/gmp-price-read"),
        axios.get("https://webnodejs.investorgain.com/cloud/v2/ipo/list-read")
    ]);

    const gmpList = gmpResponse.data.gmpList;
    const ipoList = ipoResponse.data.ipoList;

    const gmpMap = new Map(
        gmpList.map(item => [
            item.company_short_name.toLowerCase(),
            item
        ])
    );

    const result = ipoList
    .filter(ipo => {
        const gmp = gmpMap.get(ipo.company_short_name.toLowerCase());
        return gmp && Number(gmp.gmp_perc) > 15;
    })
    .map(ipo => {
        const gmp = gmpMap.get(ipo.company_short_name.toLowerCase());

        return {
            companyName: ipo.company_short_name,
            gmpPrice: gmp.gmp,
            gmpPercentage: gmp.gmp_perc,
            issueOpenDate: formatDate(ipo.issue_open_dt),
            issueEndDate: formatDate(ipo.issue_end_dt),
            ipoCategory: ipo.ipo_category,
            companySector: ipo.company_sector
        };
    });

    const message = result.map(item => {
    return [
        `📊 ${item.companyName}`,
        `📂 Category: ${item.ipoCategory}`,
        `💰 GMP: ${item.gmpPrice} (${item.gmpPercentage}%)`,
        `🟢 Open: ${item.issueOpenDate}`,
        `🔴 Close: ${item.issueEndDate}`,
        `🏭 Sector: ${item.companySector}`
        ].join("\n");
    }).join("\n\n──────────────\n\n");

    await sendTelegramMessage(message);
}

run().catch(console.error);