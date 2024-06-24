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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Extract email credentials from environment variables
const { EMAIL_PERSONAL_USER, EMAIL_PERSONAL_PASS } = process.env;
if (!EMAIL_PERSONAL_USER || !EMAIL_PERSONAL_PASS) {
    throw new Error("Email credentials are not set in the environment variables");
}
// Create a transporter object using SMTP transport
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_PERSONAL_USER,
        pass: process.env.EMAIL_PERSONAL_PASS,
    },
});
function sendMail({ to, subject, text }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Convert the 'to' string into an array of email addresses
            const bccList = to.split(/[\s,]+/).filter(email => email.length > 0);
            // Setup email data with unicode symbols
            const mailOptions = {
                from: EMAIL_PERSONAL_USER,
                to: EMAIL_PERSONAL_USER, // Send to the sender itself
                bcc: bccList, // Blind copy to the actual recipient
                subject,
                text,
            };
            // Send mail with defined transport object
            const info = yield transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        }
        catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    });
}
exports.sendMail = sendMail;
