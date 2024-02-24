window.addEventListener('DOMContentLoaded', async () => {
    try {
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


    } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error, show alert or take appropriate action
    }
});
