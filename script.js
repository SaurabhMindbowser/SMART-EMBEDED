// Configuration for SMART on FHIR app
const app = new SmartApp({
    client_id: '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7', // Replace with your client ID
    redirect_uri: 'https://5898-116-75-133-114.ngrok-free.app/callback', // Replace with your redirect URI
    scope: 'patient/*.read', // Make sure you have the appropriate scope
    fhirVersion: '4.0.1', // FHIR version to use
});

let patient = null;

// Function to fetch patient data after SMART on FHIR is initialized
function fetchPatientData() {
    // Check if the SMART app is ready
    if (app.ready()) {
        app.patient.read().then((patientData) => {
            patient = patientData;

            // Display patient info
            document.getElementById('patient-name').textContent = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
            document.getElementById('patient-dob').textContent = patient.birthDate;
            document.getElementById('patient-gender').textContent = patient.gender;

        }).catch((err) => {
            console.error('Error fetching patient data:', err);
            alert('Error fetching patient data. Please try again.');
        });
    } else {
        alert('SMART on FHIR app is not ready.');
    }
}

// Listen to the button click to load patient data
document.getElementById('load-patient-data').addEventListener('click', fetchPatientData);

// Initialize the SMART app
app.init();
