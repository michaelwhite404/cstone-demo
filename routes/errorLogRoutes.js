const express = require("express");
const errorLogController = require("../controllers/errorLogController");
const authController = require("../controllers/authController");

const router = express.Router()

router.use(authController.protect);

router.route("/")
  .get(errorLogController.getAllErrorLogs)
  .post(errorLogController.createErrorLog)

router.route("/:id")
  .get(errorLogController.getErrorLog)
  .patch(errorLogController.updateErrorLog);

router.get("/device/:device", errorLogController.getErrorLogsByDevice)

module.exports = router