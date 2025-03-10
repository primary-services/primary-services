import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import userAgent from "user-agents";

const getDynamicPageHtml = async (url) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent(userAgent.toString());

        await page.goto(url, { waitUntil: "networkidle0" });
        const html = await page.evaluate(
            () => document.querySelector("*").outerHTML,
        );

        await browser.close();
        return html;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const load = async (url) => {
    const html = await getDynamicPageHtml(url);
    return cheerio.load(html);
};
