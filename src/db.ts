import * as dotenv from 'dotenv';
import mysql from 'mysql';

// Load environment variables from .env file
dotenv.config();

// Function to create database connection
export function createDBConnection(): mysql.Connection {
    // Create connection using environment variables or default values
    const connection = mysql.createConnection({
        host: process.env.SQL_HOST || "localhost",
        user: process.env.SQL_USER_NAME || "root",
        password: process.env.SQL_USER_PASSWORD || "",
        database: process.env.SQL_DB_NAME || "aaa_users",
    });

    return connection;
}