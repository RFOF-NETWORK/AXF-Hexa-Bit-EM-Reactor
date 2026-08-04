import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import scanRouter from "./scan";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/scan", scanRouter);

export default router;
