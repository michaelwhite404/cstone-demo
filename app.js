const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const pug = require("pug");
const path = require("path");
const compression = require("compression");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const deviceRouter = require("./routes/deviceRoutes");
const logRouter = require("./routes/logRoutes");
const employeeRouter = require("./routes/employeeRoutes");
const studentRouter = require("./routes/studentRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1.) MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
// app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data Sanitization angainst NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization angainst XSS attacks
app.use(xss());

app.use(compression());

// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

app.use("/", viewRouter);
app.use("/api/v1/chromebooks", (req, res, next) => {req.device = "chromebook"; next();} , deviceRouter);
app.use("/api/v1/tablets", (req, res, next) => {req.device = "tablet"; next();}, deviceRouter);
app.use("/api/v1/logs", (req, res, next) => {req.key = "log"; next();}, logRouter);
app.use("/api/v1/users", employeeRouter);
app.use("/api/v1/students", studentRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
