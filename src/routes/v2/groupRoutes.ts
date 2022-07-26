import { Router } from "express";
import { groupController, authController as v2auth } from "@controllers/v2";

const groupRouter = Router();

groupRouter.route("/").get(groupController.getAllGroups).post(groupController.createGroup);

groupRouter.route("/:group").get(groupController.getGroup);

export default groupRouter;
