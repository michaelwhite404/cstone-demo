import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import passport from "passport";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import deviceRouter from "./routes/deviceRoutes";
import logRouter from "./routes/logRoutes";
import errorLogRouter from "./routes/errorLogRoutes";
import employeeRouter from "./routes/employeeRoutes";
import studentRouter from "./routes/studentRoutes";
import viewRouter from "./routes/viewRoutes";
import authRouter from "./routes/authRoutes";
import "./config/passport-setup";
import CustomRequest from "./types/customRequest";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname.replace("\\dist", ""), "views"));

// 1.) MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname.replace("\\dist", ""), "public")));

/* Redirect http to https */
app.get("*", function (req, res, next) {
  if ("https" !== req.headers["x-forwarded-proto"] && "production" === process.env.NODE_ENV) {
    res.redirect("https://" + req.hostname + req.url);
  } else {
    // Continue to other routes if we're not redirecting
    next();
  }
});

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

app.use(passport.initialize());

// Data Sanitization angainst NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization angainst XSS attacks
app.use(xss());

app.use(compression());

app.use(
  "/api/v1/chromebooks",
  (req, _, next) => {
    (req as CustomRequest).device = "chromebook";
    next();
  },
  deviceRouter
);
app.use(
  "/api/v1/tablets",
  (req, _, next) => {
    (req as CustomRequest).device = "tablet";
    next();
  },
  deviceRouter
);
app.use(
  "/api/v1/error-logs",
  (req, _, next) => {
    (req as CustomRequest).key = "error";
    next();
  },
  errorLogRouter
);
app.use(
  "/api/v1/logs",
  (req, _, next) => {
    (req as CustomRequest).key = "log";
    next();
  },
  logRouter
);
app.use("/api/v1/users", employeeRouter);
app.use("/api/v1/students", studentRouter);
app.use("/auth", authRouter);
app.use("/", viewRouter);

app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
