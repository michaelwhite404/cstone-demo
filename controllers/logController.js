const CheckoutLog = require("../models/checkoutLogModel")
const factory = require("./handlerFactory");

exports.getAllLogs = factory.getAll(CheckoutLog)
exports.getLog = factory.getOne(CheckoutLog, { 
  path: 'device deviceUser teacherCheckOut teacherCheckIn', 
  select: 'deviceType name fullName grade email' 
});
exports.getLogsByDevice = factory.getAll(CheckoutLog);