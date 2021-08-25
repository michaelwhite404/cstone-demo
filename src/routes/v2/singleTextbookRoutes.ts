import { Router } from "express";
import * as singleTextbookController from "../../controllers/v2/singleTextbookController";
import * as helpers from "../../controllers/v2/helpers";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(helpers.addKeyToQuery("textbookSet"), singleTextbookController.getAllBooks)
  .post(helpers.addParamsToBody("textbookSet"), singleTextbookController.createBook);

router.post("/check-out", singleTextbookController.checkOutTextbooks);
// router.patch("/check-in")

router.post("/check-out/student/:student_id", singleTextbookController.checkOutTextbookByStudent);
router.patch("/check-in/student/:student_id", singleTextbookController.checkInTextbookByStudent);

router
  .route("/:_id")
  .get(singleTextbookController.getBook)
  .patch(singleTextbookController.updateBook);

export default router;
