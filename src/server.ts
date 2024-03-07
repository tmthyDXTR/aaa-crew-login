import { app, CustomSession } from "./session";
import express, { Request, Response } from "express";
import path from "path";
import { handlePasswordResetRequest } from "./passwordReset";
import { verifyToken } from "./tokenVerification";
import { createDBConnection } from "./db";
import { hashPassword, comparePassword } from "./passwordUtils";
import { uploadHandler } from "./storage";
import { submitPersonalData } from "./submitPersonalData";
import { submitShiftPreferences } from "./submitShiftPreferences";

// Create sql db connection
const connection = createDBConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/userPics", express.static("userPics"));

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

                comparePassword(password, hashedPassword)
                    .then((isMatch) => {
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
                    })
                    .catch((compareError) => {
                        console.error(
                            "Error comparing passwords:",
                            compareError
                        );
                        response.status(500).send("Internal Server Error");
                    });
            }
        );
    } else {
        response.status(400).send("Please enter Email and Password!");
    }
});

app.post("/register", async function (request: Request, response: Response) {
    // Handle registration form submission
    const regEmail: string = (request.body?.reg_email as string) ?? "";
    const regPassword: string = (request.body?.reg_password as string) ?? "";
    const regPassword2: string = (request.body?.reg_password2 as string) ?? "";

    if (regEmail && regPassword) {
        if (regPassword != regPassword2) {
            response.status(400).send("Passwords do not match");
            return;
        }

        try {
            // Hash the password
            const hashedPassword = await hashPassword(regPassword);

            // Check if user already exists
            connection.query(
                "SELECT * FROM aaa_users WHERE userEmail = ?",
                [regEmail],
                async function (selectError, selectResults, selectFields) {
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
        } catch (error) {
            console.error("Error hashing password:", error);
            response.status(500).send("Error hashing password");
        }
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

app.post(
    "/submit-personal-data",
    uploadHandler.single("profile-pic"),
    submitPersonalData
);

app.get("/schichtwuensche", function (request, response) {
    // Render the shift preferences form page here
    response.sendFile(path.join(__dirname, "/../public/schichtwuensche.html"));
});

app.post("/submit-shift-preferences", submitShiftPreferences);

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

// Define route to fetch Gantt data
app.get("/fetch-gantt-data", (request: Request, response: Response) => {
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
    LIMIT 20;`;

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
