"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitShiftPreferences = void 0;
const db_1 = require("./db");
// Create sql db connection
const connection = (0, db_1.createDBConnection)();
function submitShiftPreferences(request, response) {
    const { viererSchicht, eingangshäuschen, greencamping, nachtwache, küche, künstlerbetreuung, personalbüro, kassenbüro, parkplatz, flaschensammeln, ausschank, frDaAb, frDaBis, saDaAb, saDaBis, soDaAb, soDaBis } = request.body;
    const customSession = request.session;
    // Construct the SQL query
    let sql = `
        INSERT INTO aaa_user_data 
        (userId, schicht_viererSchicht, schicht_eingangshäuschen, schicht_greencamping, schicht_nachtwache, schicht_küche, schicht_künstlerbetreuung, schicht_personalbüro, schicht_kassenbüro, schicht_parkplatz, schicht_flaschensammeln, schicht_ausschank, fr_da_ab, fr_da_bis, sa_da_ab, sa_da_bis, so_da_ab, so_da_bis) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
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
        schicht_ausschank = VALUES(schicht_ausschank),
        fr_da_ab = VALUES(fr_da_ab),
        fr_da_bis = VALUES(fr_da_bis),
        sa_da_ab = VALUES(sa_da_ab),
        sa_da_bis = VALUES(sa_da_bis),
        so_da_ab = VALUES(so_da_ab),
        so_da_bis = VALUES(so_da_bis)
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
        frDaAb,
        frDaBis,
        saDaAb,
        saDaBis,
        soDaAb,
        soDaBis
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
        response.redirect("/aufbauwoche");
    });
}
exports.submitShiftPreferences = submitShiftPreferences;
