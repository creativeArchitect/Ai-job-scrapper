import internshalaScrapper from "@/scripts/internshala.script";
import linkedinScrapper from "@/scripts/linkedin.script";
import analyzeJobs from "@/utils/filter.utils";
import { Request, Response, NextFunction } from "express";


export const sendInternshalaJobPost = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const internshalaJobsHTML = internshalaScrapper();
        if(!internshalaJobsHTML){
            return res.status(404).json({
                success: false,
                message: "internshala scrapped jobs detail not found"
            })
        }

        const aiGenInternshalaFetauredJobs = await analyzeJobs(internshalaJobsHTML, "internshala");

        if(!aiGenInternshalaFetauredJobs){
            return res.status(404).json({
                success: false,
                message: "ai gen internshala scrapped jobs detail not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "filtered job details got successfully",
            data: aiGenInternshalaFetauredJobs
        })

    } catch(err) {
        console.log("error in the getting scrapped jobs");

        return res.status(500).json({
            success: false,
            message: "Error in getting the scrapped jobs"
        })
    }
}


export const sendLinkedinJobPost = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const linkedinJobsHTML = linkedinScrapper();
        if(!linkedinJobsHTML){
            return res.status(404).json({
                success: false,
                message: "linkedin scrapped jobs detail not found"
            })
        }

        const aiGenLinkedinFetauredJobs = await analyzeJobs(linkedinJobsHTML, "linkedin");

        if(!aiGenLinkedinFetauredJobs){
            return res.status(404).json({
                success: false,
                message: "ai gen linkedin scrapped jobs detail not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "filtered job details got successfully",
            data: aiGenLinkedinFetauredJobs
        })

    } catch(err) {
        console.log("error in the getting scrapped jobs");

        return res.status(500).json({
            success: false,
            message: "Error in getting the scrapped jobs"
        })
    }
}