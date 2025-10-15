import { PrismaClient } from "../generated/prisma";
import { chromium } from "playwright";


const prisma = new PrismaClient();

const internshalaScrapper = async (jobType: string)=> {
    const browser = await chromium.launch({
        headless: true
    })  //  without GUI
    const page = await browser.newPage();

    await page.goto(`https://internshala.com/jobs/${jobType}`)      // jobType format -> Ex. "full-stack-development"

    const job = await page.$$eval('', (cards)=> {
        console.log("cards of internshala: ", cards);
    })

}

export default internshalaScrapper;



