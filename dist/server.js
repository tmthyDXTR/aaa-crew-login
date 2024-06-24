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
const session_1 = require("./session");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const passwordReset_1 = require("./passwordReset");
const tokenVerification_1 = require("./tokenVerification");
const db_1 = require("./db");
const passwordUtils_1 = require("./passwordUtils");
const storage_1 = require("./storage");
const submitPersonalData_1 = require("./submitPersonalData");
const submitShiftPreferences_1 = require("./submitShiftPreferences");
const emailService_1 = require("./emailService");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
session_1.app.use(express_1.default.json());
session_1.app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
session_1.app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
session_1.app.use("/userPics", express_1.default.static("userPics"));
session_1.app.post("/login", function (request, response) {
    var _a, _b, _c, _d;
    let userEmail = (_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : "";
    let password = (_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : "";
    const customSession = request.session;
    if (userEmail && password) {
        connection.query("SELECT * FROM aaa_users WHERE userEmail = ?", [userEmail], function (error, results, fields) {
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
            (0, passwordUtils_1.comparePassword)(password, hashedPassword)
                .then((isMatch) => {
                if (isMatch) {
                    customSession.loggedin = true;
                    customSession.userEmail = userEmail;
                    customSession.userName = results[0].userName;
                    customSession.userId = results[0].userId;
                    customSession.isAdmin = results[0].isAdmin;
                    console.log(results.userName);
                    response.redirect("/home");
                }
                else {
                    response
                        .status(400)
                        .send("Incorrect Email and/or Password!");
                }
            })
                .catch((compareError) => {
                console.error("Error comparing passwords:", compareError);
                response.status(500).send("Internal Server Error");
            });
        });
    }
    else {
        response.status(400).send("Please enter Email and Password!");
    }
});
session_1.app.post("/register", function (request, response) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // Handle registration form submission
        const regEmail = (_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.reg_email) !== null && _b !== void 0 ? _b : "";
        const regPassword = (_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.reg_password) !== null && _d !== void 0 ? _d : "";
        const regPassword2 = (_f = (_e = request.body) === null || _e === void 0 ? void 0 : _e.reg_password2) !== null && _f !== void 0 ? _f : "";
        if (regEmail && regPassword) {
            if (regPassword != regPassword2) {
                response.status(400).send("Passwords do not match");
                return;
            }
            try {
                // Hash the password
                const hashedPassword = yield (0, passwordUtils_1.hashPassword)(regPassword);
                // Check if user already exists
                connection.query("SELECT * FROM aaa_users WHERE userEmail = ?", [regEmail], function (selectError, selectResults, selectFields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (selectError) {
                            console.error("Error checking existing user:", selectError);
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
                        connection.query("INSERT INTO aaa_users (userEmail, userPassword) VALUES (?, ?)", [regEmail, hashedPassword], function (insertError, insertResults, insertFields) {
                            if (insertError) {
                                console.error("Error registering user:", insertError);
                                response
                                    .status(500)
                                    .send("Error registering user");
                                return;
                            }
                            response.redirect("/login"); // Redirect to login page after successful registration
                        });
                    });
                });
            }
            catch (error) {
                console.error("Error hashing password:", error);
                response.status(500).send("Error hashing password");
            }
        }
        else {
            response
                .status(400)
                .send("Please enter Email and Password for registration");
        }
    });
});
// Define a simple login route to handle GET requests
session_1.app.get("/login", function (request, response) {
    response.sendFile(path_1.default.join(__dirname, "/../public/login.html"));
});
session_1.app.get("/", function (request, response) {
    response.sendFile(path_1.default.join(__dirname + "/../public/login.html")); // Send the login page HTML file
});
session_1.app.get("/send-mail-tool", function (request, response) {
    const customSession = request.session;
    if (customSession.loggedin && customSession.isAdmin) {
        response.sendFile(path_1.default.join(__dirname, "/../public/sendMailTool.html")); // Send the home page HTML file containing the form
    }
    else {
        response.send("Please login as admin to view this page!");
    }
});
session_1.app.post("/send-email", function (request, response) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        // Your send mail logic here
        try {
            const emailAddresses = (_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.email_addresses) !== null && _b !== void 0 ? _b : "";
            const emailSubject = (_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.email_subject) !== null && _d !== void 0 ? _d : "";
            const emailContent = (_f = (_e = request.body) === null || _e === void 0 ? void 0 : _e.email_content) !== null && _f !== void 0 ? _f : "";
            yield (0, emailService_1.sendMail)({ to: emailAddresses, subject: emailSubject, text: emailContent });
            response.send('Email sent successfully');
        }
        catch (error) {
            response.status(500).send('Error sending email');
        }
    });
});
session_1.app.get("/fetch-all-user-data", function (request, response) {
    const customSession = request.session;
    if (customSession.loggedin && customSession.isAdmin) {
        connection.query("SELECT * FROM aaa_user_data", function (error, results, fields) {
            if (error) {
                console.error("Error retrieving all user Data:", error);
                response.status(500).send("Error retrieving all user Data");
                return;
            }
            if (results.length === 0) {
                response.status(404).send("all user Data not found");
                return;
            }
            // Send the all user Data as JSON response
            console.log("Fetched all user Data:", results);
            response.json(results);
        });
    }
    else {
        response.send("Please login as admin to view this page!");
    }
});
session_1.app.get("/home", function (request, response) {
    const customSession = request.session;
    if (customSession.loggedin) {
        response.sendFile(path_1.default.join(__dirname, "/../public/home.html")); // Send the home page HTML file containing the form
    }
    else {
        response.send("Please login to view this page!");
    }
});
session_1.app.post("/submit-personal-data", storage_1.uploadHandler.single("profile-pic"), submitPersonalData_1.submitPersonalData);
session_1.app.get("/schichtwuensche", function (request, response) {
    // Render the shift preferences form page here
    response.sendFile(path_1.default.join(__dirname, "/../public/schichtwuensche.html"));
});
session_1.app.get("/aufbauwoche", function (request, response) {
    // Render the shift preferences form page here
    response.sendFile(path_1.default.join(__dirname, "/../public/aufbauwoche.html"));
});
// Add a new backend route to fetch shift preferences
session_1.app.get("/fetch-aufbau-groups", function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }
    connection.query("SELECT * FROM aaa_aufbau_24", [customSession.userId], function (error, aufbauDataResults, fields) {
        if (error) {
            console.error("Error retrieving aufbau groups:", error);
            response.status(500).send("Error retrieving aufbau groups");
            return;
        }
        if (aufbauDataResults.length === 0) {
            response.status(404).send("aufbau groups not found");
            return;
        }
        // Send the shift preferences data as JSON response
        console.log("Fetched Data:", aufbauDataResults);
        response.json(aufbauDataResults);
    });
});
// Add a new backend route to fetch aufbau selection data
session_1.app.get("/fetch-aufbau-selection-data", function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }
    connection.query("SELECT userId, aufbau_ids FROM aaa_user_data", function (error, aufbauSelectionResults, fields) {
        if (error) {
            console.error("Error retrieving aufbau groups:", error);
            response.status(500).send("Error retrieving aufbau selection data");
            return;
        }
        if (aufbauSelectionResults.length === 0) {
            response.status(404).send("aufbau selection data not found");
            return;
        }
        // Send the shift preferences data as JSON response
        console.log("Fetched Data:", aufbauSelectionResults);
        response.json([aufbauSelectionResults, customSession.userId]);
    });
});
session_1.app.post("/submit-aufbau-selection", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { aufbauIds } = request.body;
        const customSession = request.session;
        try {
            // Update aufbau selection of current user
            connection.query("UPDATE aaa_user_data SET aufbau_ids = ? WHERE userId = ?", [aufbauIds, customSession.userId], function (updateError, updateResults) {
                if (updateError) {
                    console.error("Error updating aufbau selection:", updateError);
                    response
                        .status(500)
                        .send("Error updating aufbau selection");
                    return;
                }
                response.redirect("/home"); // Redirect to login page after successful password reset
            });
        }
        catch (error) {
            console.error("Error updating aufbau selection:", error);
            response.status(500).send("Error updating aufbau selection");
        }
    });
});
session_1.app.post("/submit-shift-preferences", submitShiftPreferences_1.submitShiftPreferences);
// Add a new backend route to fetch shift preferences
session_1.app.get("/fetch-shift-preferences", function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }
    // Fetch shift preferences for the logged-in user
    connection.query("SELECT * FROM aaa_user_data WHERE userId = ?", [customSession.userId], function (error, userDataResults) {
        if (error) {
            console.error("Error retrieving user data:", error);
            response.status(500).send("Error retrieving user data");
            return;
        }
        if (userDataResults.length === 0) {
            response.status(404).send("User data not found");
            return;
        }
        const userShiftPreferences = userDataResults[0];
        // Fetch userIds, vorname, and nachname for all users
        connection.query("SELECT userId, vorname, nachname, klarname FROM aaa_user_data ORDER BY userId ASC", function (error, allUsersResults) {
            if (error) {
                console.error("Error retrieving all users data:", error);
                response.status(500).send("Error retrieving all users data");
                return;
            }
            const usersInfo = allUsersResults.map((user) => {
                if (user.klarname === 1) {
                    return {
                        userId: user.userId,
                        vorname: user.vorname,
                        nachname: user.nachname
                    };
                }
                else {
                    return {
                        userId: user.userId,
                        vorname: "",
                        nachname: "",
                    };
                }
            });
            // Combine the results and send as JSON response
            response.json({
                userShiftPreferences: userShiftPreferences,
                allUsersInfo: usersInfo
            });
        });
    });
});
session_1.app.get("/fetch-user-data", function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send("User not logged in");
        return;
    }
    connection.query(`   SELECT u.*, ud.isAdmin
            FROM aaa_user_data AS u
            JOIN aaa_users AS ud ON u.userId = ud.userId
            WHERE u.userId = ?`, [customSession.userId], function (error, userDataResults, fields) {
        if (error) {
            console.error("Error retrieving user data:", error);
            response.status(500).send("Error retrieving user data");
            return;
        }
        if (userDataResults.length === 0) {
            // No user data found, insert an empty entry
            const emptyEntry = {
                userId: customSession.userId,
                // Add other fields with default or empty values as necessary
                // e.g., name: '', email: '', etc.
            };
            connection.query("INSERT INTO aaa_user_data SET ?", emptyEntry, function (insertError, insertResults, insertFields) {
                if (insertError) {
                    console.error("Error inserting empty user data:", insertError);
                    response.status(500).send("Error inserting empty user data");
                    return;
                }
                // Successfully inserted empty entry, fetch the newly inserted data
                connection.query(`   SELECT u.*, ud.isAdmin
                            FROM aaa_user_data AS u
                            JOIN aaa_users AS ud ON u.userId = ud.userId
                            WHERE u.userId = ?`, [customSession.userId], function (fetchError, newUserDataResults, fetchFields) {
                    if (fetchError) {
                        console.error("Error retrieving newly inserted user data:", fetchError);
                        response.status(500).send("Error retrieving newly inserted user data");
                        return;
                    }
                    let geburtstdatum = new Date(newUserDataResults[0].geburtstdatum);
                    geburtstdatum.setDate(geburtstdatum.getDate() + 1);
                    const formattedUserData = Object.assign(Object.assign({}, newUserDataResults[0]), { geburtstdatum: geburtstdatum.toISOString().split("T")[0] });
                    console.log("Fetched Data:", { formattedUserData });
                    response.json(formattedUserData);
                });
            });
        }
        else {
            let geburtstdatum = new Date(userDataResults[0].geburtstdatum);
            geburtstdatum.setDate(geburtstdatum.getDate() + 1);
            const formattedUserData = Object.assign(Object.assign({}, userDataResults[0]), { geburtstdatum: geburtstdatum.toISOString().split("T")[0] });
            console.log("Fetched Data:", { formattedUserData });
            response.json(formattedUserData);
        }
    });
});
// Route to handle password reset request
session_1.app.post("/reset-password-request", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = request.body;
        try {
            // Initiate password reset process
            const message = yield (0, passwordReset_1.handlePasswordResetRequest)(email);
            response.status(200).send(message);
        }
        catch (error) {
            console.error("Error initiating password reset:", error);
            response.status(500).send("Error initiating password reset");
        }
    });
});
// Define route to handle password reset page
session_1.app.get("/reset-password/:token", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = request.params;
        // Verify the token from the URL parameters against the token stored in the database
        try {
            const isValidToken = yield (0, tokenVerification_1.verifyToken)(token);
            if (isValidToken) {
                // Render the password reset form
                response.sendFile(path_1.default.join(__dirname, "/../public/resetPassword.html")); // Send the home page HTML file containing the form
            }
            else {
                // Show error message or redirect to error page
                response.status(400).send("Invalid or expired token");
            }
        }
        catch (error) {
            console.error("Error verifying token:", error);
            response.status(500).send("Internal Server Error");
        }
    });
});
// Define route to handle password reset form submission
session_1.app.post("/reset-password/:token", function (request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token } = request.params;
        try {
            // Verify the token from the URL parameters against the token stored in the database
            const { isValid, userId, email } = yield (0, tokenVerification_1.verifyToken)(token);
            if (isValid) {
                // Retrieve form data
                const resetPassword = request.body.reset_password;
                const resetPassword2 = request.body.reset_password2;
                // Check if passwords match
                if (resetPassword !== resetPassword2) {
                    response.status(400).send("Passwords do not match");
                    return;
                }
                try {
                    // Hash the new password
                    const hashedPassword = yield (0, passwordUtils_1.hashPassword)(resetPassword);
                    // Update the user's password in the database
                    connection.query("UPDATE aaa_users SET userPassword = ? WHERE userId = ?", [hashedPassword, userId], function (updateError, updateResults) {
                        if (updateError) {
                            console.error("Error updating password:", updateError);
                            response
                                .status(500)
                                .send("Error updating password");
                            return;
                        }
                        response.redirect("/login"); // Redirect to login page after successful password reset
                    });
                }
                catch (error) {
                    console.error("Error hashing password:", error);
                    response.status(500).send("Error hashing password");
                }
            }
            else {
                // Show error message or redirect to error page
                response.status(400).send("Invalid or expired token");
            }
        }
        catch (error) {
            console.error("Error verifying token:", error);
            response.status(500).send("Internal Server Error");
        }
    });
});
session_1.app.listen(3000, () => {
    console.log("Server is running on port 3000");
    try {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log("Server Timezone:", timezone);
    }
    catch (error) {
        console.error("Error retrieving timezone:", error);
    }
});
// Define route to fetch Gantt data
session_1.app.get("/fetch-gantt-data", (request, response) => {
    console.log("fetch shift data");
    // Your MySQL query
    const query = `SELECT * FROM test_schichten WHERE schicht_tag = "FR"
    ORDER BY 
        CASE schicht_tag 
            WHEN 'FR' THEN 1
            WHEN 'SA' THEN 2
            WHEN 'SO' THEN 3
            ELSE 4
        END,
        schicht_ort ASC,
        start_time ASC,
        schicht_id ASC
    LIMIT 50;`;
    // Execute the query
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // CRAZYYY TIME
        // // Adjust each slot's start_time and end_time by adding 2 hours
        // results.forEach((row: { start_time: Date; end_time: Date; }) => {
        //     row.start_time = new Date(row.start_time.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours in milliseconds
        //     row.end_time = new Date(row.end_time.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours in milliseconds
        // });
        console.log(results);
        // Send JSON response with query results
        response.json(results);
    });
});
// Store previous state of the data
let history = [];
// Route to handle schedule updates
session_1.app.post('/updateSchedule', (request, response) => {
    // Extract updated schedule data from the request body
    const updatedData = request.body;
    // Extract the id and updated start and end times from updatedData
    const { start, end } = updatedData;
    const id = updatedData.data.id;
    // Retrieve the current start_time and end_time from the database
    const query = `SELECT start_time, end_time FROM test_schichten WHERE id = ?;`;
    const values = [id];
    // Execute the select query to get the current start_time and end_time
    connection.query(query, values, (err, results) => {
        if (err) {
            console.error("Error executing SQL SELECT query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // Store previous state
        history.push({ id: id, start_time: results[0].start_time, end_time: results[0].end_time });
        console.log(results[0]);
        // Extract the current start_time and end_time from the results
        const currentStartTime = results[0].start_time;
        const currentEndTime = results[0].end_time;
        // Extract the time part (hours and minutes) from the updated start and end times
        const updatedStartTimeParts = start.split(':');
        const updatedEndTimeParts = end.split(':');
        // Construct the new start_time and end_time by combining the date part with the updated hours
        const updatedStartTime = new Date(currentStartTime);
        updatedStartTime.setHours(parseInt(updatedStartTimeParts[0]), parseInt(updatedStartTimeParts[1]), 0);
        const updatedEndTime = new Date(currentEndTime);
        updatedEndTime.setHours(parseInt(updatedEndTimeParts[0]), parseInt(updatedEndTimeParts[1]), 0);
        // Execute SQL UPDATE statement to update the start_time and end_time
        const updateQuery = `UPDATE test_schichten SET start_time = ?, end_time = ? WHERE id = ?;`;
        const updateValues = [updatedStartTime, updatedEndTime, id];
        // Execute the update query
        connection.query(updateQuery, updateValues, (err, results) => {
            if (err) {
                console.error("Error executing SQL UPDATE query: " + err.stack);
                response.status(500).json({ error: "Internal server error" });
                return;
            }
            // Send success response
            response.json({ success: true, message: 'Start and end times updated successfully' });
        });
    });
});
// Route to handle undo action
session_1.app.post('/undo', (request, response) => {
    // Check if there is a previous state in history
    if (history.length > 0) {
        // Retrieve the previous state from history
        const prevState = history.pop();
        // Restore the previous state in the database
        const query = `UPDATE test_schichten SET start_time = ?, end_time = ? WHERE id = ?;`;
        const values = [prevState === null || prevState === void 0 ? void 0 : prevState.start_time, prevState === null || prevState === void 0 ? void 0 : prevState.end_time, prevState === null || prevState === void 0 ? void 0 : prevState.id];
        // Execute the update query
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error("Error executing SQL UPDATE query: " + err.stack);
                response.status(500).json({ error: "Internal server error" });
                return;
            }
            // Send success response
            response.json({ success: true, message: 'Undo action completed successfully' });
        });
    }
    else {
        response.status(400).json({ error: "No previous state available for undo" });
    }
});
// Route to handle fetching history
session_1.app.get('/history', (request, response) => {
    // Fetch history data from wherever it's stored
    // For example, you can fetch it from the history array
    response.json(history);
});
// Route to handle fetching users with a specified column and value
session_1.app.get('/users-with-shift-preference', (request, response) => {
    const { column, value } = request.query;
    // Mapping of shift codes to column names
    const shiftColumnMapping = {
        'AO': 'schicht_ausschank',
        'AU': 'schicht_ausschank',
        'AW': 'schicht_awareness',
        'BSH': 'schicht_künstlerbetreuung',
        'BSZ': 'schicht_künstlerbetreuung',
        'EP': 'schicht_parkplatz',
        'ES': 'schicht_parkplatz',
        'FMS': 'schicht_flaschensammeln',
        'HEI': 'schicht_eingangshäuschen',
        // Add more mappings as needed
    };
    // Check if column is valid
    const mappedColumn = shiftColumnMapping[column];
    if (!mappedColumn) {
        response.status(400).json({ error: 'Invalid column name' });
        return;
    }
    // Construct the SQL query dynamically
    const query = `
        SELECT 
            u.*,
            COALESCE(s.schichten_count, 0) AS schichten_count
        FROM 
            aaa_user_data u
        LEFT JOIN (
            SELECT 
                user_id,
                COUNT(*) AS schichten_count
            FROM 
                test_schichten_slots
            GROUP BY 
                user_id
        ) s ON u.userId = s.user_id
        WHERE 
            ${mappedColumn} = ?;
    `;
    connection.query(query, [value], (error, results) => {
        if (error) {
            console.error('Error fetching users with specified column and value:', error);
            response.status(500).json({ error: 'Internal server error' });
        }
        else {
            response.json(results);
        }
    });
});
// Route to handle add shift action
session_1.app.post('/addShift', (request, response) => {
    const { startTime, endTime, title, day } = request.body;
    // Add shift slot to the SQL table
    const sql = `INSERT INTO test_schichten (schicht_ort, schicht_tag, start_time, end_time) VALUES (?, ?, ?, ?)`;
    const values = [
        title,
        day,
        "2024-07-26 " + startTime + ":00",
        "2024-07-26 " + endTime + ":00"
    ];
    // Execute the update query
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error executing SQL INSERT query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // Retrieve the ID of the added shift
        const shiftId = results.insertId;
        // Send success response with the ID of the added shift
        response.json({ success: true, message: 'Add shift action completed successfully', shiftId });
    });
});
// Route to handle delete shift action
session_1.app.post('/deleteShift', (request, response) => {
    const { id } = request.query;
    // Delete shift slot from the SQL table
    const sql = `DELETE FROM test_schichten WHERE id=${id}`;
    // Execute the update query
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing SQL DELETE query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // Send success response with the ID of the added shift
        response.json({ success: true, message: 'Delete shift action completed successfully', id });
    });
});
session_1.app.post("/add-user-to-shift", addUserToShift);
session_1.app.post("/remove-user-from-shift", removeUserFromShift);
function addUserToShift(request, response) {
    const { shiftId } = request.query;
    const { userId } = request.query;
    // Add user to shift slot to the SQL table
    const sql = `INSERT INTO test_schichten_slots (test_schichten_id, user_id) VALUES (?, ?)`;
    const values = [
        shiftId,
        userId
    ];
    // Execute the INSERT query
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.error("Error executing SQL INSERT query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // Send success response with the ID of the added shift
        response.json({ success: true, message: 'Add user to shift slot completed successfully', shiftId, userId });
    });
}
function removeUserFromShift(request, response) {
    const { shiftId } = request.query;
    const { userId } = request.query;
    // Delete user from shift slot from the SQL table
    const sql = `DELETE FROM test_schichten_slots WHERE test_schichten_id=${shiftId}`;
    // Execute the update query
    connection.query(sql, (err, results) => {
        if (err) {
            console.error("Error executing SQL DELETE query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        // Send success response with the ID of the added shift
        response.json({ success: true, message: 'Delete user from shift slot action completed successfully', shiftId, userId });
    });
}
// Define route to fetch Gantt data
session_1.app.get("/fetch-shift-data-by-id", (request, response) => {
    const { shiftId } = request.query;
    console.log("fetch-shift-data-by-id");
    // Your MySQL query
    const query = `
        SELECT 
            tss.*, 
            aud.*, 
            (SELECT COUNT(*) 
             FROM test_schichten_slots tss_inner 
             WHERE tss_inner.user_id = tss.user_id) AS schichten_anzahl
        FROM 
            test_schichten_slots tss
        JOIN 
            aaa_user_data aud 
        ON 
            tss.user_id = aud.userId
        WHERE 
            tss.test_schichten_id = ${shiftId}`;
    // Execute the query
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        console.log(results);
        // Send JSON response with query results
        response.json(results);
    });
});
// Define route to fetch Gantt data
session_1.app.get("/fetch-all-filled-slots", (request, response) => {
    console.log("fetch-all-filled-slots");
    // Your MySQL query
    const query = `SELECT * FROM test_schichten_slots`;
    // Execute the query
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        console.log(results);
        // Send JSON response with query results
        response.json(results);
    });
});
session_1.app.get("/crews-overview", function (request, response) {
    const customSession = request.session;
    if (customSession.loggedin) {
        response.sendFile(path_1.default.join(__dirname, "/../public/crews-overview.html")); // Send the home page HTML file containing the form
    }
    else {
        response.send("Please login to view this page!");
    }
});
// Define route to fetch aufbau crews
session_1.app.get("/fetch-aufbau-crews-data", (request, response) => {
    const customSession = request.session;
    if (!customSession.loggedin) {
        response.status(400).json({ error: "Login to view crews" });
        return;
    }
    console.log("fetch-aufbau-crews");
    const userId = customSession.userId; // Get the logged in user's ID
    const query = `
        SELECT aud.*, aa.aufbau_id, aa.aufbau_name, aa.aufbau_wann, aa.aufbau_wieviel, aa.aufbau_verantwortlich_user_id, aa.aufbau_verantwortlich, aa.aufbau_verantwortlich_kontakt, aa.date
        FROM aaa_user_data aud
        JOIN aaa_aufbau_24 aa
        ON CONCAT(',', aud.aufbau_ids, ',') LIKE CONCAT('%,', aa.aufbau_id, ',%')
        WHERE aa.aufbau_verantwortlich_user_id = ?;
    `;
    // Execute the query
    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error executing MySQL query: " + err.stack);
            response.status(500).json({ error: "Internal server error" });
            return;
        }
        console.log(results);
        response.json(results);
    });
});
