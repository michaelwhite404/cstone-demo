import { RequestHandler } from "express";
import CheckoutLog from "../../models/checkoutLogModel";
import * as factory from "./handlerFactory";

const Model = CheckoutLog;
const key = "deviceLog";

/** `GET` - Gets all device logs
 *  - All authorized users can access this route
 */
export const getAllLogs: RequestHandler = factory.getAll(Model, `${key}s`);

/** `GET` - Gets a single device log
 *  - All authorized users can access this route
 */
export const getOneLog = factory.getOne(Model, key);
