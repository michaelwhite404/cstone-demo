import { Router } from "express";
import textbookSetRouter from "./textbookSetRoutes";
import textbookRouter from "./textbookRoutes";
import studentRouter from "./studentRoutes";
import employeeRouter from "./employeeRoutes";
import deviceRouter from "./deviceRoutes";

const v2Router = Router();

v2Router.use("/students", studentRouter);
v2Router.use("/users", employeeRouter);
v2Router.use("/devices", deviceRouter);
v2Router.use("/textbook-sets", textbookSetRouter);
v2Router.use("/textbooks", textbookRouter);
// v2Router.use("/employee-leave" /*, employeeLeaveRouter */);
// v2Router.use("/reimbursement" /* , reimbursementRouter */);
// v2Router.use("/ideas" /* ,ideaRouter */);

export default v2Router;
