import { Router } from "express";
import * as singleTextbookController from "../../controllers/v2/singleTextbookController";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(singleTextbookController.getAllBooks)
  .post(singleTextbookController.createBook);

router
  .route("/:_id")
  .get(singleTextbookController.getBook)
  .patch(singleTextbookController.updateBook);

export default router;
