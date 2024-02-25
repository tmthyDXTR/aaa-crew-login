"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
const path_1 = __importDefault(require("path"));
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
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
app.use((0, express_session_1.default)({
    cookie: { maxAge: 86400000 },
    store: MemoryStore,
    resave: false,
    saveUninitialized: false, // Set to false to prevent saving uninitialized sessions
    secret: 'keyboard cat'
}));
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use('/userPics', express_1.default.static('userPics'));
const connection = mysql_1.default.createConnection({
    host: process.env.SQL_HOST || 'localhost',
    user: process.env.SQL_USER_NAME || 'root',
    password: process.env.SQL_USER_PASSWORD || '',
    database: process.env.SQL_DB_NAME || 'aaa_users'
});
app.post('/login', function (request, response) {
    var _a, _b, _c, _d;
    let userEmail = (_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.email) !== null && _b !== void 0 ? _b : '';
    let password = (_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.password) !== null && _d !== void 0 ? _d : '';
    const customSession = request.session;
    if (userEmail && password) {
        connection.query('SELECT * FROM aaa_users WHERE userEmail = ?', [userEmail], function (error, results, fields) {
            if (error) {
                console.error('Error querying user:', error);
                response.status(500).send('Internal Server Error');
                return;
            }
            if (results.length === 0) {
                response.status(400).send('Incorrect Email and/or Password!');
                return;
            }
            const hashedPassword = results[0].userPassword;
            bcrypt_1.default.compare(password, hashedPassword, function (compareError, isMatch) {
                if (compareError) {
                    console.error('Error comparing passwords:', compareError);
                    response.status(500).send('Internal Server Error');
                    return;
                }
                if (isMatch) {
                    customSession.loggedin = true;
                    customSession.userEmail = userEmail;
                    customSession.userName = results[0].userName;
                    customSession.userId = results[0].userId;
                    console.log(results.userName);
                    response.redirect('/home');
                }
                else {
                    response.status(400).send('Incorrect Email and/or Password!');
                }
            });
        });
    }
    else {
        response.status(400).send('Please enter Email and Password!');
    }
});
app.post('/register', function (request, response) {
    var _a, _b, _c, _d, _e, _f;
    // Handle registration form submission
    const regEmail = (_b = (_a = request.body) === null || _a === void 0 ? void 0 : _a.reg_email) !== null && _b !== void 0 ? _b : '';
    const regPassword = (_d = (_c = request.body) === null || _c === void 0 ? void 0 : _c.reg_password) !== null && _d !== void 0 ? _d : '';
    const regPassword2 = (_f = (_e = request.body) === null || _e === void 0 ? void 0 : _e.reg_password2) !== null && _f !== void 0 ? _f : '';
    if (regEmail && regPassword) {
        if (regPassword != regPassword2) {
            response.status(400).send('Passwords do not match');
            return;
        }
        // Hash the password
        bcrypt_1.default.hash(regPassword, 10, function (hashError, hashedPassword) {
            if (hashError) {
                console.error('Error hashing password:', hashError);
                response.status(500).send('Error hashing password');
                return;
            }
            // Check if user already exists
            connection.query('SELECT * FROM aaa_users WHERE userEmail = ?', [regEmail], function (selectError, selectResults, selectFields) {
                if (selectError) {
                    console.error('Error checking existing user:', selectError);
                    response.status(500).send('Error checking existing user');
                    return;
                }
                if (selectResults.length > 0) {
                    // User already exists
                    response.status(400).send('Email already exists');
                    return;
                }
                // Insert new user into the database with hashed password
                connection.query('INSERT INTO aaa_users (userEmail, userPassword) VALUES (?, ?)', [regEmail, hashedPassword], function (insertError, insertResults, insertFields) {
                    if (insertError) {
                        console.error('Error registering user:', insertError);
                        response.status(500).send('Error registering user');
                        return;
                    }
                    response.redirect('/login'); // Redirect to login page after successful registration
                });
            });
        });
    }
    else {
        response.status(400).send('Please enter Email and Password for registration');
    }
});
// Define a simple login route to handle GET requests
app.get('/login', function (request, response) {
    response.sendFile(path_1.default.join(__dirname, '/../public/login.html'));
});
app.get('/', function (request, response) {
    response.sendFile(path_1.default.join(__dirname + '/../public/login.html')); // Send the login page HTML file
});
app.get('/home', function (request, response) {
    const customSession = request.session;
    if (customSession.loggedin) {
        response.sendFile(path_1.default.join(__dirname, '/../public/home.html')); // Send the home page HTML file containing the form
    }
    else {
        response.send('Please login to view this page!');
    }
});
const storage = multer_1.default.diskStorage({
    destination: 'userPics/', // Destination folder for uploaded images
    filename: function (req, file, cb) {
        const customSession = req.session; // Assuming CustomSession is your session type
        const userId = customSession.userId; // Assuming userId is stored in the session
        const { vorname, nachname } = req.body; // Assuming vorname and nachname are sent in the form body
        // Replace spaces in names with underscores and concatenate with userId
        const formattedName = `${userId}_${nachname}_${vorname}`.replace(/\s+/g, '_');
        const originalFileName = file.originalname;
        const extension = originalFileName.split('.').pop();
        const customFileName = `${formattedName}.${extension}`; // Custom filename: userId_vorname_nachname.extension
        cb(null, customFileName);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // Max file size: 3MB
    },
});
app.post('/submit-personal-data', upload.single('profile-pic'), function (request, response) {
    const { vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, anmerkung } = request.body;
    const customSession = request.session;
    // Get the file path of the uploaded image
    const imagePath = request.file ? request.file.path : null;
    const tshirtSize = request.body.tshirtSize || ''; // Change '' to a default value if needed
    const hoodieSize = request.body.hoodieSize || ''; // Change '' to a default value if needed
    // Perform any necessary validation or processing of the form data here
    // Example: Log the submitted data
    console.log('Submitted Data:', { vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, tshirtSize, hoodieSize, anmerkung });
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
        sql += ', userPicLink = ?';
    }
    const values = [customSession.userId, vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, tshirtSize, hoodieSize, anmerkung];
    // If an image was uploaded, append its path to the values array
    if (imagePath) {
        values.push(imagePath);
    }
    connection.query(sql, values, function (error, results, fields) {
        if (error) {
            console.error('Error inserting data into database:', error);
            response.status(500).send('Error submitting data');
            return;
        }
        console.log('Data inserted successfully');
        response.redirect('/schichtwuensche');
    });
});
app.get('/schichtwuensche', function (request, response) {
    // Render the shift preferences form page here
    response.sendFile(path_1.default.join(__dirname, '/../public/schichtwuensche.html'));
});
// Handle form submission
app.post('/submit-shift-preferences', function (request, response) {
    const { viererSchicht, eingangshäuschen, greencamping, nachtwache, küche, künstlerbetreuung, personalbüro, kassenbüro, parkplatz, flaschensammeln, ausschank } = request.body;
    const customSession = request.session;
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
        customSession.userId, viererSchicht, eingangshäuschen, greencamping, nachtwache, küche,
        künstlerbetreuung, personalbüro, kassenbüro, parkplatz, flaschensammeln, ausschank
    ];
    // Execute the SQL query
    connection.query(sql, values, (error, results, fields) => {
        if (error) {
            console.error('Error updating shift preferences:', error);
            response.status(500).send('Error updating shift preferences');
            return;
        }
        console.log('Shift preferences updated successfully');
        // Redirect to a success page or send a response indicating success
        response.redirect('/home');
    });
});
// Add a new backend route to fetch shift preferences
app.get('/fetch-shift-preferences', function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send('User not logged in');
        return;
    }
    connection.query('SELECT * FROM aaa_user_data WHERE userId = ?', [customSession.userId], function (error, userDataResults, fields) {
        if (error) {
            console.error('Error retrieving user data:', error);
            response.status(500).send('Error retrieving user data');
            return;
        }
        if (userDataResults.length === 0) {
            response.status(404).send('User data not found');
            return;
        }
        // Send the shift preferences data as JSON response
        console.log("Fetched Data:", userDataResults[0]);
        response.json(userDataResults[0]);
    });
});
app.get('/fetch-user-data', function (request, response) {
    const customSession = request.session;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send('User not logged in');
        return;
    }
    connection.query('SELECT * FROM aaa_user_data WHERE userId = ?', [customSession.userId], function (error, userDataResults, fields) {
        if (error) {
            console.error('Error retrieving user data:', error);
            response.status(500).send('Error retrieving user data');
            return;
        }
        if (userDataResults.length === 0) {
            response.status(404).send('User data not found');
            return;
        }
        console.log("Fetched Data:", userDataResults);
        let geburtstdatum = new Date(userDataResults[0].geburtstdatum);
        geburtstdatum.setDate(geburtstdatum.getDate() + 1);
        // Format the date string
        const formattedUserData = Object.assign(Object.assign({}, userDataResults[0]), { geburtstdatum: geburtstdatum.toISOString().split('T')[0] // Extract YYYY-MM-DD part
         });
        console.log("Fetched Data:", { formattedUserData });
        response.json(formattedUserData);
    });
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    try {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('Server Timezone:', timezone);
    }
    catch (error) {
        console.error('Error retrieving timezone:', error);
    }
});
