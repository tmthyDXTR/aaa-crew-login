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
                // Get all timeline elements
                adjustRowHeights(61);
                handleScheduleChange(data);
            },
            onInitRow: function (node, data) {
                // console.log("onInitRow", data);
            },
            onClick: function (node, data) {
                // data cell
                openModal();
                displayUsersWithShiftPreference(data.data.ort, checkedValues);
                const button = createButton("Delete Shift", function () {
                    deleteShift(data.data.id);
                });
                modalContent.appendChild(button);
                console.log("onClick", data);
            },
            onAppendRow: function (node, data) {
                // console.log("onAppendRow", data);
            },
            onAppendSchedule: function (node, data) {
                // console.log("onAppendSchedule", data);
            },
            onScheduleClick: function (node, timeline, time) {
                // empty cell
                openModal();
                // Create a button using the createButton function
                const button = createButton('Add Shift', function () {
                    // Call the function to add a shift slot
                    addShiftSlot(timeline, time);
                    closeModal();
                });
                // Append the button to the modal or any desired parent element
                modalContent.appendChild(button);


                console.log("onScheduleClick", node, timeline, time);
                // addShiftSlot(timeline, time);
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
        let rowIndex = 0;

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
            rows.forEach((row) => {
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
                            ort: slot.schicht_ort,
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
                $("#schedule").timeSchedule("addRow", rowIndex++, {
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
const modal = document.getElementById("slotInfo");
const modalContent = document.getElementById("modal-content");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function openModal() {
    modal.style.display = "block";
    modalContent.innerHTML = "";
    historyList.style = "display:none";
}

function closeModal() {
    modal.style.display = "none";
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
        timeElement.textContent = `${formatHour(hour)}:${timeString.split(":")[1]
            }`;
    });

    // Iterate through each "time" element
    timeElements.forEach((timeElement) => {
        const timeString = timeElement.textContent;
        const [startTime, endTime] = timeString.split("-");
        let startHour = parseInt(startTime.split(":")[0]);
        let endHour = parseInt(endTime.split(":")[0]);
        timeElement.textContent = `${formatHour(startHour)}:${startTime.split(":")[1]
            }-${formatHour(endHour)}:${endTime.split(":")[1]}`;
    });

    // Select all elements with class "timeline"
    const timelineElements = document.querySelectorAll(
        ".sc_data_scroll .timeline"
    );

    // Get all timeline elements
    adjustRowHeights(61);

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
function adjustRowHeights(px) {
    var timelines = document.querySelectorAll(".timeline");

    // Set a hardcoded height for each timeline
    timelines.forEach(function (timeline) {
        timeline.style.height = px + "px";
    });
}






// Assuming you have a function to handle the onchange event
function handleScheduleChange(data) {
    const jsonData = JSON.stringify(data);

    // Send updated data to server
    fetch('/updateSchedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Schedule updated successfully:', data);
            fetchHistory();
        })
        .catch(error => {
            console.error('Error updating schedule:', error);
        });
}


// Function to fetch and display history
async function fetchHistory() {
    try {
        const response = await fetch('/history');
        const history = await response.json();
        const historyList = document.getElementById('historyList');

        // Clear previous content
        historyList.innerHTML = '';

        // Display history items
        history.forEach(item => {
            const listItem = document.createElement('div');
            listItem.textContent = `ID: ${item.id}, Start Time: ${item.start_time}, End Time: ${item.end_time}`;
            historyList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error:', error);
        // Handle error scenario
    }
}

// Fetch history when the page loads
document.addEventListener('DOMContentLoaded', fetchHistory);

// Add click event listener to undo button
document.getElementById('undoButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/undo', { method: 'POST' });
        const data = await response.json();
        console.log(data);
        // Update history list after undo
        fetchHistory();
        // Optionally update the UI or display a message to the user
    } catch (error) {
        console.error('Error:', error);
        // Handle error scenario
    }
});

const historyButton = document.getElementById("history-button");
historyButton.addEventListener("click", showHistory);
function showHistory() {
    openModal();
    historyList.style = "display:block";
}
// Array to store the values of checked checkboxes
let checkedValues = ["2"];

// Get the checkboxes by their IDs
const checkbox0 = document.getElementById('value0');
const checkbox1 = document.getElementById('value1');
const checkbox2 = document.getElementById('value2');
checkbox2.checked = true;
// Add event listener to each checkbox
checkbox0.addEventListener('change', handleCheckboxChange);
checkbox1.addEventListener('change', handleCheckboxChange);
checkbox2.addEventListener('change', handleCheckboxChange);

const addShiftButton = document.getElementById("add-shift-button");
addShiftButton.addEventListener('click', addShiftSlot);

// Event handler function for checkbox change
function handleCheckboxChange(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
        // Add the value to the checkedValues array if the checkbox is checked
        checkedValues.push(value);
    } else {
        // Remove the value from the checkedValues array if the checkbox is unchecked
        const index = checkedValues.indexOf(value);
        if (index !== -1) {
            checkedValues.splice(index, 1);
        }
    }

    console.log('Checked values:', checkedValues);

    // Perform desired actions based on the updated array of checked values
}

// Function to fetch and display users with a specified value for schicht_ausschank
function displayUsersWithShiftPreference(shift, checkedValues) {
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = ''; // Clear previous content
    // Sort the checkedValues array in descending order
    checkedValues.sort((a, b) => b - a);


    checkedValues.forEach(preferenceValue => {
        // Fetch users from the server for each preference value
        fetch(`/users-with-shift-preference?column=${shift}&value=${preferenceValue}`)
            .then(response => response.json())
            .then(users => {
                // Display users in the modal or any other element
                if (modalContent) {
                    // Proceed with updating the modal content
                    users.forEach(user => {
                        const userElement = document.createElement('div');
                        userElement.textContent = `ID: ${user.id}, Name: ${user.vorname} ${user.nachname}`;
                        modalContent.appendChild(userElement);
                    });
                } else {
                    console.error('Modal content element not found.');
                }
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                // Handle error scenario
            });
    });

}

async function addShiftSlot(startTime, rowIndex) {
    const confirmed = window.confirm("Are you sure you want to add this shift?");

    if (!confirmed) {
        // User clicked Cancel, exit function
        return;
    }
    let formattedEndTime = (timeStringToMinutes(startTime) + 60) / 60 + ":00";
    let data = $("#schedule").timeSchedule('timelineData');
    console.log("add shift slot", startTime, formattedEndTime, rowIndex, data[rowIndex].title);
    try {
        const requestData = {
            startTime: startTime,
            endTime: formattedEndTime,
            title: data[rowIndex].title,
            day: "FR"
            // Add more data properties as needed
        };

        const response = await fetch('/addShift', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to add shift');
        }

        const responseData = await response.json();
        const { success, message, shiftId } = responseData;

        if (success) {
            console.log(message);
            console.log('Shift ID:', shiftId);
            $("#schedule").timeSchedule('addSchedule', rowIndex, {
                start: startTime,
                end: formattedEndTime,
                text: data[rowIndex].title + '-' + startTime,
                data: {
                    id: shiftId,
                    ort: data[rowIndex].title,
                    tag: "FR",
                }
            });
            formatGantChart();
        } else {
            console.error('Failed to add shift:', message);
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error scenario
    }
}

function createButton(text, clickHandler) {
    // Create a button element
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add("dos-button");
    // Add an event listener to the button
    button.addEventListener('click', clickHandler);

    return button;
}

async function deleteShift(shiftId) {
    console.log("delete shift", shiftId);
    // Display a confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this shift?");

    if (!confirmed) {
        // User clicked Cancel, exit function
        return;
    }
    try {
        const response = await fetch(`/deleteShift?id=${shiftId}`, { method: 'POST' });
        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error('Error:', error);
        // Handle error scenario
    }
}