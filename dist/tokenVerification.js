"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const db_1 = require("./db");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
// Define the function to verify the token
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        // Query the database to check if the token exists and is still valid
        connection.query("SELECT userId, userEmail FROM password_reset_tokens WHERE token = ? AND expirationTimestamp > NOW()", [token], function (error, results, fields) {
            if (error) {
                console.error("Error verifying token:", error);
                reject("Error verifying token"); // Reject with error message
                return;
            }
            // If a token is found and is still valid, resolve with true and user information
            if (results.length > 0) {
                const userId = results[0].userId;
                const userEmail = results[0].userEmail;
                resolve({ isValid: true, userId, email: userEmail });
            }
            else {
                // If no matching token is found or the token is expired, resolve with false
                resolve({ isValid: false });
            }
        });
    });
}
exports.verifyToken = verifyToken;
