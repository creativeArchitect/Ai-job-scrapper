import { chromium } from "playwright";

const scrapeJobHTMLs = async (
  url: string,
  jobSelector: string,
  maxJobs = 1
) => {
  //  headless: true means not use gui
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector(jobSelector); //  wait for the job container

  await autoScroll(page); // Scroll to load more jobs (if infinite scrolling)

  //  $$eval cannot return the as we want because it implicity returns void
  const jobHTMLs = await page.$$eval(
    jobSelector,
    (elements, limit) => {
      return elements.slice(0, limit).map((el) => el.outerHTML);
    },
    maxJobs
  );
  await browser.close();
  return jobHTMLs;
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
