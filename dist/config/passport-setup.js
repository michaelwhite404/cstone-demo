"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const employeeModel_1 = __importDefault(require("../models/employeeModel"));
passport_1.default.serializeUser((employee, done) => {
    // @ts-ignore
    done(null, employee._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const employee = await employeeModel_1.default.findById(id);
    done(null, employee);
});
passport_1.default.use(new passport_google_oauth20_1.default.Strategy({
    // options for Google Strategy
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (_1 /* accessToken */, _2 /* refreshToken */, profile, done) => {
    // Check if user exists
    const employee = await employeeModel_1.default.findOne({ email: profile._json.email });
    if (employee) {
        employee.lastLogin = new Date(Date.now());
        employee.image = profile._json.picture;
        if (!employee.googleId)
            employee.googleId = profile._json.sub;
        await employee.save({ validateBeforeSave: false });
    }
    done(null, employee);
}));
