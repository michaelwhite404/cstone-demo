import { Router } from "express";
import textbookRouter from "./textbookRoutes";
import studentRouter from "./studentRoutes";
import employeeRouter from "./employeeRoutes";
import deviceRouter from "./deviceRoutes";
import roomRouter from "./roomRoutes";

const v2Router = Router();

v2Router.use("/students", studentRouter);
v2Router.use("/users", employeeRouter);
v2Router.use("/devices", deviceRouter);
v2Router.use("/textbooks", textbookRouter);
v2Router.use("/rooms", roomRouter);
// v2Router.use("/employee-leave" /*, employeeLeaveRouter */);
// v2Router.use("/reimbursement" /* , reimbursementRouter */);
// v2Router.use("/ideas" /* ,ideaRouter */);

export default v2Router;
