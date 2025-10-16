import { sendInternshalaJobPost,sendCuvetteJobPost } from "@/controller/filter.controller";
import { Router } from "express";

const filterJobRouter = Router();

filterJobRouter.get('/internshala/jobs', sendInternshalaJobPost);
filterJobRouter.get('/linkedin/jobs', sendCuvetteJobPost);



export default filterJobRouter;