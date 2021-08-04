import { Router } from "express";
import * as textbookSetController from "../../controllers/v2/textbookSetController";

const router = Router();

router
  .route("/")
  .get(textbookSetController.getAllTextbookSets)
  .post(textbookSetController.createTextbookSet);

router
  .route("/:id")
  .get(textbookSetController.getOneTextbookSet)
  .patch(textbookSetController.updateTextbookSet)
  .delete(textbookSetController.deleteTextbookSet);

export default router;
