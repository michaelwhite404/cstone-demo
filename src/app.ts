import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import path from "path";
import compression from "compression";
import passport from "passport";
import { graphqlHTTP } from "express-graphql";

import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorController";
import apiRouter from "./routes/apiRoutes";
import viewRouter from "./routes/v1/viewRoutes";
import authRouter from "./routes/authRoutes";
import pdfRouter from "./routes/pdfRoutes";
import csvRouter from "./routes/csvRoutes";
import "./config/passport-setup";
import schema from "./graphql/schema";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../views"));

// 1.) MIDDLEWARES
// Serving static files

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

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Development Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 300,
  windowMs: 60000,
  message: "To many requests from this IP, please try again in one minute",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "25kb" }));
app.use(express.urlencoded({ extended: true, limit: "25kb" }));
app.use(cookieParser());

app.use(passport.initialize());

// Data Sanitization angainst NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization angainst XSS attacks
app.use(xss());

app.use(compression());

app.use("/api", apiRouter);
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
  /* (req, res) => {
    res.status(200);
  } */
);
app.use("/auth", authRouter);
app.use("/pdf", pdfRouter);
app.use("/csv", csvRouter);
app.use("/", viewRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(path.resolve(__dirname, "../client/build"))));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "../public")));
}

app.all("*", (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
export default app;
