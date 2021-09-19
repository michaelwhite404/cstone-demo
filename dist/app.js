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
const express_graphql_1 = require("express-graphql");
const appError_1 = __importDefault(require("./utils/appError"));
const errorController_1 = __importDefault(require("./controllers/errorController"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
// import viewRouter from "./routes/v1/viewRoutes";
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
require("./config/passport-setup");
// import { buildSchema } from "graphql";
const schema_1 = __importDefault(require("./graphql/schema"));
const app = express_1.default();
// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "../views"));
// 1.) MIDDLEWARES
// Serving static files
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
app.use((req, _, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// Development Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default("dev"));
}
// Limit requests from same API
const limiter = express_rate_limit_1.default({
    max: 300,
    windowMs: 60000,
    message: "To many requests from this IP, please try again in one minute",
});
app.use("/api", limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: "25kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "25kb" }));
app.use(cookie_parser_1.default());
app.use(passport_1.default.initialize());
// Data Sanitization angainst NoSQL query injection
app.use(express_mongo_sanitize_1.default());
// Data Sanitization angainst XSS attacks
app.use(xss_clean_1.default());
app.use(compression_1.default());
app.use("/api", apiRoutes_1.default);
app.use("/graphql", express_graphql_1.graphqlHTTP({
    schema: schema_1.default,
    graphiql: true,
})
/* (req, res) => {
  res.status(200);
} */
);
app.use("/auth", authRoutes_1.default);
// app.use("/", viewRouter);
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.resolve(path_1.default.resolve(__dirname, "../client/build"))));
    app.get("*", (_, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../client/build/index.html"));
    });
}
else {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
}
app.all("*", (req, _, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
