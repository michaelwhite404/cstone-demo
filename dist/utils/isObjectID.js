"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const isObjectID = (id) => {
    if (!mongoose_1.isValidObjectId(id))
        return false;
    return new mongoose_1.Types.ObjectId(id).toString() === id;
};
exports.default = isObjectID;
