"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const passport_1 = __importDefault(require("passport"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const deviceRoutes_1 = __importDefault(require("./routes/deviceRoutes"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const errorLogRoutes_1 = __importDefault(require("./routes/errorLogRoutes"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const viewRoutes_1 = __importDefault(require("./routes/viewRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
require("./config/passport-setup");
const app = express_1.default();
// 1.) MIDDLEWARES
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
/* Redirect http to https */
app.get("*", function (req, res, next) {
    if ("https" !== req.headers["x-forwarded-proto"] && "production" === process.env.NODE_ENV) {
        res.redirect("https://" + req.hostname + req.url);
    }
    else {
        // Continue to other routes if we're not redirecting
        next();
    }
});
// Set security HTTP headers
// app.use(helmet());
// Development Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default("dev"));
}
// Limit requests from same API
const limiter = express_rate_limit_1.default({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "To many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookie_parser_1.default());
app.use(passport_1.default.initialize());
// Data Sanitization angainst NoSQL query injection
app.use(express_mongo_sanitize_1.default());
// Data Sanitization angainst XSS attacks
app.use(xss_clean_1.default());
app.use(compression_1.default());
app.use("/api/v1/chromebooks", (req, _, next) => {
    req.device = "chromebook";
    next();
}, deviceRoutes_1.default);
app.use("/api/v1/tablets", (req, _, next) => {
    req.device = "tablet";
    next();
}, deviceRoutes_1.default);
app.use("/api/v1/error-logs", (req, _, next) => {
    req.key = "error";
    next();
}, errorLogRoutes_1.default);
app.use("/api/v1/logs", (req, _, next) => {
    req.key = "log";
    next();
}, logRoutes_1.default);
app.use("/api/v1/users", employeeRoutes_1.default);
app.use("/api/v1/students", studentRoutes_1.default);
app.use("/auth", authRoutes_1.default);
app.use("/", viewRoutes_1.default);
app.all("*", (req, _, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
