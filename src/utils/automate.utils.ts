import cron from "node-cron";
import linkedinScrapper from "@/scripts/linkedin.script";
import internshalaScrapper from "@/scripts/internshala.script";


cron.schedule("0 * * * *", () => {
    console.log("🕘 Running daily job scrape...");
    linkedinScrapper();
    internshalaScrapper();
  });



