import { Request, Response, Router } from "express";
import { protect } from "../controllers/v2/authController";
import { stringify } from "csv-stringify";
import PopOptions from "../types/popOptions";
import CheckoutLog from "../models/checkoutLogModel";
import APIFeatures from "../utils/apiFeatures";
import catchAsync from "../utils/catchAsync";

const router = Router();

router.use(protect);
router.get(
  "/device-logs",
  catchAsync(async (req: Request, res: Response) => {
    const filter = {};
    const populate = {
      path: "device deviceUser teacherCheckOut teacherCheckIn",
      select: "name brand fullName",
    } as PopOptions;
    !req.query.limit && (req.query.limit = "10000");
    req.query.fields = undefined;
    req.query.sort = "-checkOutDate -checkInDate";

    const query = CheckoutLog.find(filter);
    if (populate) query.populate(populate);
    const features = new APIFeatures(query, req.query).filter().limitFields().sort().paginate();
    const checkoutLogs = await features.query;

    const body = [
      [
        "device",
        "checkedIn",
        "student",
        "checkOutDate",
        "teacherCheckOut",
        "checkInDate",
        "teacherCheckIn",
      ],
    ];
    checkoutLogs.forEach((log) =>
      body.push([
        log.device.name,
        `${log.checkedIn}`,
        log.deviceUser.fullName,
        log.checkOutDate.toLocaleString(),
        log.teacherCheckOut.fullName,
        log.checkInDate?.toLocaleString() || "",
        log.teacherCheckIn?.fullName! || "",
      ])
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="' + "device-logs" + new Date().toISOString() + '.csv"'
    );
    stringify(body).pipe(res);
  })
);

export default router;
