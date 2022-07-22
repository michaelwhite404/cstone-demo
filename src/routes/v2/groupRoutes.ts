import { Router } from "express";
// import { employeeController, authController as v2auth } from "@controllers/v2";
import { google } from "googleapis";
import { googleAuthJWT } from "@controllers/v2/authController";
import { catchAsync } from "@utils";

const groupRouter = Router();

const scopes = ["https://www.googleapis.com/auth/admin.directory.group"];
const admin = google.admin({
  version: "directory_v1",
  auth: googleAuthJWT(scopes, process.env.GOOGLE_ADMIN_EMAIL),
});

groupRouter.get("/");
groupRouter.get(
  "/:email",
  catchAsync(async (req, res, _2) => {
    const { email } = req.params;
    const response = await admin.groups.list({
      userKey: email,
    });
    const groups = response.data.groups || [];
    res.sendJson(200, {
      groups,
    });
  })
);

export default groupRouter;
