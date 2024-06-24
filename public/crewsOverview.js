document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/fetch-aufbau-crews-data')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            console.log(data);
            // Call the main function to update the crews overview
            updateCrewsOverview(data);

        })
        .catch(error => console.error('Error fetching aufbau crews data:', error));
});


// Function to group data by aufbau_id
function groupByAufbauId(data) {
    return data.reduce((acc, item) => {
        if (!acc[item.aufbau_name]) {
            acc[item.aufbau_name] = [];
        }
        acc[item.aufbau_name].push(item);
        return acc;
    }, {});
}

// Function to generate HTML content
function generateHtmlContent(groupedData) {
    const container = document.getElementById('crews-overview-container');
    container.innerHTML = ''; // Clear any existing content
    console.log(groupedData);
    for (const aufbauName in groupedData) {
        const aufbauGroup = groupedData[aufbauName];
        const mitglieder = groupedData[aufbauName].length;
        // Create a div for each aufbau_id group
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('aufbau-group');

        // Create a header for the group
        const header = document.createElement('h3');
        header.textContent = `${aufbauName} - ${mitglieder} Crewmitglieder`;
        groupDiv.appendChild(header);

        // Create a table for the group
        const table = document.createElement('table');

        // Create table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Vorname', 'Nachname', 'Handynr', 'Email'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement('tbody');
        
        aufbauGroup.forEach(member => {
            const row = document.createElement('tr');
            const cells = [
                member.vorname,
                member.nachname,
                member.handynr,
                member.user_email
            ];
            cells.forEach(cellText => {
                const td = document.createElement('td');
                td.textContent = cellText;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        groupDiv.appendChild(table);
        container.appendChild(groupDiv);
    }
}

// Main function to process data and update HTML
function updateCrewsOverview(jsonData) {
    const groupedData = groupByAufbauId(jsonData);
    generateHtmlContent(groupedData);
}

