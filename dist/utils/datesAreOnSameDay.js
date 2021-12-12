"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datesAreOnSameDay = (first, second) => first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
exports.default = datesAreOnSameDay;
