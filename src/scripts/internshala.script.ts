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

        let jobs: any = [];
    
        const job = await page.$$eval('internship_meta', (cards)=> {
            jobs = [...cards];
        });

        console.log("job:", job);
    
        await browser.close();
        console.log("✅ Scraping completed for Internshala");

        return jobs;
    } catch(err){
        console.log("Error in the internshala scrapper");
    }
}

export default internshalaScrapper;



