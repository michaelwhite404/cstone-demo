"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    roomNumber: {
        type: String,
        required: [true, "Each room must have a room number"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Each room must have a name"],
    },
});
const Room = mongoose_1.model("Room", roomSchema);
exports.default = Room;
