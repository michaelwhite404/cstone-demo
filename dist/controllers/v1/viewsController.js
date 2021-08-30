"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceStatsPage = exports.testGroup = exports.getNewPasswordPage = exports.editStudentPage = exports.createStudentPage = exports.editUserPage = exports.createUserPage = exports.getDevicePage = exports.getAllDevicesPage = exports.editDevicePage = exports.addDevicePage = exports.getDashboardPage = exports.getHomePage = void 0;
const moment_1 = __importDefault(require("moment"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const deviceModel_1 = __importDefault(require("../../models/deviceModel"));
const appError_1 = __importDefault(require("../../utils/appError"));
const employeeModel_1 = __importDefault(require("../../models/employeeModel"));
const studentModel_1 = __importDefault(require("../../models/studentModel"));
const capitalize_1 = __importDefault(require("capitalize"));
const pluralize_1 = __importDefault(require("pluralize"));
const checkoutLogModel_1 = __importDefault(require("../../models/checkoutLogModel"));
const errorLogModel_1 = __importDefault(require("../../models/errorLogModel"));
const camelize_1 = __importDefault(require("../../utils/camelize"));
const ordinal_1 = __importDefault(require("../../utils/ordinal"));
const getHomePage = (_, res) => {
    if (res.locals.employee) {
        res.redirect("/dashboard");
    }
    else {
        res.status(200).render("login");
    }
};
exports.getHomePage = getHomePage;
exports.getDashboardPage = catchAsync_1.default(async (_, res) => {
    res.status(200).render("dashboard", {
        title: "Dashboard",
    });
});
exports.addDevicePage = catchAsync_1.default((req, res) => {
    res.status(200).render("addDevice", {
        title: `Add New ${capitalize_1.default(req.device)}`,
        deviceType: req.device,
        capitalize: capitalize_1.default,
    });
});
exports.editDevicePage = catchAsync_1.default(async (req, res, next) => {
    const device = await deviceModel_1.default.findOne({
        slug: req.params.slug,
        deviceType: req.device,
    });
    if (!device) {
        return next(new appError_1.default(`No ${req.device} found with that ID`, 404));
    }
    res.status(200).render("editDevice", {
        title: `Edit ${capitalize_1.default(req.device)}`,
        device,
        key: req.device,
    });
});
exports.getAllDevicesPage = catchAsync_1.default(async (req, res) => {
    const devices = await deviceModel_1.default.find({ deviceType: req.device }).sort({ name: 1 }).populate({
        path: "lastUser",
        fields: "fullName grade",
    });
    res.status(200).render("allDevices", {
        title: pluralize_1.default(capitalize_1.default(req.device)),
        key: req.device,
        devices,
        capitalize: capitalize_1.default,
        pluralize: pluralize_1.default,
        ordinal: ordinal_1.default,
        moment: moment_1.default,
    });
});
exports.getDevicePage = catchAsync_1.default(async (req, res, next) => {
    const device = await deviceModel_1.default.findOne({
        slug: req.params.slug,
        deviceType: req.device,
    })
        .populate({
        path: "lastUser",
        fields: "fullName grade",
    })
        .populate({
        path: "teacherCheckOut",
        fields: "fullName email",
    });
    if (!device) {
        return next(new appError_1.default(`No ${req.device} found with that ID`, 404));
    }
    const grades = await studentModel_1.default.aggregate([
        {
            $sort: { lastName: 1 },
        },
        {
            $group: {
                _id: "$grade",
                count: { $sum: 1 },
                students: { $push: { id: "$_id", fullName: "$fullName" } },
            },
        },
        {
            $project: {
                grade: "$_id",
                students: 1,
                count: 1,
                _id: 0,
            },
        },
        {
            $sort: { grade: 1 },
        },
    ]);
    const checkOutLog = await checkoutLogModel_1.default.find({ device: device._id })
        .sort({ checkOutDate: -1 })
        .populate({
        path: "deviceUser teacherCheckOut teacherCheckIn",
        fields: "fullName",
    });
    const errorLogs = await errorLogModel_1.default.find({ device: device._id })
        .sort({ createdAt: -1 })
        .populate({
        path: "checkInInfo",
        populate: {
            path: "deviceUser",
            select: "fullName",
        },
    });
    res.status(200).render("oneDevice", {
        title: device.name,
        device,
        grades,
        capitalize: capitalize_1.default,
        key: req.device,
        checkOutLog,
        errorLogs,
        camelize: camelize_1.default,
        ordinal: ordinal_1.default,
        moment: moment_1.default,
    });
});
exports.createUserPage = catchAsync_1.default(async (_, res) => {
    res.status(200).render("newUser", {
        title: "Create New User",
    });
});
exports.editUserPage = catchAsync_1.default(async (req, res, next) => {
    const editEmployee = await employeeModel_1.default.findOne({ slug: req.params.slug });
    if (!editEmployee) {
        return next(new appError_1.default("No employee found with that ID", 404));
    }
    res.status(200).render("editUser", {
        title: "Edit User",
        editEmployee,
    });
});
exports.createStudentPage = catchAsync_1.default(async (_, res) => {
    res.status(200).render("newStudent", {
        title: "Create New Student",
    });
});
exports.editStudentPage = catchAsync_1.default(async (req, res, next) => {
    const student = await studentModel_1.default.findOne({ slug: req.params.slug });
    if (!student) {
        return next(new appError_1.default("No student found with that ID", 404));
    }
    res.status(200).render("editStudent", {
        title: "Edit Student",
        student,
    });
});
exports.getNewPasswordPage = catchAsync_1.default(async (_, res) => {
    res.status(200).render("newPassword", {
        title: "Create Your New Password",
    });
});
exports.testGroup = catchAsync_1.default(async (_, res) => {
    const grades = await studentModel_1.default.aggregate([
        {
            $group: {
                _id: "$grade",
                count: { $sum: 1 },
                students: { $push: { id: "$_id", fullName: "$fullName" } },
            },
        },
        {
            $project: {
                grade: "$_id",
                students: 1,
                count: 1,
                _id: 0,
            },
        },
        {
            $sort: { grade: 1 },
        },
    ]);
    res.status(200).render("testGroup", {
        title: "Test Grouping",
        grades,
    });
});
exports.getDeviceStatsPage = catchAsync_1.default(async (req, res) => {
    const deviceType = req.device;
    const brands = await deviceModel_1.default.aggregate([
        {
            $match: { deviceType, brand: { $ne: "Fake Inc." } },
        },
        {
            $group: {
                _id: {
                    brand: "$brand",
                    status: "$status",
                    model: "$model",
                },
                count: { $sum: 1 },
            },
        },
        {
            $group: {
                _id: {
                    brand: "$_id.brand",
                    model: "$_id.model",
                },
                statuses: {
                    $push: {
                        status: "$_id.status",
                        count: "$count",
                    },
                },
                count: { $sum: "$count" },
            },
        },
        {
            $group: {
                _id: "$_id.brand",
                models: {
                    $push: {
                        model: "$_id.model",
                        count: "$count",
                        statuses: "$statuses",
                    },
                },
                count: { $sum: "$count" },
            },
        },
        {
            $project: {
                brand: "$_id",
                count: 1,
                models: 1,
                insensitive: { $toLower: "$_id" },
                _id: 0,
            },
        },
        {
            $sort: { insensitive: 1 },
        },
    ]);
    const statuses = await deviceModel_1.default.aggregate([
        {
            $match: { deviceType, brand: { $ne: "Fake Inc." } },
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                status: "$_id",
                count: 1,
                _id: 0,
            },
        },
    ]);
    const totals = {};
    const totalCount = await deviceModel_1.default.countDocuments({
        deviceType,
        brand: { $ne: "Fake Inc." },
    });
    totals.count = totalCount;
    totals.statuses = statuses;
    const getModelStatusCount = (array, status) => {
        const statusIndex = array.findIndex((x) => x.status === status);
        const nOfStatus = statusIndex === -1 ? 0 : array[statusIndex].count;
        return nOfStatus;
    };
    const getBrandStatusCount = (array, status) => {
        let nOfStatus = 0;
        for (let i = 0; i < array.length; i++) {
            nOfStatus += getModelStatusCount(array[i].statuses, status);
        }
        return nOfStatus;
    };
    res.status(200).render("deviceStats", {
        title: `${capitalize_1.default(req.device)} Stats`,
        brands,
        totals,
        getModelStatusCount,
        getBrandStatusCount,
    });
});
