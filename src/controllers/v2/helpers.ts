import { RequestHandler } from "express";
import omitFromObject from "../../utils/omitFromObject";

export const omitFromBody = (...keys: string[]): RequestHandler => {
  return (req, _, next) => {
    omitFromObject(req.body, ...keys);
    next();
  };
};

export const addDeviceToQuery: RequestHandler = (req, _, next) => {
  if (req.params.device) req.query.device = req.params.device;
  next();
};
