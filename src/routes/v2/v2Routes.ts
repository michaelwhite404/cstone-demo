import { Router } from "express";
import textbookRouter from "./textbookRoutes";
import studentRouter from "./studentRoutes";
import employeeRouter from "./employeeRoutes";
import deviceRouter from "./deviceRoutes";
import roomRouter from "./roomRoutes";
import timesheetRouter from "./timesheetRoutes";
import departmentRouter from "./departmentRoutes";
import orgUnitRouter from "./orgUnitRoutes";
import shortUrlRouter from "./shorturlRoutes";

const v2Router = Router();

v2Router.use("/students", studentRouter);
v2Router.use("/users", employeeRouter);
v2Router.use("/devices", deviceRouter);
v2Router.use("/textbooks", textbookRouter);
v2Router.use("/rooms", roomRouter);
v2Router.use("/timesheets", timesheetRouter);
v2Router.use("/departments", departmentRouter);
v2Router.use("/org-units", orgUnitRouter);
v2Router.use("/short", shortUrlRouter);
// v2Router.use("/employee-leave" /*, employeeLeaveRouter */);
// v2Router.use("/reimbursement" /* , reimbursementRouter */);
// v2Router.use("/ideas" /* ,ideaRouter */);

export default v2Router;
