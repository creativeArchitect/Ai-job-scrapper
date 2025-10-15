import { getAllScrappedJobs } from "@/controller/job.controller";
import { Router } from "express";

const scrappedJobRouter = Router();

scrappedJobRouter.get('/', getAllScrappedJobs);


export default scrappedJobRouter;
