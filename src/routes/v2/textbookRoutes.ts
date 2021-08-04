import { Router } from "express";
import * as textbookController from "../../controllers/v2/textbookController";

const router = Router();

router.route("/").get(textbookController.getAllTextbooks).post(textbookController.createTextbook);

router
  .route("/:id")
  .get(textbookController.getOneTextbook)
  .patch(textbookController.updateTextbook)
  .delete(textbookController.deleteTextbook);

export default router;
