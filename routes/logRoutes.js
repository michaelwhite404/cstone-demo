const express = require("express");
const logController = require("../controllers/logController");
const authController = require("../controllers/authController");

const router = express.Router()

router.use(authController.protect);

router.get("/", logController.getAllLogs);
router.get("/:id", logController.getLog);
router.get("/device/:device", logController.getLogsByDevice)

module.exports = router