import { Router } from "express";
import * as roomController from "../../controllers/v2/roomController";
import * as v1auth from "../../controllers/v1/authController";

const router = Router();

router.use(v1auth.protect);

router.route("/").get(roomController.getAllRooms).post(roomController.createRoom);
router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
