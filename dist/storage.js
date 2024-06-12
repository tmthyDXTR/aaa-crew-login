"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: "userPics/", // Destination folder for uploaded images
    filename: function (req, file, cb) {
        const customSession = req.session; // Assuming CustomSession is your session type
        const userId = customSession.userId; // Assuming userId is stored in the session
        const { vorname, nachname } = req.body; // Assuming vorname and nachname are sent in the form body
        // Replace spaces in names with underscores and concatenate with userId
        const formattedName = `${userId}_${nachname}_${vorname}`.replace(/\s+/g, "_");
        const originalFileName = file.originalname;
        const extension = originalFileName.split(".").pop();
        const customFileName = `${formattedName}.${extension}`; // Custom filename: userId_vorname_nachname.extension
        cb(null, customFileName);
    },
});
exports.uploadHandler = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 6 * 1024 * 1024, // Max file size: 3MB
    },
});
