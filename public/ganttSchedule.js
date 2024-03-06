window.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("try to load shift data");
        // Fetch user data
        const response = await fetch("/fetch-gantt-data");
        const shiftData = await response.json();
        console.log(shiftData);

        // Initialize an object to hold rows data for each schicht_ort
        const rowsData = {};

        // Iterate through the sorted data
        shiftData.forEach(slot => {
            const schichtOrt = slot.schicht_ort;

            // Initialize an array to hold schedule data for the current schicht_ort
            let scheduleData = rowsData[schichtOrt] || [];

            // Check if the slot overlaps with any existing slot in the current row
            let overlaps = scheduleData.some(existingSlot =>
                slot.start_time < existingSlot.end &&
                slot.end_time > existingSlot.start
            );

            // If the slot doesn't overlap with any existing slot, add it to the schedule data
            if (!overlaps) {
                // Parse start_time and end_time strings into JavaScript Date objects
                let startTime = new Date(slot.start_time);
                let endTime = new Date(slot.end_time);

                // Get formatted start and end time strings as "HH:MM"
                let formattedStartTime = startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                let formattedEndTime = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                // Check if the formatted time is earlier than "07:00"
                if (timeStringToMinutes(formattedStartTime) < timeStringToMinutes("07:00")) {
                    formattedStartTime = add24Hours(formattedStartTime);
                }

                if (timeStringToMinutes(formattedEndTime) < timeStringToMinutes("07:00")) {
                    formattedEndTime = add24Hours(formattedEndTime);
                }

                // Format the slot data according to the structure expected by the TimeSchedule plugin
                const formattedSlot = {
                    start: formattedStartTime,
                    end: formattedEndTime,
                    text: slot.schicht_ort + "-" + formattedStartTime,
                    data: {},
                };

                // Add the formatted slot to the schedule data array
                scheduleData.push(formattedSlot);

                // Update rowsData with the schedule data for the current schicht_ort
                rowsData[schichtOrt] = scheduleData;
            }
        });

        console.log(rowsData);
        // Initialize the time schedule with constructed rows
        $("#schedule").timeSchedule({
            rows: Object.assign({}, ...rowsData),
            // schedule start time(HH:ii)
            startTime: "08:00",
            // schedule end time(HH:ii)
            endTime: "30:00",
            // cell timestamp example 10 minutes
            widthTime: 30 * 120,
            // width(px)
            widthTimeX: 100,
            draggable: true,
            resizable: true,
            resizableLeft: true,
            timeLineY: 60,
            onChange: function (node, data) {
                console.log("onChange", data);
            },
            onInitRow: function (node, data) {
                console.log("onInitRow", data);
            },
            onClick: function (node, data) {
                console.log("onClick", data);
            },
            onAppendRow: function (node, data) {
                console.log("onAppendRow", data);
            },
            onAppendSchedule: function (node, data) {
                console.log("onAppendSchedule", data);
            },
            onScheduleClick: function (node, time, timeline) {
                console.log("onScheduleClick", time + " " + timeline);
            },
        });

        formatGantChart();

    } catch {
        console.log("fetch failed horribly");
    }
});

// Convert formatted time string to total minutes since midnight
function timeStringToMinutes(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
}
// Function to add 24 hours to a formatted time string
function add24Hours(timeString) {
    const [hours, minutes] = timeString.split(":").map(Number);
    let newHours = hours + 24;

    return `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
}
// Function to format the hour
function formatHour(hour) {
    if (hour >= 24) {
        hour -= 24;
    }
    return hour.toString().padStart(2, "0");
}

function formatGantChart() {
    // Get all elements with class "sc_time" and "time"
    const scTimeElements = document.querySelectorAll(".sc_time");
    const timeElements = document.querySelectorAll(".sc_main_scroll .time");

    // Iterate through each "sc_time" element
    scTimeElements.forEach((timeElement) => {
        const timeString = timeElement.textContent;
        let hour = parseInt(timeString.split(":")[0]);
        timeElement.textContent = `${formatHour(hour)}:${
            timeString.split(":")[1]
        }`;
    });

    // Iterate through each "time" element
    timeElements.forEach((timeElement) => {
        const timeString = timeElement.textContent;
        const [startTime, endTime] = timeString.split("-");
        let startHour = parseInt(startTime.split(":")[0]);
        let endHour = parseInt(endTime.split(":")[0]);
        timeElement.textContent = `${formatHour(startHour)}:${
            startTime.split(":")[1]
        }-${formatHour(endHour)}:${endTime.split(":")[1]}`;
    });

    // Select all elements with class "timeline"
    const timelineElements = document.querySelectorAll(
        ".sc_data_scroll .timeline"
    );

    // Define the desired height for each row
    const desiredRowHeight = "60px"; // Adjust this value as needed

    // Set the height for each timeline element
    timelineElements.forEach((timeline) => {
        timeline.style.height = desiredRowHeight;
    });
}