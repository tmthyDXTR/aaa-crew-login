// Function to fetch shift preferences data from the backend
async function fetchShiftPreferences() {
    try {
        // Fetch shift preferences data
        const response = await fetch('/fetch-shift-preferences');
        const shiftData = await response.json();

        console.log("Shift data:", JSON.stringify(shiftData));
        console.log(shiftData.schicht_viererSchicht);
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