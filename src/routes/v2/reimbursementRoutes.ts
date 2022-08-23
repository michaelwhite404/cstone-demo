import { Router } from "express";
import { authController as v2auth, reimbursementController } from "@controllers/v2";
import multer from "multer";

const upload = multer();
const reimbursementRouter = Router();

reimbursementRouter.use(v2auth.protect);

reimbursementRouter
  .route("/")
  .get(reimbursementController.getAllReimbursements)
  .post(upload.single("receipt"), reimbursementController.createReimbursement);

reimbursementRouter.post("/test", upload.single("receipt"), (req, res) => {
  console.log(req.file);
  console.log("------------");
  console.log(req.body);
  console.log("------------");
  console.log(req.employee);

  res.send("DONE");
});

reimbursementRouter.route("/:id").get(reimbursementController.getReimbursement);
export default reimbursementRouter;
