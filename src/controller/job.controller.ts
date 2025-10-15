import { PrismaClient } from "../generated/prisma";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const getAllScrappedJobs = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const platform = req.body.platform;
        const jobs = await prisma.scrapedJob.findMany({
            where: {
                postPlatform: platform
            }
        })
        if(jobs.length === 0){
            return res.status(404).json({
                success: false,
                message: "jobs are not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "jobs fetched successfully",
            data: jobs
        })
    } catch(err) {
        console.log("error in the getting scrapped jobs");

        return res.status(500).json({
            success: false,
            message: "Error in getting the scrapped jobs"
        })
    }
}


