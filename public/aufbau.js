// Function to aufbau shift preferences data from the backend
async function fetchAufbauGroups()
{
    try
    {
        // Fetch shift preferences data
        const response = await fetch('/fetch-aufbau-groups');
        const data = await response.json();

        console.log("Aufbau data:", JSON.stringify(data));
        // Populate form fields with shift preferences data
        // Replace 'input[name=...]', 'select[name=...]', etc. with actual selectors for your form fields

        const tableBody = document.querySelector("#aufbauTable tbody");

        // Sort the aufbauData by date
        data.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });

        data.forEach(item =>
        {
            const row = document.createElement("tr");

            // Create the checkbox cell
            const selectCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = `select_${item.aufbau_id}`;
            checkbox.id = item.aufbau_id;
            selectCell.appendChild(checkbox);
            row.appendChild(selectCell);

            const tableContent = ['aufbau_name', 'aufbau_wann', 'aufbau_wieviel', 'aufbau_verantwortlich'];
            // Create cells for each data property
            Object.keys(item).forEach(key =>
            {
                if (tableContent.includes(key))
                {
                    const cell = document.createElement("td");
                    cell.textContent = item[key];
                    row.appendChild(cell);

                }
            });



            // Append the row to the table body
            tableBody.appendChild(row);
        });

    } catch (error)
    {
        console.error('Error fetching aufbau preferences:', error);
        // Handle error, show alert or take appropriate action
    }
}

async function fetchAufbauSelectionData()
{
    try
    {
        // Fetch shift preferences data
        const response = await fetch('/fetch-aufbau-selection-data');
        const data = await response.json();

        console.log("aufbau selection data:", JSON.stringify(data));
        // Populate form fields with shift preferences data
        // Replace 'input[name=...]', 'select[name=...]', etc. with actual selectors for your form fields

        const tableBody = document.querySelector("#aufbauTable tbody");
        // Count occurrences of each aufbau_id
        const aufbauCounts = {};
        data[0].forEach(userData =>
        {
            if (data[1] == userData.userId)
            {
                console.log("userData", userData.aufbau_ids);
                // Extract the aufbau_ids string from the JSON object
                const idsString = userData.aufbau_ids;
                // Split the string into an array of IDs
                const ids = idsString.split(',').map(id => id.trim());
                ids.forEach(id =>
                {
                    const checkbox = document.querySelector(`input[id="${id}"]`);
                    if (checkbox)
                    {
                        checkbox.checked = true;
                    }
                });
            }
            if (userData.aufbau_ids)
            {
                const ids = userData.aufbau_ids.split(',');
                ids.forEach(id =>
                {
                    aufbauCounts[id] = (aufbauCounts[id] || 0) + 1;
                });
            }
            // Update the table with the counts
            const rows = document.querySelectorAll('#aufbauTable tbody tr');
            rows.forEach(row =>
            {
                const checkbox = row.querySelector('input[type="checkbox"]');
                const id = checkbox.id;
                const countCell = row.children[3]; // Assuming 'wieviel' is the 4th column
                countCell.textContent = aufbauCounts[id] || 0;
            });
        });
    } catch (error)
    {
        console.error('Error fetching aufbau selection data:', error);
        // Handle error, show alert or take appropriate action
    }
}


// Event listener for DOMContentLoaded event
window.addEventListener('DOMContentLoaded', function ()
{
    // Call fetchAufbauGroups function when the page is loaded
    fetchAufbauGroups();
    // Fetch and update aufbau selection
    fetchAufbauSelectionData();

    let saveBtn = document.getElementById("submit-button");
    saveBtn.addEventListener("click", function (event)
    {
        console.log("save aufbau selection");
        // Get all selected checkboxes
        const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.id);

        // Convert selected IDs array to a comma-separated string
        const selectedIdsString = selectedIds.join(',');

        // Make an AJAX request to the backend to update the aufbau_ids
        fetch('/submit-aufbau-selection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ aufbauIds: selectedIdsString })
        }).then(response =>
        {
            if (response.ok)
            {
                console.log('Aufbau selection updated successfully.');
                // Redirect to home page after successful update
                window.location.href = '/home';
            } else
            {
                console.error('Error updating aufbau selection:', response.statusText);
            }
        })
            .catch(error =>
            {
                console.error('Error updating aufbau selection:', error);
            });

    });
});