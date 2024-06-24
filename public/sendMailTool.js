
// Function to fetch shift preferences data from the backend
async function sendMail() {
    




    try {
        // Fetch shift preferences data
        const response = await fetch('/fetch-filtered-user-data');
        const data = await response.json();
        console.log('Fetched all user data :', data);


    } catch (error) {
        console.error('Error fetching :', error);
        // Handle error, show alert or take appropriate action
    }
}

// Event listener for DOMContentLoaded event
window.addEventListener('DOMContentLoaded', function () {


    sendMail();


});