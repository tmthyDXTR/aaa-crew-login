// Function to fetch shift preferences data from the backend
async function fetchShiftPreferences() {
    try {
        // Fetch shift preferences data
        const response = await fetch('/fetch-shift-preferences');
        const data = await response.json();
        const shiftData = data['userShiftPreferences'];
        const allUsers = data['allUsersInfo'];
        // console.log("userShiftPreferences:", JSON.stringify(shiftData));
        // console.log("userShiftPreferences:", JSON.stringify(allUsers));

        // Populate form fields with shift preferences data
        // Replace 'input[name=...]', 'select[name=...]', etc. with actual selectors for your form fields
        document.getElementById("viererSchicht"+shiftData.schicht_viererSchicht).checked = true;
        document.getElementById("eingangshäuschen"+shiftData.schicht_eingangshäuschen).checked = true;
        document.getElementById("greencamping"+shiftData.schicht_greencamping).checked = true;
        document.getElementById("nachtwache"+shiftData.schicht_nachtwache).checked = true;
        document.getElementById("küche"+shiftData.schicht_küche).checked = true;
        document.getElementById("künstlerbetreuung"+shiftData.schicht_künstlerbetreuung).checked = true;
        document.getElementById("personalbüro"+shiftData.schicht_personalbüro).checked = true;
        document.getElementById("kassenbüro"+shiftData.schicht_kassenbüro).checked = true;
        document.getElementById("parkplatz"+shiftData.schicht_parkplatz).checked = true;
        document.getElementById("flaschensammeln"+shiftData.schicht_flaschensammeln).checked = true;
        document.getElementById("ausschank"+shiftData.schicht_ausschank).checked = true;

        // Check radio buttons based on user data
        document.getElementById("schlafenDoJa").checked = shiftData.schlafenDo === 1;
        document.getElementById("schlafenDoNein").checked = shiftData.schlafenDo === 0;
        document.getElementById("schlafenFrJa").checked = shiftData.schlafenFr === 1;
        document.getElementById("schlafenFrNein").checked = shiftData.schlafenFr === 0;
        document.getElementById("schlafenSaJa").checked = shiftData.schlafenSa === 1;
        document.getElementById("schlafenSaNein").checked = shiftData.schlafenSa === 0;

        document.getElementById("frDaAb").value = shiftData.fr_da_ab;
        document.getElementById("frDaBis").value = shiftData.fr_da_bis;
        document.getElementById("saDaAb").value = shiftData.sa_da_ab;
        document.getElementById("saDaBis").value = shiftData.sa_da_bis;
        document.getElementById("soDaAb").value = shiftData.so_da_ab;
        document.getElementById("soDaBis").value = shiftData.so_da_bis;

        // Check if wunschkollegen_ids is not null or undefined
        if (shiftData.wunschkollegen_ids && typeof shiftData.wunschkollegen_ids === 'string') {
            // Parse wunschkollegen_ids into an array of numbers
            const wunschkollegenIds = shiftData.wunschkollegen_ids.split(',').map(id => parseInt(id));
            
            // Populate the select options
            allUsers.forEach(user => {
                const option = new Option(`${user.userId} - ${user.vorname} ${user.nachname}`, user.userId, wunschkollegenIds.includes(user.userId), wunschkollegenIds.includes(user.userId));
                $('#userSelect').append(option).trigger('change');
            });
        } else {
            console.log('wunschkollegen_ids is null or undefined'); // Handle or log the absence of wunschkollegen_ids
            // Populate the select options
            allUsers.forEach(user => {
                const option = new Option(`${user.userId} - ${user.vorname} ${user.nachname}`, user.userId, false, false);
                $('#userSelect').append(option).trigger('change');
            });
        }

        // Initialize Select2
        $('#userSelect').select2({
            placeholder: "Helfer:in IDs eingeben",
            allowClear: true,
        });


    } catch (error) {
        console.error('Error fetching shift preferences:', error);
        // Handle error, show alert or take appropriate action
    }
}

// Event listener for DOMContentLoaded event
window.addEventListener('DOMContentLoaded', function () {
    // Call fetchShiftPreferences function when the page is loaded
    fetchShiftPreferences();


});