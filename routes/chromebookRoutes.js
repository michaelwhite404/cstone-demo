const express = require("express");
const chromebookController = require("../controllers/chromebookController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(chromebookController.getAllChromebooks)
  .post(chromebookController.createChromebook);

router
  .route("/:id")
  .get(chromebookController.getChromebook)
  .patch(chromebookController.updateChromebook)
  .delete(chromebookController.deleteChromebook);

router
  .route("/:id/check-out")
  .patch(
    authController.protect,
    chromebookController.setCurrentUserId,
    chromebookController.checkOutChromebook
  );

router
  .route("/:id/check-in")
  .patch(
    authController.protect,
    chromebookController.setCurrentUserId,
    chromebookController.checkInChromebook
  );

module.exports = router;
