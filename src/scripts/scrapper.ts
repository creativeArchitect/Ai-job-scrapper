import { JobData } from "@/types/job.types";
import { chromium } from "playwright";
import fs from 'fs'
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

  await loadJobs(page, jobSelectorObj, maxJobs);
  await page.waitForTimeout(2000); // give time for dynamic content to load
  

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
  
  await fs.writeFile('output.txt', JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log('Data appended successfully!');
  });

  await browser.close();
  return jobs;
};

const loadByScrolling = async (page: any, jobSelectorObj: any, maxJobs: number) => {
  let jobCount = 0;
  let tries = 0;

  while (jobCount < maxJobs && tries < 10) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await page.waitForTimeout(2000); // Wait for lazy load
    jobCount = await page.$$eval(jobSelectorObj.container, (els) => els.length);
    console.log(`Scrolled... Found ${jobCount} jobs`);
    tries++;
  }
};

const loadByPagination = async (page: any, jobSelectorObj: any, maxJobs: number) => {
  let jobCount = 0;
  let pageCount = 0;

  while (jobCount < maxJobs && pageCount < 10) {
    await page.waitForTimeout(2000);

    jobCount = await page.$$eval(jobSelectorObj.container, (els: any) => els.length);
    console.log(`Page ${pageCount + 1}: Found ${jobCount} jobs`);

    // Click the next button if it exists and is enabled
    const hasNext = await page.$(jobSelectorObj.nextButton);
    if (!hasNext) break;

    const isDisabled = await page.$eval(jobSelectorObj.nextButton, (btn: any) => btn.disabled || btn.classList.contains("disabled"));
    if (isDisabled) break;

    await hasNext.click();
    await page.waitForTimeout(3000);
    pageCount++;
  }
};


const loadJobs = async (page: any, jobSelectorObj: any, maxJobs: number) => {
  if (jobSelectorObj.loadType === "scroll") {
    await loadByScrolling(page, jobSelectorObj, maxJobs);
  } else if (jobSelectorObj.loadType === "pagination") {
    await loadByPagination(page, jobSelectorObj, maxJobs);
  } else {
    console.warn("Unknown loadType. Defaulting to scroll.");
    await loadByScrolling(page, jobSelectorObj, maxJobs);
  }
};


export default scrapeJobHTMLs;
