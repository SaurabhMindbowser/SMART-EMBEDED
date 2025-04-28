console.log("SMART App initializing...");

// If the URL includes the OAuth2 callback parameters 'code' or 'state'
if (window.location.href.includes('code=') || window.location.href.includes('state=')) {
    console.log('Detected OAuth2 callback...');

    // OAuth2 flow is complete, handle the response
    FHIR.oauth2.ready()
        .then(client => {
            console.log('FHIR Client Ready:', client);

            // Fetch patient details using the client
            document.getElementById('status').textContent = 'Fetching Patient Details...';
            console.log('Access Token:', client.state.tokenResponse.access_token);
            console.log('Patient ID:', client.patient.id);

            client.request(`Patient/${client.patient.id}`)
                .then(patient => {
                    console.log('Fetched Patient:', patient);

                    // Displaying patient information
                    document.getElementById('patient-name').textContent = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
                    document.getElementById('patient-birthDate').textContent = patient.birthDate;
                    document.getElementById('patient-gender').textContent = patient.gender;

                    // More patient information like address, phone, etc.
                    if (patient.address && patient.address.length > 0) {
                        document.getElementById('patient-address').textContent = `${patient.address[0].line.join(', ')}, ${patient.address[0].city}, ${patient.address[0].state}`;
                    } else {
                        document.getElementById('patient-address').textContent = "No address available";
                    }

                    if (patient.telecom && patient.telecom.length > 0) {
                        document.getElementById('patient-phone').textContent = patient.telecom[0].value;
                    } else {
                        document.getElementById('patient-phone').textContent = "No phone available";
                    }

                    // Hide status and show patient info
                    document.getElementById('status').style.display = 'none';
                    document.getElementById('patient-info').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error fetching Patient:', error);
                    document.getElementById('status').textContent = 'Failed to fetch patient.';
                });
        })
        .catch(error => {
            console.error('OAuth2 Ready Error:', error);
            document.getElementById('status').textContent = 'OAuth2 Error';
        });
} else {
    // If OAuth2 code is not present, start the authorization flow
    console.log('Before Authorization...');
    console.log('ClientId:', '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7');
    console.log('RedirectUri:', 'https://saurabhmindbowser.github.io/SMART-EMBEDED/');
    console.log('Current URL:', window.location.href);
    console.log('Starting authorization...');

    // Start OAuth2 authorization
    FHIR.oauth2.authorize({
        clientId: '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7',
        scope: 'launch/patient patient/*.read openid profile offline_access',
        redirectUri: 'https://saurabhmindbowser.github.io/SMART-EMBEDED/'  // Ensure this is registered correctly in Cerner
    });
}
