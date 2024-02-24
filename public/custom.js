window.addEventListener('DOMContentLoaded', async () =>
{
    try
    {
        // Fetch user data'0'
        const response = await fetch('/fetch-user-data');
        const userData = await response.json();

        // Populate form fields with user data
        document.getElementById('vorname').value = userData.vorname;
        document.getElementById('nachname').value = userData.nachname;
        document.getElementById('spitzname').value = userData.spitzname;
        document.getElementById('geburtstdatum').value = userData.geburtstdatum;
        document.getElementById('handynr').value = userData.handynr;
        document.getElementById('wieOftDabei').value = userData.wieOftDabei;
        document.getElementById('essen').value = userData.essen;

        // Check radio buttons based on user data
        document.getElementById('ordnerJa').checked = userData.ordner === 1;
        document.getElementById('ordnerNein').checked = userData.ordner === 0;

        document.getElementById('kurierJa').checked = userData.kurier === 1;
        document.getElementById('kurierNein').checked = userData.kurier === 0;

        document.getElementById('aufbauJa').checked = userData.aufbau === 1;
        document.getElementById('aufbauNein').checked = userData.aufbau === 0;

        document.getElementById('festivalJa').checked = userData.festival === 1;
        document.getElementById('festivalNein').checked = userData.festival === 0;

        document.getElementById('schichtJa').checked = userData.schicht === 1;
        document.getElementById('schichtNein').checked = userData.schicht === 0;

        document.getElementById('abbauJa').checked = userData.abbau === 1;
        document.getElementById('abbauNein').checked = userData.abbau === 0;

        document.getElementById('veteranenJa').checked = userData.veteranen === 1;
        document.getElementById('veteranenNein').checked = userData.veteranen === 0;

        // Show profile picture if userPicLink exists
        if (userData.userPicLink) {
            const profilePicContainer = document.getElementById('profile-pic-container');
            const img = document.createElement('img');
            img.src = userData.userPicLink;
            img.alt = 'Profile Picture';
            profilePicContainer.appendChild(img);
        }
        showAlert("Daten Aktualisiert");

    } catch (error)
    {
        console.error('Error fetching user data:', error);
        // Handle error, show alert or take appropriate action
    }


    document.getElementById("alert-ok-button").addEventListener("click", function (event)
    {
        hideAlert();
    });
    document.getElementById('overlay').addEventListener('click', function(event) {
        console.log("test");

        event.preventDefault(); // Prevent the default action of the click event
        event.stopPropagation(); // Stop the event from propagating to underlying elements
    });
});

function showAlert(text = null)
{
    if (text)
    {
        document.getElementById("alert-content").innerHTML = text;
    }
    document.getElementById("alert-window").style = "display:block";
    document.getElementById("overlay").style = "display:block";
}
function hideAlert()
{
    document.getElementById("alert-window").style = "display:none";
    document.getElementById("overlay").style = "display:none";
}

// Add an event listener to the input field for dynamic validation
document
    .getElementById("handynr")
    .addEventListener("input", function (event)
    {
        // Get the input value
        let inputValue = event.target.value;

        // Remove any non-numeric characters using a regular expression
        let numericValue = inputValue.replace(/\D/g, "");

        // Update the input field value with the cleaned numeric value
        event.target.value = numericValue;
    });
