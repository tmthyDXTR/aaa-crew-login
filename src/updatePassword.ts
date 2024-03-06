// Define a function to update the user's password
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

console.log(process.env.SQL_HOST);
// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.SQL_HOST || "localhost",
    user: process.env.SQL_USER_NAME || "root",
    password: process.env.SQL_USER_PASSWORD || "",
    database: process.env.SQL_DB_NAME || "aaa_users",
});

export async function updatePassword(userId: number, hashedPassword: string, response: Response) {
    return new Promise<void>((resolve, reject) => {
        // Update the user's password in the database
        connection.query(
            "UPDATE aaa_users SET userPassword = ? WHERE userId = ?",
            [hashedPassword, userId],
            function (updateError, updateResults) {
                if (updateError) {
                    console.error("Error updating password:", updateError);
                    reject(updateError);
                    return;
                }

                resolve();
            }
        );
    });
}