import { Router } from "express";
// import { employeeController, authController as v2auth } from "@controllers/v2";
import fs from "fs";
import path from "path";
import { admin_directory_v1 } from "googleapis";
type GroupsRes = admin_directory_v1.Schema$Groups;

const groupRouter = Router();

groupRouter.get("/");
groupRouter.get("/:email", (_, res, _2) => {
  const response = fs.readFileSync(path.join(__dirname, "../../../groups.json"));
  const groupsRes: GroupsRes = JSON.parse(response.toString());
  res.sendJson(200, {
    groups: groupsRes.groups,
  });
});

export default groupRouter;
