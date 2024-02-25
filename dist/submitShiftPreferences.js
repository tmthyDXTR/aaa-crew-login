"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitShiftPreferences = void 0;
const db_1 = require("./db");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
function submitShiftPreferences(request, response) {
    const { viererSchicht, eingangshäuschen, greencamping, nachtwache, küche, künstlerbetreuung, personalbüro, kassenbüro, parkplatz, flaschensammeln, ausschank, } = request.body;
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
}
exports.submitShiftPreferences = submitShiftPreferences;
