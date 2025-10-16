import scrapeJobHTMLs from "@/scripts/scrapper";
import analyzeJobs from "@/utils/filter.utils";
import { Request, Response, NextFunction } from "express";

export const sendInternshalaJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const url = "https://internshala.com/jobs";
    const selector = ".individual_internship";

    const htmlArray = await scrapeJobHTMLs(url, selector, 5);

    const result = await analyzeJobs(htmlArray, "internshala");

    console.log("result: ", result);

  } catch (err) {
    console.error("Error in getting scrapped jobs:", err);
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const sendCuvetteJobPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const linkedinJobsHTML = await linkedinScrapper();
    // if(!linkedinJobsHTML){
    //     return res.status(404).json({
    //         success: false,
    //         message: "linkedin scrapped jobs detail not found"
    //     })
    // }

    // const aiGenLinkedinFetauredJobs = await analyzeJobs(linkedinJobsHTML, "linkedin");

    // if(!aiGenLinkedinFetauredJobs){
    //     return res.status(404).json({
    //         success: false,
    //         message: "ai gen linkedin scrapped jobs detail not found"
    //     })
    // }

    // res.status(200).json({
    //     success: true,
    //     message: "filtered job details got successfully",
    //     data: aiGenLinkedinFetauredJobs
    // })

    const url = "https://cuvette.tech/jobs";
    const selector = ".individual_internship";

    const htmlArray = await scrapeJobHTMLs(url, selector, 5);

    // console.log(htmlArray.length, "jobs scraped!");
    // console.log(htmlArray[0]);

    console.log("htmlArray: ", htmlArray);
  } catch (err) {
    console.log("error in the getting scrapped jobs");

    return res.status(500).json({
      success: false,
      message: "Error in getting the scrapped jobs",
    });
  }
};
