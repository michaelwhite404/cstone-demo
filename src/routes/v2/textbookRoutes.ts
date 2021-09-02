import { Router } from "express";
import * as textbookController from "../../controllers/v2/textbookController";
import { protect } from "../../controllers/v1/authController";
import singleTextbookRouter from "./singleTextbookRoutes";

const router = Router();

router.use(protect);

router.use("/books", singleTextbookRouter);
router.use("/:textbookSet/books", singleTextbookRouter);

router.route("/").get(textbookController.getAllTextbooks).post(textbookController.createTextbook);

router.post("/books/both", textbookController.createSetAndBooks);

router
  .route("/:id")
  .get(textbookController.getOneTextbook)
  .patch(textbookController.updateTextbook)
  .delete(textbookController.deleteTextbook);

export default router;
