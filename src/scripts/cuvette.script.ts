import { chromium } from "playwright";
import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

const linkedinScrapper = async ()=> {
    try{
        const browser = await chromium.launch({
            headless: true
        });
        const page = await browser.newPage();

        await page.goto(``);

        let jobs: any = [];

        const job = await page.$$eval('.jobs-search__results-list li', (cards)=> {
            console.log("cards of linkedin: ", cards);

            jobs = [...cards];
        })

        console.log("job:", job);

        await browser.close();
        console.log("✅ Scraping completed for Linkedin");

        return jobs;
    } catch(err){
        console.log("Error in the linkedin scrapper");
    }
}

export default linkedinScrapper;

