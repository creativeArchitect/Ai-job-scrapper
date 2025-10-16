import { sendJobPostToAi } from "@/controller/filter.controller";
import { Router } from "express";

const filterJobRouter = Router();

filterJobRouter.get('/jobs/:platform', sendJobPostToAi);



export default filterJobRouter;