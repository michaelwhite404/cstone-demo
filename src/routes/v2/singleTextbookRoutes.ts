import { Router } from "express";
import * as singleTextbookController from "../../controllers/v2/singleTextbookController";
import * as helpers from "../../controllers/v2/helpers";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(helpers.addKeyToQuery("textbookSet"), singleTextbookController.getAllBooks)
  .post(helpers.addParamsToBody("textbookSet"), singleTextbookController.createBook);

router
  .route("/:_id")
  .get(singleTextbookController.getBook)
  .patch(singleTextbookController.updateBook);

export default router;
