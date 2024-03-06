import { createDBConnection } from "./db";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Create sql db connection
const connection = createDBConnection();


const dataFreitag = `09:00,KA-FR 9-1,KA-FR 9-2,HEI-FR 9-1,EP-FR 9-1,
,
10:00,KB-FR 10-1,KA-FR 10-1,EP-FR 10-1,KF-FR 10-1,
,
11:00,KA-FR 11-1,HEI-FR 11-1,EP-FR 11-1,
,
12:00,KB-FR 12-1,PB-FR 12-1,PB-FR 12-2,KA-FR 12-1,EP-FR 12-1,KUE-FR 12-1,KUE-FR 12-2,
,
13:00,KB-FR 13-1,PB-FR 13-1,KA-FR 13-1,HEI-FR 13-1,EP-FR 13-1,
,
14:00,KB-FR 14-1,PB-FR 14-1,KA-FR 14-1,KA-FR 14-2,EP-FR 14-1,ES-FR 14-1,
,
15:00,KB-FR 15-1,PB-FR 15-1,KA-FR 15-1,KA-FR 15-2,HEI-FR 15-1,EP-FR 15-1,ES-FR 15-1,BSH-FR 15-1,
,
16:00,KB-FR 16-1,PB-FR 16-1,VA-FR 16-1,KA-FR 16-1,KA-FR 16-2,HEI-FR 16-1,EP-FR 16-1,ES-FR 16-1,KUE-FR 16-1,AO-FR 16-1,AO-FR 16-2,AU-FR 16-1,BSH-FR 16-1,TG-FR 16-1,
,
17:00,KB-FR 17-1,PB-FR 17-1,KA-FR 17-1,KA-FR 17-2,HEI-FR 17-1,EP-FR 17-1,ES-FR 17-1,KUE-FR 17-1,AU-FR 17-1,BSH-FR 17-1,BSH-FR 17-2,TG-FR 17-1,
,
18:00,KB-FR 18-1,PB-FR 18-1,VA-FR 18-1,KA-FR 18-1,KA-FR 18-2,HEI-FR 18-1,EP-FR 18-1,ES-FR 18-1,KF-FR 18-1,FMS-FR 18-1,KUE-FR 18-1,AO-FR 18-1,AO-FR 18-1,AO-FR 18-2,AU-FR 18-1,BSH-FR 18-1,BSZ-FR 18-1,AW-FR 18-1,AW-FR 18-2,TG-FR 18-1,
,
19:00,KB-FR 19-1,KA-FR 19-1,KA-FR 19-2,HEI-FR 19-1,EP-FR 19-1,ES-FR 19-1 ,FMS-19-1,KUE-FR 19-1,AO-FR 19-1,AU-FR 19-1,BSH-FR 19-1,BSH-FR 19-2,BSZ-FR 19-1,AW-FR 19-1,TG-FR 19-1,
,
20:00,KB-FR 20-1,PB-FR 20-1,VA-FR 20-1,KA-FR 20-1,KA-FR 20-2,HEI-FR 20-1,EP-FR 20-1,ES-FR 20-1,FMS-FR 20-1,KUE-FR 20-1,KUE-FR 20-2,AO-FR 20-1,AO-FR 20-2,AO-FR 20-3,AU-FR 20-1,BSH-FR 20-1,AW-FR 20-1,TG-FR 20-1,
,
21:00,KB-FR 21-1,KA-FR 21-1,KA-FR 21-2,HEI-FR 21-1,EP-FR 21-1,ES-FR 21-1,FMS 21-1,KUE-FR 21-1,AO-FR 21-1,AO-FR-21-2,AO-FR-21-3,AU-FR 21-1,AU-FR 21-2,AU-FR 21-3,BSH-FR 21-1,BSH-FR 21-2,BSZ-FR 21-1,AW-FR 21-1,
,
22:00,KB-FR 22-1,PB-FR 22-1,VA-FR 22-1,KA-FR 22-1,HEI-FR 22-1,EP-FR 22-1,ES-FR 22-1,FMS-FR 22-1,KUE-FR 22-1,KUE-FR 22-2,AO-FR 22-1,AO-FR 22-2,AU-FR 22-1,AU-FR 22-2,BSH-FR 22-1,AW-FR 22-1,
,
23:00,KB-FR 23-1,KA-FR 23-1,HEI-FR 23-1,FMS-FR 23-1,KUE-FR 23-1,AO-FR 23-1,AO-FR 23-2,AO-FR 23-3,AU-FR 23-1,AU-FR 23-2,AU-FR 23-3,BSH-FR 23-1,BSH-FR 23-2,BSZ-FR 23-1,
,
00:00,KB-FR 24-1,PB-FR 24-1,VA-FR 24-1,KA-FR 24-1,HEI-FR 24-1,FMS-FR 24-1,", ",KUE-FR 24-1,AO FR 24-1,AO-FR 24-2,AU-FR 24-1,AU-FR-24-2,BSH-FR 24-1,
,
01:00,KUE-FR 1-1,AO-FR 1-1,AO-FR 1-2,AO-FR 1-3,AU-FR 1-1,AU-FR 1-2,AU-FR 1-3,BSH-FR 1-1,BZS-FR 1-1,
,
02:00,KB-FR 2-1,KB-FR 2-2,KUE-FR 2-1,AO FR 2-1,AO-FR 2-2,AU-FR 2-1,AU-FR-2-2,
,
03:00,AU-FR 3-1,
,
04:00,NW-FR 4-1,NW-FR 4-2,NW-FR 4-3,NW-FR 4-4,NW-FR 4-5,NW-FR 4-6,`;

const dataSamstag = `07:00,AUF-SA 7-1,AUF-SA 7-2,AUF-SA 7-3,AUF-SA 7-4,AUF-SA 7-5,AUF-SA 7-6,
,
08:00,
,
09:00,KB-SA 9-1,PB-SA 9-1,KA-SA 9-1,KA-SA 9-2,HEI-SA-9-1,HEI-SA 9-2,EP-SA 9-1,EP-SA 9-1,ES-SA 9-1,KUE-SA 9-1,KUE-SA 9-2,KUE-SA 9-3,AU-SA 9-1,
,
10:00,VA-FR 10-1,KA-SA 10-1,KA-SA 10-2,HEI-SA 10-1,EP-SA 10-1,ES-SA 10-1,KF-SA 10-1,KUE-SA 10-1,AO-SA 10-1,AO-SA 10-2,AU-SA 10-1,BSH-SA 10-1,TG-SA 10-1,
,
11:00,KB-SA 11-1,PB-SA 11-1,KA-SA 11-1,HEI-SA 11-1,EP-SA 11-1,ES-SA 11-1,KUE-SA 11-1,AO-SA 11-1,AU-SA 11-1,TG-SA 11-1,TG-SA 11-2,
,
12:00,318,VA-SA 12-1,KA-SA 12-1,KA-SA 12-2,HEI-SA 12-1,EP-SA 12-1,ES-SA 12-1,FMS-SA 12-1,KUE-SA 12-1,KUE-SA 12-2,AO-SA 12-1,AO-SA 12-2,AU-SA 12-1,BSH-SA 12-1,6,TG-SA 12-1,
,
13:00,KB-SA 13-1,PB-SA 13-1,KA-SA 13-1,HEI-SA 13-1,EP-SA 13-1,ES-SA 13-1,FMS- SA 13-1,KUE-SA 13-1,AO-SA 13-1,AU-SA 13-1,BSH-SA 13-1,TG-SA 13-1,TG-SA 13-2,
,
14:00,KB-SA 14-1,319,VA-SA 14-1,KA-SA 14-1,KA-SA 14-2,HEI-SA 14-1,EP-SA 14-1,ES-SA 14-1,FMS-SA 14-1,KUE-SA 14-1,AO-SA 141,AO-SA 14-2,AU-SA 14-1,BSH-SA 14-1,BSH-SA 14-2,AW-SA 14-1,AW-SA 14-2,TG-SA 14-1,
,
15:00,KB-SA 15-1,PB-SA 15-1,KA-SA 15-1,KA-SA 15-2,HEI-SA 15-1,EP-SA 15-1,ES-SA 15-1,FMS-SA 15-1,KUE-SA 15-1,AO-SA 15-1,AO-SA 15-2,AU-SA 15-1,BSH-SA 15-1,AW-SA 15-1,TG-SA 15-1,TG-SA 15-2,SD-SA 15-1,SD-SA 15-2,
,
16:00,KB-SA 16-1,320,VA-SA 16-1,KA-SA 16-1,KA-SA 16-2,HEI-SA 16-1,EP-SA 16-1,ES-SA 16-1,FMS-SA 16-1,KUE-SA 16-1,AO-SA 16-1,AO-FR 16-2,AU-SA 16-1,AU-SA 16-2,BSH-SA 16-1,BSH-SA 16-2,BSZ-SA 16-3,AW-SA 16-1,TG-SA 16-1,
,
17:00,KB-SA 17-1,PB-SA 17-1,KA-SA 17-1,KA-SA 17-2,HEI-SA 17-1,EP-SA 17-1,ES-SA 17-1,FMS-SA 17-1,KUE-SA 17-1,AO-SA 17-1,AO-SA 17-2,AU-SA 17-1,BSH-SA 17-1,AW-SA 17-1,TG-SA 17-1,
,
18:00,KB-SA 18-1,321,VA-SA 18-1,KA-SA 18-1,KA-SA 18-2,HEI-SA 18-1,EP-SA 18-1,ES-SA 18-1,KF-SA 18-1,FMS-SA 18-1,KUE-SA 18-1,AO-SA 18-1,AO-SA 18-2,AU-SA 18-1,AU-SA 18-2,BSH-SA 18-1,BSH-SA 18-2,BSZ-SA 18-1,AW-SA 18-1,
,
19:00,KB-SA 19-1,PB-SA 19-1,KA-SA 19-1,KA-SA 19-2,HEI-SA 19-1,EP-SA 19-1,ES-SA 19-1,FMS-SA 19-1,KUE-SA 19-1,AO-SA 19-1,AO-SA 19-2,AU-SA 19-1,AU-SA 19-2,BSH-SA 19-1,AW-SA 19-1,
,
20:00,KB-SA 20-1,322,VA-SA 20-1,KA-SA 20-1,KA-SA 20-2,HEI-SA 20-1,ES-SA 20-1,AU-SA 20-1,KUE-SA 20-1,KUE-SA 20-2,AO-SA 20-1,AO-SA 20-2,AU-SA 20-1,AU-SA 20-2,BSH-SA 20-1,BSH-SA 20-2,BSZ-SA 20-1,AW-SA 20-1,
,
21:00,KB-SA 21-1,PB-SA 21-1,KA-SA 21-1,KA-SA 21-2,HEI-SA 21-1,FMS-SA 21-1,KUE-SA 21-1,AO-SA 21-1,AO-SA 21-2,AO-SA 21-3,AU-SA 21-1,AU-SA 21-2,BSH-SA 21-1,AW-SA 21-1,
,
22:00,KB-SA 22-1,323,VA-SA 22-1,KA-SA 22-1,HEI-SA 22-1,FMS-SA 22-1,KUE-SA 22-1,KUE-SA 22-2,AO-SA 22-1,AO-SA 22-2,AU-SA-22-1,AU-SA-22-2,AU-SA-22-3,BSH-SA 22-1,BSH-SA 22-2,BSZ-SA 22-1,AW-SA 22-1,
,
23:00,KB-SA 23-1,PB-SA 23-1,KA-SA 23-1,HEI-SA 23-1,FMS-SA 23-1,KUE-SA 23-1,AO-SA 23-1,AO-SA 23-2,AO-SA 23-3,AU-SA-23-1,AU-SA 23-2,BSH-SA 23-1,AW-SA 23-1,
,
00:00,KB-24-1,324,VA-SA 24-1,KA-SA 24-1,HEI-SA 24-1,KUE-SA 24-1,KUE-SA 24-2,AO-SA 24-1,AO-SA 24-2,AU-SA 24-1,AU-SA 24-2,AU-SA 24-3,BSH-SA 24-1,BSH-SA 24-2,BSZ-SA 24-1,
,
01:00,KB-SA 1-1,KUE-SA 1-1,KUE-SA 1-2,AO-SA 1-1,AO-SA 1-2,AO-SA 1-3,AU-SA 1-1,AU-SA 1-2,
,
02:00,VA-SA 2-1,KUE-SA 2-1,AO-SA 2-1,AO-SA 2-2,AU-SA 2-1,AU-SA 2-2,
,
03:00,
,
04:00,NW-SA 4-1,NW-SA 4-2,NW-SA 4-3,NW-SA 4-4,NW-SA 4-5,NW-SA 4-6,`;

const dataSonntag = `07:00,PB-SO 7-1,AUF-SO 7-1,AUF-SO 7-2,AUF-SO 7-3,AUF-SO 7-4,AUF-SO 7-5,
,
08:00,KB-SO 8-1,KB-SO 8-2,PB-SO 8-1,TG-SO 8-1,TG-SO 8-2,TG-SO 8-3,
,
09:00,KA-SO 8-1,KA-SO 8-2,ES-SO 9-1,ES-SO 9-2,BSH-SO 9-1,TG-SO 9-1,
,
10:00,KB-SO 10-1,KB-SO 10-2,PB-SO 10-1,VA-SO 10-1,KA-SO 10-1,KÜ-SO 10-1,KÜ-SO 10-2,KÜ-SO 10-3,AO-SO 10-1,AO-SO 10-2,AO-SO 10-3,AU-SO 10-1,AU-SO 10-3,AU-SO 10-2,AW-SO 10-1,AW-SO 10-2,TG-SO 10-1,TG-SO 10-2,TG-SO 10-3,
,
11:00,KA-SO 12-1,ES-SO 11-1,ES-SO 11-2,AO-SO 11-1,AO-SO 11-2,AU-SO 11-1,BSH-SO 11-1,AW-SO 11-2,TG-SO 11-1,
,
12:00,KB-SO 12-1,PB-SO 12-1,VA-SO 12-1,KA-SO 12-1,KÜ-SO 12-1,KÜ-SO 12-2,AO-SO 12-1,AO-SO 12-2,AU-SO 12-1,AU-SO 12-2,AW-SO 12-1,TG-SO 12-1,TG-SO 12-2,
,
13:00,KA-SO 13-1,ES-SO 13-1,ES-SO 13-2,AO-SO 13-1,AU-SO 13-1,BSH-SO 13-1,AW-SO 13-1,TG-SO 13-1,
,
14:00,KB-SO 14-1,PB-SO 14-1,VA-SO 14-1,KA-SO 14-1,KÜ-SO 14-1,KÜ-SO 14-2,AO-SO 14-1,AO-SO 14-2,AU-SO 14-1,AU-SO 14-2,TG-SO 14-1,
,
15:00,KA-SO 15-1,AO-SO 15-1,BSH-SO 15-1,TG-SO 15-1,
,
16:00,AO-SO 16-1,`;

// Split the data into individual lines
const lines = dataSonntag.split('\n');

// Process each line
lines.forEach((line) => {
    // Skip lines with only one comma
    if (line.split(',').length <= 1) {
        return;
    }

    // Split each line by comma
    const entries = line.split(',');

    // Process each entry
    entries.forEach((entry) => {
        // Trim any whitespace
        const trimmedEntry = entry.trim();

        // Split the entry using regular expression to match hyphen or space
        let [schichtOrt, schichtTag, schichtStart, schichtId] = trimmedEntry.split(/[- ]/);

        if (schichtOrt && schichtTag) {
            if (Number(schichtStart) < 10) {
                schichtStart = "0" + schichtStart;
            }
            // Calculate end_time
            let startTime = new Date(`2024-07-28T${schichtStart}:00:00`);
            if (Number(schichtStart)<7) startTime = new Date(`2024-07-29T${schichtStart}:00:00`);
            const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000)); // 2 hours in milliseconds
            // console.log(trimmedEntry);
            // Prepare SQL query
            const query = `INSERT INTO test_schichten (schicht_ort, schicht_tag, schicht_id, start_time, end_time) VALUES (?, ?, ?, ?, ?)`;
            const values = [schichtOrt, schichtTag, schichtId, startTime, endTime];
            console.log(values);
            // // Execute SQL query
            connection.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error inserting row:', err);
                } else {
                    console.log('Row inserted:', result);
                }
            });
        }
    });
});