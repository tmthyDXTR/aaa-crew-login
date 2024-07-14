"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPersonalData = void 0;
const db_1 = require("./db");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
function submitPersonalData(request, response) {
    const { klarname, vorname, nachname, spitzname, geburtstdatum, handynr, wieOftDabei, essen, ordner, kurier, aufbau, festival, schicht, abbau, veteranen, anmerkung, } = request.body;
    const customSession = request.session;
    // Get the file path of the uploaded image
    const imagePath = request.file ? request.file.path : null;
    const tshirtSize = request.body.tshirtSize || ""; // Change '' to a default value if needed
    const hoodieSize = request.body.hoodieSize || ""; // Change '' to a default value if needed
    // Perform any necessary validation or processing of the form data here
    // Example: Log the submitted data
    console.log("Submitted Data:", {
        klarname,
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
        imagePath
    });
    // Insert the form data into the database
    let sql = `
    UPDATE aaa_user_data
    SET
        klarname = ?,
        vorname = ?,
        nachname = ?,
        spitzname = ?,
        geburtstdatum = ?,
        handynr = ?,
        wieOftDabei = ?,
        essen = ?,
        ordner = ?,
        kurier = ?,
        aufbau = ?,
        festival = ?,
        schicht = ?,
        abbau = ?,
        veteranen = ?,
        tshirtSize = ?,
        hoodieSize = ?,
        anmerkung = ?
        `;
    // Check if an image was uploaded
    if (imagePath) {
        // If an image was uploaded, include it in the query
        sql += `, userPicLink = ?`;
    }
    sql += ` WHERE userId = ?;`;
    const values = [
        klarname,
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
    values.push(customSession.userId);
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
