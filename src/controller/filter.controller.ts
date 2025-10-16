import scrapeJobHTMLs from "@/scripts/scrapper";
import analyzeJobs from "@/utils/filter.utils";
import { Request, Response, NextFunction } from "express";

export const sendJobPostToAi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const platform = req.params.platform;

    if (platform === "internshala") {
      const url = "https://internshala.com/jobs";

      const internshalaPlatformSelector = {
        container: ".individual_internship",
        title: ".job-title-href",
        description: ".about_job .text",
        companyName: ".company-name",
        location: ".locations",
        salary: ".row-1-item i.ic-16-money + span",
        experience: ".row-1-item i.ic-16-briefcase + span",
        skills: ".job_skills .job_skill",
        jobUrl: ".job-title-href",
      };

      const scrappedHtmlArr = await scrapeJobHTMLs(
        url,
        internshalaPlatformSelector,
        5,
        platform
      );
      
      console.log("scrapped jobs:", scrappedHtmlArr);

      const aiResponseOutput = await analyzeJobs(scrappedHtmlArr, platform);

      console.log("analyzed ai output of job: ", aiResponseOutput);

    } else if (platform === "cuvette") {
      const url = "https://internshala.com/jobs";

      const cuvettePlatformSelector = {
        container: "",
        title: ".job-title-href",
        description: ".about_job .text",
        companyName: ".company-name",
        location: ".locations",
        salary: ".row-1-item i.ic-16-money + span",
        experience: ".row-1-item i.ic-16-briefcase + span",
        skills: ".job_skills .job_skill",
        jobUrl: ".job-title-href",
      };

      const scrappedHtmlArr = await scrapeJobHTMLs(
        url,
        cuvettePlatformSelector,
        10,
        platform
      );

      const aiResponseOutput = await analyzeJobs(scrappedHtmlArr, platform);

      console.log("analyzed job: ", aiResponseOutput);
    }
  } catch (err) {
    console.error("Error in getting scrapped jobs:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
