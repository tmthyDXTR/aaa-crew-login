import express, { Request, Response } from "express";
import session, { SessionData } from "express-session";
import createMemoryStore from "memorystore";

// Define a custom interface for the session object
interface CustomSession extends SessionData {
    loggedin?: boolean;
    userEmail?: string;
    userName?: string;
    userId?: number;
    isAdmin?: number;
}

// Extend MemoryStore to accept CustomSession
class CustomMemoryStore extends createMemoryStore(session) {
    constructor(options?: any) {
        super(options);
    }

    // Override the set method to handle CustomSession
    set(
        sid: string,
        session: CustomSession,
        callback?: (err: any) => void
    ): void {
        super.set(sid, session, callback);
    }

    // Add any other methods you need to handle CustomSession
}

// Create a memory store with type information
const MemoryStore = new CustomMemoryStore({
    checkPeriod: 86400000, // Prune expired entries every 24 hours
});

// Create an instance of Express
const app = express();

// Configure session middleware
app.use(
    session({
        cookie: { maxAge: 86400000 },
        store: MemoryStore,
        resave: false,
        saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
        secret: "keyboard cat",
    })
);

export { app, CustomSession };