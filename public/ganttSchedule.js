var isHoverActivated = true;
const overlay = document.getElementById("overlay");

window.addEventListener("DOMContentLoaded", async () => {

    initializeTimeScheduleFr();
    initializeTimeScheduleSa();
    initializeTimeScheduleSo();
    
    // Call the function to add the event listeners
    addHoverListeners();
       
    const showFilledSlotsButton = document.getElementById("show-filled-slots-button");
    showFilledSlotsButton.addEventListener('click', toggleFilledSlots);


    
});









// Get the modal
const modal = document.getElementById("slotInfo");
const modalUserList = document.getElementById("modal-user-list");
const modalMenu = document.getElementById("modal-menu");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
function openModal() {
    modal.style.display = "block";
    modalUserList.innerHTML = "";
    modalMenu.innerHTML = "";
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

// Async function to fetch and display users with a specified value for schicht_ausschank
async function displayUsersWithShiftPreference(shift, checkedValues) {
    const modalContent = document.getElementById('modal-user-list');
    modalContent.innerHTML = ''; // Clear previous content
    const crewList = document.getElementById("crew-list-items");
    crewList.innerHTML = '';
    // Sort the checkedValues array in descending order
    checkedValues.sort((a, b) => b - a);

    for (const preferenceValue of checkedValues) {
        try {
            // Fetch users from the server for each preference value
            const response = await fetch(`/users-with-shift-preference?column=${shift}&value=${preferenceValue}`);
            const users = await response.json();
            console.log(users);
            // Display users in the modal or any other element
            if (modalContent) {
                // Proceed with updating the modal content
                users.forEach(user => {
                    // Create a new div element with class "user-row"
                    const userRow = document.createElement('div');
                    userRow.className = 'user-row';
                    userRow.setAttribute('data-user-id', user.userId);

                    // Create a user element and set its text content
                    const userElement = document.createElement('div');
                    userElement.textContent = `ID: ${user.userId}, Name: ${user.vorname} ${user.nachname} _ ${user.schichten_count} FR ${user.fr_da_ab}-${user.fr_da_bis} SA ${user.sa_da_ab}-${user.sa_da_bis} SO ${user.so_da_ab}-${user.so_da_bis}`;

                    const line = document.createElement('hr');
                    userRow.appendChild(line);
                    // Append the user element to the user row
                    userRow.appendChild(userElement);

                    // Append the user row to the modal content
                    modalContent.appendChild(userRow);
                    crewList.appendChild(userRow);
                });
            } else {
                console.error('Modal content element not found.');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            // Handle error scenario
        }
    }
}

async function displaySelectedUser(shiftId) {
    try {
        // Fetch users from the server for each preference value
        const response = await fetch(`/fetch-shift-data-by-id?shiftId=${shiftId}`);
        const shiftData = await response.json();
        const selectedUserRow = document.getElementById("modal-selected-user");
        selectedUserRow.innerHTML = "";
        console.log(shiftData[0]);
        // Display users in the modal or any other element
        if (shiftData[0]) {
            selectedUserRow.innerHTML = `${shiftData[0].user_id}, ${shiftData[0].vorname} ${shiftData[0].nachname}`;

        } else {
            console.error('fetching selected user not found.');
        }
    } catch (error) {
        console.error('Error fetching selected user:', error);
        // Handle error scenario
    }
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

async function addUserToShift(shiftId, userId) {
    console.log("addUserToShift", shiftId, userId);
    try {
        const response = await fetch(`/add-user-to-shift?shiftId=${shiftId}&userId=${userId}`, { method: 'POST' });
        const data = await response.json();
        console.log(data);
        if (filledToggleIsActive) {
            colorFilledSlots();
        }

    } catch (error) {
        console.error('Error adding user to shift:', error);
        // Handle error scenario
    }
}

async function removeUserFromShift(shiftId, userId=null) {
    console.log("removeUserFromShift", shiftId, userId);
    try {
        const response = await fetch(`/remove-user-from-shift?shiftId=${shiftId}&userId=${userId}`, { method: 'POST' });
        const data = await response.json();
        console.log(data);
        if (filledToggleIsActive) {
            colorFilledSlots();
        }

    } catch (error) {
        console.error('Error removing user from shift:', error);
        // Handle error scenario
    }
}
var filledToggleIsActive = false;

async function toggleFilledSlots() {
    filledToggleIsActive = !filledToggleIsActive;
    if (filledToggleIsActive) {
        console.log("toggleFilledSlots");
        try {
            colorFilledSlots();
    
    
        } catch (error) {
            console.error('Error toggleFilledSlots:', error);
            // Handle error scenario
        }
    }
    else {
        formatGantChart();
    }
}

async function colorFilledSlots() {
    // Fetch shift preferences data
    const response = await fetch('/fetch-all-filled-slots');
    const data = await response.json();
    console.log(data);
    const scheduleData = $("#schedule-fr").timeSchedule('scheduleData');
    // console.log(scheduleData);

    // Create a set of schedule data IDs for quick lookup
    const scheduleIds = new Set(data.map(d => d.test_schichten_id));
    console.log(scheduleIds);
    document.querySelectorAll('.sc_bar').forEach(function(bar) {
        var shiftId = parseInt(bar.getAttribute('shiftid'));
        bar.style.backgroundColor = 'grey';
        if (scheduleIds.has(shiftId)) {
            bar.style.backgroundColor = 'green';
        }
    });
}

// Function to add hover event listeners to all sc_bar elements
function addHoverListeners() {
    // Get all elements with the class 'sc_bar'
    const bars = document.querySelectorAll('.sc_bar');

    // Add a mouseover event listener to each sc_bar element
    bars.forEach(bar => {
        bar.addEventListener('mouseover', function() {
            console.log(checkedValues);

            if (isHoverActivated) {
                const shiftOrt = this.getAttribute('shiftOrt');
                const shiftId = this.getAttribute('shiftId');
                // Log the shiftId attribute of the hovered element
                // console.log(this.getAttribute('shiftid'));
                // console.log(this.getAttribute('shiftOrt'));
                displayUsersWithShiftPreference(shiftOrt, checkedValues);
                // formatGantChart();
            }
            
        });
    });

    overlay.addEventListener("click", () => {
        overlay.style = "display:none";
    })
}







async function initializeTimeScheduleFr() {
    try {
        console.log("try to load shift data FR");

        initializeTimeSchedule("#schedule-fr", "FR");

        const shiftData = await fetchShiftData("/fetch-gantt-data-fr");
        const groupedShiftData = groupShiftDataByOrt(shiftData);
        populateSchedule("#schedule-fr", groupedShiftData);


        
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
async function initializeTimeScheduleSa() {
    try {
        console.log("try to load shift data SA");

        initializeTimeSchedule("#schedule-sa", "SA");

        const shiftData = await fetchShiftData("/fetch-gantt-data-sa");
        const groupedShiftData = groupShiftDataByOrt(shiftData);
        populateSchedule("#schedule-sa", groupedShiftData);


        
    } catch (error) {
        console.error("Error occurred:", error);
    }
}
async function initializeTimeScheduleSo() {
    try {
        console.log("try to load shift data SO");

        initializeTimeSchedule("#schedule-so", "SO");

        const shiftData = await fetchShiftData("/fetch-gantt-data-so");
        const groupedShiftData = groupShiftDataByOrt(shiftData);
        populateSchedule("#schedule-so", groupedShiftData);


        
    } catch (error) {
        console.error("Error occurred:", error);
    }
}



function initializeTimeSchedule(selector, day) {
    $(selector).timeSchedule({
        startTime: "06:00",
        endTime: "31:00",
        widthTime: 60 * 60,
        widthTimeX: 60,
        draggable: true,
        resizable: true,
        resizableLeft: true,
        timeLineY: 60,
        onChange: function (node, data) {
            console.log("onChange", data);
            adjustRowHeights(61);
            handleScheduleChange(data);
        },
        onInitRow: function (node, data) {},
        onClick: function (node, data) {
            handleScheduleClick(data);
        },
        onAppendRow: function (node, data) {},
        onAppendSchedule: function (node, data) {},
        onScheduleClick: function (node, timeline, time) {
            handleEmptyCellClick(timeline, time);
        },
    });
}

async function fetchShiftData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}

function groupShiftDataByOrt(shiftData) {
    const groupedShiftData = {};
    shiftData.forEach((slot) => {
        if (!groupedShiftData[slot.schicht_ort]) {
            groupedShiftData[slot.schicht_ort] = [];
        }
        groupedShiftData[slot.schicht_ort].push(slot);
    });
    return groupedShiftData;
}

function populateSchedule(selector, groupedShiftData) {
    let rowIndex = 0;

    Object.keys(groupedShiftData).forEach((schichtOrt) => {
        const rows = groupSlotsIntoRows(groupedShiftData[schichtOrt]);
        const rowsData = formatRowsData(rows);

        rowsData.forEach((rowData) => {
            $(selector).timeSchedule("addRow", rowIndex++, {
                title: rowData.title,
                schedule: rowData.schedule,
            });
        });
    });
}

function groupSlotsIntoRows(shiftDataArray) {
    const rows = [];
    shiftDataArray.forEach((slot) => {
        let addedToExistingRow = false;

        for (const row of rows) {
            if (!doesSlotOverlap(slot, row)) {
                row.push(slot);
                addedToExistingRow = true;
                break;
            }
        }

        if (!addedToExistingRow) {
            rows.push([slot]);
        }
    });
    return rows;
}

function doesSlotOverlap(slot, row) {
    return row.some(existingSlot => 
        slot.start_time < existingSlot.end_time && 
        slot.end_time > existingSlot.start_time
    );
}

function formatRowsData(rows) {
    return rows.map((row) => {
        const scheduleData = row.map(formatSlot);
        const title = row[0].schicht_ort;
        return {
            title: title,
            schedule: scheduleData,
        };
    });
}

function formatSlot(slot) {
    let startTime = new Date(slot.start_time);
    let endTime = new Date(slot.end_time);

    let formattedStartTime = formatTime(startTime);
    let formattedEndTime = formatTime(endTime);

    return {
        start: formattedStartTime,
        end: formattedEndTime,
        text: `${slot.schicht_ort}-${formattedStartTime}`,
        data: {
            id: slot.id,
            tag: slot.schicht_tag,
            ort: slot.schicht_ort,
        },
    };
}

function formatTime(date) {
    let formattedTime = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (timeStringToMinutes(formattedTime) < timeStringToMinutes("07:00")) {
        formattedTime = add24Hours(formattedTime);
    }
    return formattedTime;
}

function handleScheduleClick(data) {
    displaySelectedUser(data.data.id);
    overlay.style = "display:block";
    displayUsersWithShiftPreference(data.data.ort, checkedValues)
        .then(() => {
            addButtonsToUserRows(data.data.id);
        })
        .catch(error => {
            console.error('Error displaying users:', error);
        });

    const button = createButton("Delete Shift", () => deleteShift(data.data.id));
    modalMenu.appendChild(button);
    console.log("onClick", data);
}

function handleEmptyCellClick(timeline, time) {
    openModal();
    const button = createButton('Add Shift', () => {
        addShiftSlot(timeline, time);
        closeModal();
    });
    modalMenu.appendChild(button);
    console.log("onScheduleClick", timeline, time);
}

function addButtonsToUserRows(shiftId) {
    const userRows = document.querySelectorAll('.user-row');

    userRows.forEach(userRow => {
        const userId = userRow.getAttribute('data-user-id');
        const addButton = createShiftButton("+", () => addUserToShift(shiftId, userId));
        const removeButton = createShiftButton("-", () => removeUserFromShift(shiftId, userId));

        userRow.appendChild(addButton);
        userRow.appendChild(removeButton);
    });
}

function createShiftButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add("dos-button");
    button.addEventListener('click', onClickHandler);
    return button;
}
