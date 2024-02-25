import express, { Request, Response } from "express";
import session, { SessionData } from "express-session";
import createMemoryStore from "memorystore";

import path from "path";
import mysql from "mysql";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import { handlePasswordResetRequest } from "./passwordReset";
import { verifyToken } from "./tokenVerification"; // Import your token verification function

dotenv.config(); // Load environment variables from .env file

const app = express();

// Define a custom interface for the session object
interface CustomSession extends SessionData {
    loggedin?: boolean;
    userEmail?: string;
    userName?: string;
    userId?: number;
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

app.use(
    session({
        cookie: { maxAge: 86400000 },
        store: MemoryStore,
        resave: false,
        saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
        secret: "keyboard cat",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/userPics", express.static("userPics"));

const connection = mysql.createConnection({
    host: process.env.SQL_HOST || "localhost",
    user: process.env.SQL_USER_NAME || "root",
    password: process.env.SQL_USER_PASSWORD || "",
    database: process.env.SQL_DB_NAME || "aaa_users",
});

app.post("/login", function (request: Request, response: Response) {
    let userEmail: string = (request.body?.email as string) ?? "";
    let password: string = (request.body?.password as string) ?? "";
    const customSession: CustomSession = request.session as CustomSession;

    if (userEmail && password) {
        connection.query(
            "SELECT * FROM aaa_users WHERE userEmail = ?",
            [userEmail],
            function (error, results, fields) {
                if (error) {
                    console.error("Error querying user:", error);
                    response.status(500).send("Internal Server Error");
                    return;
                }

                if (results.length === 0) {
                    response
                        .status(400)
                        .send("Incorrect Email and/or Password!");
                    return;
                }

                const hashedPassword = results[0].userPassword;

                bcrypt.compare(
                    password,
                    hashedPassword,
                    function (compareError, isMatch) {
                        if (compareError) {
                            console.error(
                                "Error comparing passwords:",
                                compareError
                            );
                            response.status(500).send("Internal Server Error");
                            return;
                        }

                        if (isMatch) {
                            customSession.loggedin = true;
                            customSession.userEmail = userEmail;
                            customSession.userName = results[0].userName;
                            customSession.userId = results[0].userId;
                            console.log(results.userName);
                            response.redirect("/home");
                        } else {
                            response
                                .status(400)
                                .send("Incorrect Email and/or Password!");
                        }
                    }
                );
            }
        );
    } else {
        response.status(400).send("Please enter Email and Password!");
    }
});

app.post("/register", function (request: Request, response: Response) {
    // Handle registration form submission
    const regEmail: string = (request.body?.reg_email as string) ?? "";
    const regPassword: string = (request.body?.reg_password as string) ?? "";
    const regPassword2: string = (request.body?.reg_password2 as string) ?? "";

    if (regEmail && regPassword) {
        if (regPassword != regPassword2) {
            response.status(400).send("Passwords do not match");
            return;
        }
        // Hash the password
        bcrypt.hash(regPassword, 10, function (hashError, hashedPassword) {
            if (hashError) {
                console.error("Error hashing password:", hashError);
                response.status(500).send("Error hashing password");
                return;
            }

            // Check if user already exists
            connection.query(
                "SELECT * FROM aaa_users WHERE userEmail = ?",
                [regEmail],
                function (selectError, selectResults, selectFields) {
                    if (selectError) {
                        console.error(
                            "Error checking existing user:",
                            selectError
                        );
                        response
                            .status(500)
                            .send("Error checking existing user");
                        return;
                    }

                    if (selectResults.length > 0) {
                        // User already exists
                        response.status(400).send("Email already exists");
                        return;
                    }

                    // Insert new user into the database with hashed password
                    connection.query(
                        "INSERT INTO aaa_users (userEmail, userPassword) VALUES (?, ?)",
                        [regEmail, hashedPassword],
                        function (insertError, insertResults, insertFields) {
                            if (insertError) {
                                console.error(
                                    "Error registering user:",
                                    insertError
                                );
                                response
                                    .status(500)
                                    .send("Error registering user");
                                return;
                            }
                            response.redirect("/login"); // Redirect to login page after successful registration
                        }
                    );
                }
            );
        });
    } else {
        response
            .status(400)
            .send("Please enter Email and Password for registration");
    }
});

// Define a simple login route to handle GET requests
app.get("/login", function (request: Request, response: Response) {
    response.sendFile(path.join(__dirname, "/../public/login.html"));
});

app.get("/", function (request: Request, response: Response) {
    response.sendFile(path.join(__dirname + "/../public/login.html")); // Send the login page HTML file
});

app.get("/home", function (request: Request, response: Response) {
    const customSession: CustomSession = request.session as CustomSession;

    if (customSession.loggedin) {
        response.sendFile(path.join(__dirname, "/../public/home.html")); // Send the home page HTML file containing the form
    } else {
        response.send("Please login to view this page!");
    }
});

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

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // Max file size: 3MB
    },
});

app.post(
    "/submit-personal-data",
    upload.single("profile-pic"),
    function (request, response) {
        const {
            vorname,
            nachname,
            spitzname,
            geburtstdatum,
            handynr,
            wieOftDabei,
            essen,
            ordner,
            kurier,
            aufbau,
            festival,
            schicht,
            abbau,
            veteranen,
            anmerkung,
        } = request.body;
        const customSession: CustomSession = request.session as CustomSession;

        // Get the file path of the uploaded image
        const imagePath = request.file ? request.file.path : null;
        const tshirtSize = request.body.tshirtSize || ""; // Change '' to a default value if needed
        const hoodieSize = request.body.hoodieSize || ""; // Change '' to a default value if needed

        // Perform any necessary validation or processing of the form data here

        // Example: Log the submitted data
        console.log("Submitted Data:", {
            vorname,
            nachname,
            spitzname,
            geburtstdatum,
            handynr,
            wieOftDabei,
            essen,
            ordner,
            kurier,
            aufbau,
            festival,
            schicht,
            abbau,
            veteranen,
            tshirtSize,
            hoodieSize,
            anmerkung,
        });

        // Insert the form data into the database
        let sql = `
    INSERT INTO aaa_user_data 
    (userId, vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, tshirtSize, hoodieSize, anmerkung) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    ON DUPLICATE KEY UPDATE 
    vorname = VALUES(vorname), 
    nachname = VALUES(nachname), 
    spitzname = VALUES(spitzname), 
    geburtstdatum = VALUES(geburtstdatum), 
    handynr = VALUES(handynr), 
    wieOftDabei = VALUES(wieOftDabei), 
    essen = VALUES(essen),
    ordner = VALUES(ordner),
    kurier = VALUES(kurier),
    aufbau = VALUES(aufbau),
    festival = VALUES(festival),
    schicht = VALUES(schicht),
    abbau = VALUES(abbau),
    veteranen = VALUES(veteranen),
    tshirtSize = VALUES(tshirtSize),
    hoodieSize = VALUES(hoodieSize),
    anmerkung = VALUES(anmerkung)
    `;

        // Check if an image was uploaded
        if (imagePath) {
            // If an image was uploaded, include it in the query
            sql += ", userPicLink = ?";
        }

        const values = [
            customSession.userId,
            vorname,
            nachname,
            spitzname,
            geburtstdatum,
            handynr,
            wieOftDabei,
            essen,
            ordner,
            kurier,
            aufbau,
            festival,
            schicht,
            abbau,
            veteranen,
            tshirtSize,
            hoodieSize,
            anmerkung,
        ];
        // If an image was uploaded, append its path to the values array
        if (imagePath) {
            values.push(imagePath);
        }
        connection.query(sql, values, function (error, results, fields) {
            if (error) {
                console.error("Error inserting data into database:", error);
                response.status(500).send("Error submitting data");
                return;
            }

            console.log("Data inserted successfully");
            response.redirect("/schichtwuensche");
        });
    }
);

app.get("/schichtwuensche", function (request, response) {
    // Render the shift preferences form page here
    response.sendFile(path.join(__dirname, "/../public/schichtwuensche.html"));
});

// Handle form submission
app.post("/submit-shift-preferences", function (request, response) {
    const {
        viererSchicht,
        eingangshäuschen,
        greencamping,
        nachtwache,
        küche,
        künstlerbetreuung,
        personalbüro,
        kassenbüro,
        parkplatz,
        flaschensammeln,
        ausschank,
    } = request.body;
    const customSession: CustomSession = request.session as CustomSession;

    // Construct the SQL query
    let sql = `
        INSERT INTO aaa_user_data 
        (userId, schicht_viererSchicht, schicht_eingangshäuschen, schicht_greencamping, schicht_nachtwache, schicht_küche, schicht_künstlerbetreuung, schicht_personalbüro, schicht_kassenbüro, schicht_parkplatz, schicht_flaschensammeln, schicht_ausschank) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE 
        schicht_viererSchicht = VALUES(schicht_viererSchicht), 
        schicht_eingangshäuschen = VALUES(schicht_eingangshäuschen), 
        schicht_greencamping = VALUES(schicht_greencamping), 
        schicht_nachtwache = VALUES(schicht_nachtwache), 
        schicht_küche = VALUES(schicht_küche), 
        schicht_künstlerbetreuung = VALUES(schicht_künstlerbetreuung), 
        schicht_personalbüro = VALUES(schicht_personalbüro), 
        schicht_kassenbüro = VALUES(schicht_kassenbüro), 
        schicht_parkplatz = VALUES(schicht_parkplatz), 
        schicht_flaschensammeln = VALUES(schicht_flaschensammeln), 
        schicht_ausschank = VALUES(schicht_ausschank)        
    `;

    // Values to be inserted into the query
    const values = [
        customSession.userId,
        viererSchicht,
        eingangshäuschen,
        greencamping,
        nachtwache,
        küche,
        künstlerbetreuung,
        personalbüro,
        kassenbüro,
        parkplatz,
        flaschensammeln,
        ausschank,
    ];

    // Execute the SQL query
    connection.query(sql, values, (error, results, fields) => {
        if (error) {
            console.error("Error updating shift preferences:", error);
            response.status(500).send("Error updating shift preferences");
            return;
        }

        console.log("Shift preferences updated successfully");
        // Redirect to a success page or send a response indicating success
        response.redirect("/home");
    });
});

// Add a new backend route to fetch shift preferences
app.get("/fetch-shift-preferences", function (request, response) {
    const customSession: CustomSession = request.session as CustomSession;

    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }

    connection.query(
        "SELECT * FROM aaa_user_data WHERE userId = ?",
        [customSession.userId],
        function (error, userDataResults, fields) {
            if (error) {
                console.error("Error retrieving user data:", error);
                response.status(500).send("Error retrieving user data");
                return;
            }

            if (userDataResults.length === 0) {
                response.status(404).send("User data not found");
                return;
            }

            // Send the shift preferences data as JSON response
            console.log("Fetched Data:", userDataResults[0]);

            response.json(userDataResults[0]);
        }
    );
});

app.get("/fetch-user-data", function (request: Request, response: Response) {
    const customSession: CustomSession = request.session as CustomSession;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }

    connection.query(
        "SELECT * FROM aaa_user_data WHERE userId = ?",
        [customSession.userId],
        function (error, userDataResults, fields) {
            if (error) {
                console.error("Error retrieving user data:", error);
                response.status(500).send("Error retrieving user data");
                return;
            }

            if (userDataResults.length === 0) {
                response.status(404).send("User data not found");
                return;
            }
            console.log("Fetched Data:", userDataResults);
            let geburtstdatum = new Date(userDataResults[0].geburtstdatum);
            geburtstdatum.setDate(geburtstdatum.getDate() + 1);
            // Format the date string
            const formattedUserData = {
                ...userDataResults[0], // Shallow copy of the user data object
                geburtstdatum: geburtstdatum.toISOString().split("T")[0], // Extract YYYY-MM-DD part
            };
            console.log("Fetched Data:", { formattedUserData });
            response.json(formattedUserData);
        }
    );
});

// Route to handle password reset request
app.post(
    "/reset-password-request",
    async function (request: Request, response: Response) {
        const { email } = request.body;

        try {
            // Initiate password reset process
            const message = await handlePasswordResetRequest(email);
            response.status(200).send(message);
        } catch (error) {
            console.error("Error initiating password reset:", error);
            response.status(500).send("Error initiating password reset");
        }
    }
);

// Define route to handle password reset page
app.get(
    "/reset-password/:token",
    async function (request: Request, response: Response) {
        const { token } = request.params;

        // Verify the token from the URL parameters against the token stored in the database
        try {
            const isValidToken = await verifyToken(token);

            if (isValidToken) {
                // Render the password reset form
                response.sendFile(
                    path.join(__dirname, "/../public/resetPassword.html")
                ); // Send the home page HTML file containing the form
            } else {
                // Show error message or redirect to error page
                response.status(400).send("Invalid or expired token");
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            response.status(500).send("Internal Server Error");
        }
    }
);

// Define route to handle password reset form submission
app.post(
    "/reset-password/:token",
    async function (request: Request, response: Response) {
        const { token } = request.params;
        
        try {
            // Verify the token from the URL parameters against the token stored in the database
            const { isValid, userId, email } = await verifyToken(token);

            if (isValid) {
                // Retrieve form data
                const resetPassword: string = request.body.reset_password;
                const resetPassword2: string = request.body.reset_password2;

                // Check if passwords match
                if (resetPassword !== resetPassword2) {
                    response.status(400).send("Passwords do not match");
                    return;
                }

                try {
                    // Hash the new password
                    const hashedPassword = await hashPassword(resetPassword);

                    // Update the user's password in the database
                    connection.query(
                        "UPDATE aaa_users SET userPassword = ? WHERE userId = ?",
                        [hashedPassword, userId],
                        function (updateError, updateResults) {
                            if (updateError) {
                                console.error(
                                    "Error updating password:",
                                    updateError
                                );
                                response
                                    .status(500)
                                    .send("Error updating password");
                                return;
                            }

                            response.redirect("/login"); // Redirect to login page after successful password reset
                        }
                    );
                } catch (error) {
                    console.error("Error hashing password:", error);
                    response.status(500).send("Error hashing password");
                }
            } else {
                // Show error message or redirect to error page
                response.status(400).send("Invalid or expired token");
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            response.status(500).send("Internal Server Error");
        }
    }
);

app.listen(3000, () => {
    console.log("Server is running on port 3000");

    try {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("Server Timezone:", timezone);
    } catch (error) {
        console.error("Error retrieving timezone:", error);
    }
});

function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (error, hashedPassword) {
            if (error) {
                reject(error);
            } else {
                resolve(hashedPassword);
            }
        });
    });
}
