"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPersonalData = void 0;
const db_1 = require("./db");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
function submitPersonalData(request, response) {
    const { vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, anmerkung, } = request.body;
    const customSession = request.session;
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
exports.submitPersonalData = submitPersonalData;
