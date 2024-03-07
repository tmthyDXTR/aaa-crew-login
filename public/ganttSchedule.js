window.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("try to load shift data");

        // Initialize the time schedule with constructed rows
        $("#schedule").timeSchedule({
            // schedule start time(HH:ii)
            startTime: "08:00",
            // schedule end time(HH:ii)
            endTime: "31:00",
            // cell timestamp example 60 minutes
            widthTime: 60 * 60,
            // width(px)
            widthTimeX: 60,
            draggable: true,
            resizable: true,
            resizableLeft: true,
            timeLineY: 60,
            onChange: function (node, data) {
                console.log("onChange", data);
            },
            onInitRow: function (node, data) {
                // console.log("onInitRow", data);
            },
            onClick: function (node, data) {
                // data cell
                // openModal();
                console.log("onClick", data);
            },
            onAppendRow: function (node, data) {
                // console.log("onAppendRow", data);
            },
            onAppendSchedule: function (node, data) {
                // console.log("onAppendSchedule", data);
            },
            onScheduleClick: function (node, time, timeline) {
                // empty cell
                console.log("onScheduleClick", time + " " + timeline);
            },
        });

        // Fetch user data
        const response = await fetch("/fetch-gantt-data");
        const shiftData = await response.json();
        // console.log(shiftData);

        // Group shift data by schicht_ort
        const groupedShiftData = {};
        shiftData.forEach((slot) => {
            if (!groupedShiftData[slot.schicht_ort]) {
                groupedShiftData[slot.schicht_ort] = [];
            }
            groupedShiftData[slot.schicht_ort].push(slot);
        });
        // console.log(groupedShiftData);

        Object.keys(groupedShiftData).forEach((schichtOrt) => {
            const shiftDataArray = groupedShiftData[schichtOrt];
            // console.log(shiftDataArray);
            // Process shift data array for the current schicht_ort

            // Initialize an array to hold the rows
            const rows = [];
            // Iterate through the sorted data
            for (const slot of shiftDataArray) {
                let addedToExistingRow = false;

                // Check if the slot overlaps with any existing row
                for (const row of rows) {
                    let overlaps = false;

                    // Check if the slot overlaps with any slot in the current row
                    for (const existingSlot of row) {
                        if (
                            slot.start_time < existingSlot.end_time &&
                            slot.end_time > existingSlot.start_time
                        ) {
                            overlaps = true;
                            break;
                        }
                    }

                    // If the slot doesn't overlap with any slot in the current row, add it to the row
                    if (!overlaps) {
                        row.push(slot);
                        addedToExistingRow = true;
                        break;
                    }
                }

                // If the slot couldn't be added to any existing row, create a new row with the current slot
                if (!addedToExistingRow) {
                    rows.push([slot]);
                }
            }
            // console.log(rows);

            // Initialize an array to hold rows data
            let rowsData = [];

            rows.forEach((row, rowIndex) => {
                // Initialize an array to hold schedule data for the current row
                let scheduleData = [];
                let shiftTitle = "FUCK";
                // Format the slot data according to the structure expected by the TimeSchedule plugin
                row.forEach((slot, slotIndex) => {
                    // console.log(slot);
                    shiftTitle = slot.schicht_ort;
                    // Parse start_time and end_time strings into JavaScript Date objects
                    let startTime = new Date(slot.start_time);
                    let endTime = new Date(slot.end_time);

                    // Get formatted start and end time strings as "HH:MM"
                    let formattedStartTime = startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    let formattedEndTime = endTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    // Check if the formatted time is earlier than "07:00"
                    if (
                        timeStringToMinutes(formattedStartTime) <
                        timeStringToMinutes("07:00")
                    ) {
                        // Add 24 hours to the formatted time
                        // console.log(formattedStartTime);
                        formattedStartTime = add24Hours(formattedStartTime);
                        // console.log(formattedStartTime);
                    }

                    if (
                        timeStringToMinutes(formattedEndTime) <
                        timeStringToMinutes("07:00")
                    ) {
                        // Add 24 hours to the formatted time
                        formattedEndTime = add24Hours(formattedEndTime);
                    }

                    // Format the slot data according to the structure expected by the TimeSchedule plugin
                    const formattedSlot = {
                        start: formattedStartTime,
                        end: formattedEndTime,
                        text: slot.schicht_ort + "-" + formattedStartTime, // Text for the slot (you can customize this)
                        data: {
                            id: slot.id,
                            tag: slot.schicht_tag,
                        }, // Additional data for the slot if needed
                    };

                    // Add the formatted slot to the schedule data array
                    scheduleData.push(formattedSlot);
                });

                // Add the formatted row data to the rows data array
                rowsData.push({
                    [0]: {
                        // Assuming row indices start from 1
                        title: shiftTitle,
                        subtitle: "Description",
                        schedule: scheduleData,
                    },
                });
            });

            Object.keys(rowsData).forEach((row) => {
                const fuckIT = rowsData[row][0];
                console.log(fuckIT);
                $("#schedule").timeSchedule("addRow", 0, {
                    title: fuckIT.title,
                    schedule: fuckIT.schedule,
                });
            });

            // for (const row of rowsData)
            // {
            //     console.log(rowsData[row].schedule);
            //     // $("#schedule").timeSchedule('addRow', timeline, {
            //     //     title: 'Title Area',
            //     //     schedule: Object.assign({}, ...row)
            //     // });
            // }
        });

        formatGantChart();
    } catch {
        console.log("fetch failed horribly");
    }
});

// Get the modal
var modal = document.getElementById("slotInfo");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function openModal() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

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
    // const desiredRowHeight = "60px"; // Adjust this value as needed

    // // Set the height for each timeline element
    // timelineElements.forEach((timeline) =>
    // {
    //     timeline.style.height = desiredRowHeight;
    // });
    // Select all elements with class 'sc_bar'
    var scBars = document.querySelectorAll(".sc_bar");

    // Iterate through each 'sc_bar' element
    scBars.forEach(function (scBar) {
        // Get the text inside <span class="text">
        var text = scBar.querySelector(".text").textContent;

        // Check the text content and assign background color accordingly
        if (text.startsWith("AO-")) {
            scBar.style.backgroundColor = "green";
        } else if (text.startsWith("AU-")) {
            scBar.style.backgroundColor = "blue";
        }
        // Add more conditions for other prefixes if needed

        // Additional code to integrate the color suggestions
        // Define the color mapping for each schicht_ort
        var colorMap = {
            KA: "#FF33FF",
            HEI: "#CC9900",
            EP: "lightgreen",
            KB: "black",
            KF: "gray",
            PB: "#008B8B",
            KUE: "#9B59B6",
            ES: "#FF5733",
            BSH: "darkred",
            VA: "darkblue",
            AO: "green", // Already handled in the previous condition
            AU: "blue", // Already handled in the previous condition
            TG: "darkgreen",
            FMS: "darkyellow",
            BSZ: "darkred",
            AW: "darkblue",
            NW: "darkgray",
            AUF: "darkorange",
            SD: "darkpink",
        };

        // Get the schicht_ort from the text content
        var schichtOrt = text.split("-")[0];

        // Check if the schicht_ort is in the color map
        if (colorMap.hasOwnProperty(schichtOrt)) {
            // Assign the background color based on the color map
            scBar.style.backgroundColor = colorMap[schichtOrt];
        }
    });
}
