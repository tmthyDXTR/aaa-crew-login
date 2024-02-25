"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
// Extend MemoryStore to accept CustomSession
class CustomMemoryStore extends (0, memorystore_1.default)(express_session_1.default) {
    constructor(options) {
        super(options);
    }
    // Override the set method to handle CustomSession
    set(sid, session, callback) {
        super.set(sid, session, callback);
    }
}
// Create a memory store with type information
const MemoryStore = new CustomMemoryStore({
    checkPeriod: 86400000, // Prune expired entries every 24 hours
});
// Create an instance of Express
const app = (0, express_1.default)();
exports.app = app;
// Configure session middleware
app.use((0, express_session_1.default)({
    cookie: { maxAge: 86400000 },
    store: MemoryStore,
    resave: false,
    saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
    secret: "keyboard cat",
}));
