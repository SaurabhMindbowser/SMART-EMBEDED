// SMART App configuration
const smartSettings = {
    clientId: '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7', // Your Client ID
    scope: 'launch/patient patient/*.read openid profile offline_access', // Added openid, profile for Cerner
    redirectUri: 'https://saurabhmindbowser.github.io/SMART-EMBEDED/'
};

console.log('SMART App initializing...');

// Initiate authorization if needed
FHIR.oauth2.authorize({
    clientId: smartSettings.clientId,
    scope: smartSettings.scope,
    redirectUri: smartSettings.redirectUri
});

// After successful login
FHIR.oauth2.ready().then(client => {
    console.log('FHIR client is ready!');
    console.log('Client Details:', client);

    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Fetching patient data...';

    // Debugging Tokens
    console.log('Access Token:', client.state.tokenResponse.access_token);
    console.log('ID Token:', client.state.tokenResponse.id_token);
    console.log('Patient ID:', client.patient.id);

    if (!client.patient || !client.patient.id) {
        console.error('No patient ID available.');
        statusDiv.textContent = 'No patient ID found.';
        return;
    }

    // Fetch patient data
    client.request(`Patient/${client.patient.id}`)
        .then(patient => {
            console.log('Patient fetched:', patient);

            document.getElementById('patient-name').textContent = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
            document.getElementById('patient-dob').textContent = patient.birthDate;
            document.getElementById('patient-gender').textContent = patient.gender;

            document.getElementById('status').style.display = 'none';
            document.getElementById('patient-info').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching patient:', error);
            statusDiv.textContent = 'Error fetching patient. See console.';
        });

}).catch(error => {
    console.error('FHIR client failed to initialize:', error);
    document.getElementById('status').textContent = 'Initialization failed. See console.';
});
