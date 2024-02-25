"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePasswordResetRequest = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
// Retrieve the email password from environment variables
const { EMAIL_PASS } = process.env;
// Create a transporter object using SMTP transport
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Define the function to handle password reset request
function handlePasswordResetRequest(email) {
    return new Promise((resolve, reject) => {
        console.log("Email received handlePasswordResetRequest:", email);
        // Check if the email exists in aaa_users table
        connection.query("SELECT userId FROM aaa_users WHERE userEmail = ?", [email], function (error, results, fields) {
            if (error) {
                console.error("Error checking user email:", error);
                reject("Internal Server Error");
                return;
            }
            if (results.length === 0) {
                reject("User not found");
                return;
            }
            const userId = results[0].userId;
            // Generate a unique token
            const token = crypto_1.default.randomBytes(20).toString("hex");
            // Calculate expiration timestamp (e.g., one hour from now)
            const expirationTimestamp = new Date();
            expirationTimestamp.setHours(expirationTimestamp.getHours() + 1);
            // Save the token, user ID, email, and expiration timestamp in the password_reset_tokens table
            connection.query("INSERT INTO password_reset_tokens (userId, userEmail, token, expirationTimestamp) VALUES (?, ?, ?, ?)", [userId, email, token, expirationTimestamp], function (error, results, fields) {
                if (error) {
                    console.error("Error saving reset token:", error);
                    reject("Internal Server Error");
                    return;
                }
                // Send the password reset email with a link containing the token
                const resetLink = `https://helfer.agratamagatha.de/reset-password/${token}`;
                const mailOptions = {
                    from: "info@agratamagatha.de",
                    to: email,
                    subject: "AAA Login Password Reset Request",
                    text: `Click the following link to reset your password: ${resetLink}`,
                };
                // Send the email using Nodemailer
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error("Error sending email:", error);
                        reject("Error sending email");
                        return;
                    }
                    console.log(`Password reset email sent to: ${email}`, info.response);
                    resolve("Password reset instructions sent to your email.");
                });
            });
        });
    });
}
exports.handlePasswordResetRequest = handlePasswordResetRequest;
