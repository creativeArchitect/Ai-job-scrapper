import { chromium } from "playwright";
import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

const linkedinScrapper = async (jobType: string)=> {
    try{
        const browser = await chromium.launch({
            headless: true
        });
        const page = await browser.newPage();

        await page.goto(``);

        const job = await page.$$eval('', (cards)=> {
            cards.map((c)=> {
                title: c.querySelector('')?.innerText.trim(),
                companyName: c.querySelector('')?.innerText.trim(),
                location: c.querySelector('')?.innerText.trim(),
                jobUrl: c.querySelector('')?.innerText.trim(),
                source: c.querySelector('')?.innerText.trim(),
                description: c.querySelector('')?.innerText.trim()
            })
        })

    } catch(err){

    }
}

