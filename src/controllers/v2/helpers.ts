import { RequestHandler } from "express";
import omitFromObject from "../../utils/omitFromObject";

export const omitFromBody = (...keys: string[]): RequestHandler => {
  return (req, _, next) => {
    omitFromObject(req.body, ...keys);
    next();
  };
};
