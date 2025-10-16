import { JobData } from "@/types/job.types";
import { chromium } from "playwright";

const scrapeJobHTMLs = async (
  url: string,
  jobSelectorObj: any,
  maxJobs = 5,
  postPlatform: string
): Promise<JobData[]> => {

  if (!jobSelectorObj.container) {
    throw new Error("Missing container selector for job cards");
  }
  
  //  headless: true means not use gui
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector(jobSelectorObj.container); //  wait for the job container

  await autoScroll(page); // Scroll to load more jobs (if infinite scrolling)

  //  $$eval cannot return the as we want because it implicity returns void

  const cardCount = await page.$$eval(jobSelectorObj.container, cards => cards.length);
console.log("Cards found:", cardCount);

  const jobs: JobData[] = await page.$$eval(
    jobSelectorObj.container,
    (elements, { limit, jobSelectorObj, platform }) => {
      return elements.slice(0, limit).map((el) => ({
        title: el.querySelector(jobSelectorObj.title)?.textContent?.trim() || "",
        description: el.querySelector(jobSelectorObj.description)?.textContent?.trim() || "",
        companyName: el.querySelector(jobSelectorObj.companyName)?.textContent?.trim() || "",
        location: el.querySelector(jobSelectorObj.location)?.textContent?.trim() || "",
        minSalary: "",
        maxSalary: "",
        salary: el.querySelector(jobSelectorObj.salary)?.textContent?.trim() || "",
        eligibleYear: "",
        requiredExp: el.querySelector(jobSelectorObj.experience)?.textContent?.trim() || "",
        skills: Array.from(el.querySelectorAll(jobSelectorObj.skills)).map((s: any) => s.textContent?.trim() || ""),
        jobUrl: el.querySelector(jobSelectorObj.jobUrl)?.getAttribute("href") || "",
        postPlatform: platform,
        experienceLevel: "",
        position: "",
        postedAt: null,
        createdAt: null,
      }));
    },
    {
      limit: maxJobs,
      jobSelectorObj,
      platform: postPlatform,
    }
  );
  
  await browser.close();
  return jobs;
};


const autoScroll = async (page: any) => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 300);
    });
  });
};

export default scrapeJobHTMLs;
