"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoom = exports.createRoom = exports.getRoom = exports.getAllRooms = void 0;
const roomModel_1 = __importDefault(require("../../models/roomModel"));
const factory = __importStar(require("./handlerFactory"));
const Model = roomModel_1.default;
const key = "room";
/** `GET` - Gets all rooms
 *  - All authorized users can access this route
 */
exports.getAllRooms = factory.getAll(Model, `${key}s`);
/** `GET` - Gets a single room
 *  - All authorized users can access this route
 */
exports.getRoom = factory.getOneById(Model, key);
/** `POST` - Creates a new room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.createRoom = factory.createOne(Model, key);
/** `PATCH` - Updates a room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.updateRoom = factory.updateOne(Model, key);
/** `DELETE` - Deletes a room
 *  - Only users with the role `Super Admin` or `Admin` can access this route
 */
exports.deleteRoom = factory.deleteOne(Model, key);
