"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const student_1 = require("./student");
const resolvers = {
    Query: {
        ...student_1.studentQueries,
    },
};
exports.default = resolvers;
