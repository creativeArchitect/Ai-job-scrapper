import { sendInternshalaJobPost,sendLinkedinJobPost } from "@/controller/filter.controller";
import { Router } from "express";

const filterJobRouter = Router();

filterJobRouter.post('/internshala/jobs', sendInternshalaJobPost);
filterJobRouter.post('/linkedin/jobs', sendLinkedinJobPost);



export default filterJobRouter;