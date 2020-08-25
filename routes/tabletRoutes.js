const express = require("express");
const tabletController = require("../controllers/tabletController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(tabletController.getAllTablets)
  .post(tabletController.createTablet);

router
  .route("/:id")
  .get(tabletController.getTablet)
  .patch(tabletController.updateTablet)
  .delete(tabletController.deleteTablet);

router
  .route("/:id/check-out")
  .patch(
    authController.protect,
    tabletController.setCurrentUserId,
    tabletController.checkOutTablet
  );

router
  .route("/:id/check-in")
  .patch(
    authController.protect,
    tabletController.setCurrentUserId,
    tabletController.checkInTablet
  );

module.exports = router;
