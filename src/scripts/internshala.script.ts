import { PrismaClient } from "../generated/prisma";
import { chromium } from "playwright";


const prisma = new PrismaClient();

const internshalaScrapper = async ()=> {
    try {
        const browser = await chromium.launch({
            headless: true
        })  //  without GUI
        const page = await browser.newPage();
    
        await page.goto(`https://internshala.com/jobs`)      // jobType format -> Ex. "full-stack-development"
    
        const job = await page.$$eval('', (cards)=> {
            console.log("cards of internshala: ", cards);
        })
    
        await browser.close();
        console.log("✅ Scraping completed for Internshala");
    } catch(err){
        console.log("Error in the internshala scrapper");
    }
}

export default internshalaScrapper;



