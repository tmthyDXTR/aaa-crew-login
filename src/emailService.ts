import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Extract email credentials from environment variables
const { EMAIL_PERSONAL_USER, EMAIL_PERSONAL_PASS } = process.env;

if (!EMAIL_PERSONAL_USER || !EMAIL_PERSONAL_PASS) {
    throw new Error("Email credentials are not set in the environment variables");
}

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_PERSONAL_USER,
        pass: process.env.EMAIL_PERSONAL_PASS,
    },
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
}

export async function sendMail({ to, subject, text }: MailOptions): Promise<void> {
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
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}