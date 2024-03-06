"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = void 0;
// Define a function to update the user's password
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
console.log(process.env.SQL_HOST);
// Create a MySQL connection
const connection = mysql_1.default.createConnection({
    host: process.env.SQL_HOST || "localhost",
    user: process.env.SQL_USER_NAME || "root",
    password: process.env.SQL_USER_PASSWORD || "",
    database: process.env.SQL_DB_NAME || "aaa_users",
});
function updatePassword(userId, hashedPassword, response) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Update the user's password in the database
            connection.query("UPDATE aaa_users SET userPassword = ? WHERE userId = ?", [hashedPassword, userId], function (updateError, updateResults) {
                if (updateError) {
                    console.error("Error updating password:", updateError);
                    reject(updateError);
                    return;
                }
                resolve();
            });
        });
    });
}
exports.updatePassword = updatePassword;
