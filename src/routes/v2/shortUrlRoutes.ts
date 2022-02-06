import { Router } from "express";
import * as v2auth from "../../controllers/v2/authController";
import * as shortUrlController from "../../controllers/v2/shortUrlController";

const router = Router();

router.use(v2auth.protect);

router.route("/").get(shortUrlController.getAllShortUrls).post(shortUrlController.createShortUrl);
router.route("/:id").get(shortUrlController.getShortUrl);

export default router;
