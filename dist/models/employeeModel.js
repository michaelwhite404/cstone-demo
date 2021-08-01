"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const employeeSchema = new mongoose_1.Schema({
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
        enum: ["Super Admin", "Admin", "Development", "Instructor", "Intern", "Maintenance"],
    },
    image: String,
    googleId: String,
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
            validator: function (val) {
                // @ts-ignore
                return val === this.password;
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
    this.slug = slugify_1.default(this.fullName, { lower: true });
    next();
});
employeeSchema.pre("save", async function (next) {
    // Only run if password is modified
    if (!this.isModified("password"))
        return next();
    // Hash the password with cost of 12
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});
employeeSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
employeeSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew)
        return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});
employeeSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimeStamp, JWTTimestamp);
        return JWTTimestamp < changedTimeStamp;
    }
    // FALSE means NOT changed
    return false;
};
employeeSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default.createHash("sha256").update(resetToken).digest("hex");
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
const Employee = mongoose_1.model("Employee", employeeSchema);
exports.default = Employee;
