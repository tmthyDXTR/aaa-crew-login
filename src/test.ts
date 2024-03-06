import { createDBConnection } from "./db";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create sql db connection
const connection = createDBConnection();

// Function to generate random users
export function generateRandomUsers(x: number) {
    const users = [];
    for (let i = 0; i < x; i++) {
        const vorname = FirstNames[getRandomInt(0, FirstNames.length - 1)];
        const nachname = LastNames[getRandomInt(0, LastNames.length - 1)];
        const spitzname = (vorname.substr(0, 3) + nachname.substr(0, 2)).toLowerCase();

        const user = {
            userId: i,
            vorname: vorname,
            nachname: nachname,
            spitzname: spitzname,
            // Generate random birthdate
            geburtstdatum: getRandomDate(new Date(1978, 0, 1), new Date(2004, 0, 1)),
            handynr: `+1234567890${i}`,
            wieOftDabei: getRandomInt(0, 22), // Generate random number between 0 and 10
            essen: `Food${i}`,
            ordner: getRandomInt(0, 1), // Generate random 0 or 1
            kurier: getRandomInt(0, 1),
            aufbau: getRandomInt(0, 1),
            festival: getRandomInt(1, 1),
            schicht: getRandomInt(0, 1),
            abbau: getRandomInt(0, 1),
            veteranen: getRandomInt(0, 1),
            tshirtSize: 'M',
            hoodieSize: 'M',
            // Generate random preferences for different shifts
            schicht_viererSchicht: getRandomInt(0, 2),
            schicht_eingangshäuschen: getRandomInt(0, 2),
            schicht_greencamping: getRandomInt(0, 2),
            schicht_nachtwache: getRandomInt(0, 2),
            schicht_küche: getRandomInt(0, 2),
            schicht_künstlerbetreuung: getRandomInt(0, 2),
            schicht_personalbüro: getRandomInt(0, 2),
            schicht_kassenbüro: getRandomInt(0, 2),
            schicht_parkplatz: getRandomInt(0, 2),
            schicht_flaschensammeln: getRandomInt(0, 2),
            schicht_ausschank: getRandomInt(0, 2)
        };
        users.push(user);
    }
    addUsersToDatabase(users);
}

const FirstNames = [
    'Anna', 'Max', 'Sophie', 'Paul', 'Maria', 'Felix', 'Lena', 'Jonas', 'Laura', 'Moritz',
    'Emma', 'Lukas', 'Hannah', 'Leon', 'Julia', 'Ben', 'Sarah', 'Tim', 'Lara', 'David'
];

const LastNames = [
    'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Meyer', 'Weber', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
    'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun'
];

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random date between two dates
function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Function to add users to the database
function addUsersToDatabase(users: any[]) {
    const sql = 'INSERT INTO test_user_data SET ?';
    users.forEach(user => {
        connection.query(sql, user, (err, results) => {
            if (err) throw err;
            console.log(`User added with ID: ${results.insertId}`);
        });
    });
}


// Function to insert slots for the shift
export const insertShiftSlots = (shiftId: number) => {
    const sql = `SELECT start_time, end_time FROM test_schichten WHERE id = ?`;
    connection.query(sql, [shiftId], (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        }
        if (results.length === 0) {
            console.error('Shift not found');
            return;
        }

        const { start_time, end_time } = results[0];
        const slotDuration: number = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        let currentSlotStart: Date = new Date(start_time);

        while (currentSlotStart < end_time) {
            const currentSlotEnd: Date = new Date(currentSlotStart.getTime() + slotDuration);

            const insertSql: string = `INSERT INTO test_schichten_slots (test_schichten_id, start_time, end_time) VALUES (?, ?, ?)`;
            const values: any[] = [shiftId, currentSlotStart, currentSlotEnd];

            connection.query(insertSql, values, (insertError, insertResults, insertFields) => {
                if (insertError) {
                    console.error(insertError);
                } else {
                    console.log(`Slot added with ID: ${insertResults.insertId}`);
                }
            });

            currentSlotStart = currentSlotEnd;
        }
    });
};