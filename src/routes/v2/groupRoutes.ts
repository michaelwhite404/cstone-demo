import { Router } from "express";
// import { employeeController, authController as v2auth } from "@controllers/v2";
import { admin, AppError, catchAsync } from "@utils";

const groupRouter = Router();

groupRouter.get(
  "/",
  catchAsync(async (_, res, _2) => {
    res.sendJson(200, {
      groups:
        (await admin.groups.list({ maxResults: 200, customer: process.env.GOOGLE_CUSTOMER_ID }))
          .data.groups || [],
    });
  })
);

groupRouter.get(
  "/:group",
  catchAsync(async (req, res, next) => {
    const options = { groupKey: `${req.params.group}@cornerstone-schools.org` };
    try {
      const response = await Promise.all([admin.groups.get(options), admin.members.list(options)]);
      const [adminGroup, members] = response;
      res.sendJson(200, {
        group: { ...adminGroup.data, members: members.data.members },
      });
    } catch (err) {
      return next(new AppError("Group not found: " + req.params.group, 404));
    }
  })
);

export default groupRouter;
