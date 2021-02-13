const express = require("express");
const deviceController = require("../controllers/deviceController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(deviceController.getAllDevices)
  .post(deviceController.createDevice);

router
  .route("/:id")
  .get(deviceController.getDevice)
  .patch(deviceController.updateDevice)
  .delete(deviceController.deleteDevice);

router.route("/:id/check-out").patch(deviceController.checkOutDevice);

router.route("/:id/check-in").patch(deviceController.checkInDevice);

router.get("/test/group", deviceController.testStatusGroup);

module.exports = router;
