const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const Employee = require("../models/employeeModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

passport.serializeUser((employee, done) => {
  done(null, employee._id);
});

passport.deserializeUser(async (id, done) => {
  const employee = await Employee.findById(id);
  done(null, employee);
});

passport.use(
  new GoogleStrategy(
    {
      // options for Google Strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if user exists
      const employee = await Employee.findOne({ email: profile._json.email });
      if (employee) {
        employee.lastLogin = Date.now();
        employee.image = profile._json.picture;
        if (!employee.googleId) employee.googleId = profile._json.sub;
        await employee.save({ validateBeforeSave: false });
      }
      done(null, employee);
    }
  )
);
