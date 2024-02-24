import express, { Request, Response } from 'express';
import session, { SessionData } from 'express-session';
import path from 'path';
import mysql from 'mysql';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Define a custom interface for the session object
interface CustomSession extends SessionData {
    loggedin?: boolean;
    userEmail?: string;
    userName?: string;
    userId?: number;
}

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

const connection = mysql.createConnection({
    host: process.env.SQL_HOST || 'localhost',
    user: process.env.SQL_USER_NAME || 'root',
    password: process.env.SQL_USER_PASSWORD || '',
    database: process.env.SQL_DB_NAME || 'aaa_users'
});

app.post('/login', function(request: Request, response: Response) {
    let userEmail: string = (request.body?.email as string) ?? '';
    let password: string = (request.body?.password as string) ?? '';
    const customSession: CustomSession = request.session as CustomSession;

    if (userEmail && password) {
        connection.query('SELECT * FROM aaa_users WHERE userEmail = ?', [userEmail], function(error, results, fields) {
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

            bcrypt.compare(password, hashedPassword, function(compareError, isMatch) {
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
                } else {
                    response.status(400).send('Incorrect Email and/or Password!');
                }
            });
        });
    } else {
        response.status(400).send('Please enter Email and Password!');
    }
});

app.post('/register', function(request: Request, response: Response) {
    // Handle registration form submission
    const regEmail: string = (request.body?.reg_email as string) ?? '';
    const regPassword: string = (request.body?.reg_password as string) ?? '';
    const regPassword2: string = (request.body?.reg_password2 as string) ?? '';

    if (regEmail && regPassword) {
        if (regPassword != regPassword2) {
            response.status(400).send('Passwords do not match');
            return;
        }
        // Hash the password
        bcrypt.hash(regPassword, 10, function(hashError, hashedPassword) {
            if (hashError) {
                console.error('Error hashing password:', hashError);
                response.status(500).send('Error hashing password');
                return;
            }

            // Check if user already exists
            connection.query('SELECT * FROM aaa_users WHERE userEmail = ?', [regEmail], function(selectError, selectResults, selectFields) {
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
                connection.query('INSERT INTO aaa_users (userEmail, userPassword) VALUES (?, ?)', [regEmail, hashedPassword], function(insertError, insertResults, insertFields) {
                    if (insertError) {
                        console.error('Error registering user:', insertError);
                        response.status(500).send('Error registering user');
                        return;
                    }
                    response.redirect('/login'); // Redirect to login page after successful registration
                });
            });
        });
    } else {
        response.status(400).send('Please enter Email and Password for registration');
    }
});

// Define a simple login route to handle GET requests
app.get('/login', function(request: Request, response: Response) {
    response.sendFile(path.join(__dirname, '/../public/login.html'));
});

app.get('/', function(request: Request, response: Response) {
    response.sendFile(path.join(__dirname + '/../public/login.html')); // Send the login page HTML file
});

app.get('/home', function(request: Request, response: Response) {
    const customSession: CustomSession = request.session as CustomSession;
    
    if (customSession.loggedin) {
        response.sendFile(path.join(__dirname, '/../public/home.html')); // Send the home page HTML file containing the form
    } else {
        response.send('Please login to view this page!');
    }
});

app.post('/submit-personal-data', function(request, response) {
    const { vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen } = request.body;
    const customSession: CustomSession = request.session as CustomSession;

    // Perform any necessary validation or processing of the form data here

    // Example: Log the submitted data
    console.log('Submitted Data:', { vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen });

    // Insert the form data into the database
    const sql = `
    INSERT INTO aaa_user_data 
    (userId, vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
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
    veteranen = VALUES(veteranen)
    `;

    const values = [customSession.userId, vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen];
        
    connection.query(sql, values, function(error, results, fields) {
        if (error) {
            console.error('Error inserting data into database:', error);
            response.status(500).send('Error submitting data');
            return;
        }

        console.log('Data inserted successfully');
        response.sendFile(path.join(__dirname, '/../public/home.html')); // Send the home page HTML file containing the form
    });
});

app.get('/fetch-user-data', function(request: Request, response: Response) {
    const customSession: CustomSession = request.session as CustomSession;
    if (!customSession.loggedin || !customSession.userId) {
        response.status(401).send('User not logged in');
        return;
    }

    connection.query('SELECT * FROM aaa_user_data WHERE userId = ?', [customSession.userId], function(error, userDataResults, fields) {
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
        const formattedUserData = {
            ...userDataResults[0], // Shallow copy of the user data object
            geburtstdatum: geburtstdatum.toISOString().split('T')[0] // Extract YYYY-MM-DD part
        };
        console.log("Fetched Data:", {formattedUserData})
        response.json(formattedUserData);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');

    try {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log('Server Timezone:', timezone);
    } catch (error) {
        console.error('Error retrieving timezone:', error);
    }
});


// Set up multer to handle file uploads
const upload = multer({
    dest: 'userPics/', // Destination folder for uploaded images
    limits: {
      fileSize: 3 * 1024 * 1024, // Max file size: 3MB
    },
  });
  
  // Define the endpoint for image upload
  app.post('/upload-image', upload.single('image'), function (req, res) {
    if (!req.file) {
      // No file uploaded
      return res.status(400).send('No file uploaded.');
    }
  
    // File is uploaded, you can access it via req.file
    const imagePath = req.file.path;
    // Save imagePath to the database or use it as needed
    // For example, you can save it to the user's profile in the database
    
    res.send('File uploaded successfully.');    
});

