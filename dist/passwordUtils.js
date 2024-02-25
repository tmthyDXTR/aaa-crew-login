"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.hash(password, 10, function (error, hashedPassword) {
            if (error) {
                reject(error);
            }
            else {
                resolve(hashedPassword);
            }
        });
    });
}
exports.hashPassword = hashPassword;
function comparePassword(password, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(password, hashedPassword, function (error, result) {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
}
exports.comparePassword = comparePassword;
