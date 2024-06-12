import multer from "multer";
import { CustomSession } from "./session";


const storage = multer.diskStorage({
    destination: "userPics/", // Destination folder for uploaded images
    filename: function (req, file, cb) {
        const customSession = req.session as CustomSession; // Assuming CustomSession is your session type
        const userId = customSession.userId; // Assuming userId is stored in the session
        const { vorname, nachname } = req.body; // Assuming vorname and nachname are sent in the form body

        // Replace spaces in names with underscores and concatenate with userId
        const formattedName = `${userId}_${nachname}_${vorname}`.replace(
            /\s+/g,
            "_"
        );

        const originalFileName = file.originalname;
        const extension = originalFileName.split(".").pop();
        const customFileName = `${formattedName}.${extension}`; // Custom filename: userId_vorname_nachname.extension
        cb(null, customFileName);
    },
});

export const uploadHandler = multer({
    storage: storage,
    limits: {
        fileSize: 6 * 1024 * 1024, // Max file size: 3MB
    },
});