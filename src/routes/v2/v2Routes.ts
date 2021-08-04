import { Router } from "express";
import textbookSetRouter from "./textbookSetRoutes";

const v2Router = Router();

// v2Router.use("/students" /* ,studentRouter */);
// v2Router.use("/users" /* , userRouter */);
// v2Router.use("/devices" /* , deviceRouter */);
v2Router.use("/textbook-sets", textbookSetRouter);
// v2Router.use("/employee-leave" /*, employeeLeaveRouter */);
// v2Router.use("/reimbursement" /* , reimbursementRouter */);
// v2Router.use("/ideas" /* ,ideaRouter */);

export default v2Router;
