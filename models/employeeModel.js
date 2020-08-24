const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const slugify = require("slugify");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "An employee must have a first name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "An employee must have a last name"],
    trim: true,
  },
  fullName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "An employee must have an email address"],
    unique: true,
  },
  homeroomGrade: {
    type: Number,
    required: false,
    min: 0,
    max: 12,
  },
  title: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Super Admin", "Admin", "Development", "Instructor", "Maintenance"],
  },
  image: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: false /* [true, "Please confirm your password"], */,
    validate: {
      // This only works on CREATE or SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  slug: String,
});

employeeSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.slug = slugify(this.fullName, { lower: true });
  next();
});

employeeSchema.pre("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

employeeSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

employeeSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

employeeSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }

  // FALSE means NOT changed
  return false;
};

employeeSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
