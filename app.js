console.log("SMART App initializing...");

if (window.location.href.includes('code=') || window.location.href.includes('state=')) {
    console.log('Detected OAuth2 callback...');

    FHIR.oauth2.ready()
        .then(client => {
            console.log('FHIR Client Ready:', client);

            document.getElementById('status').textContent = 'Fetching Patient Details...';
            console.log('Access Token:', client.state.tokenResponse.access_token);
            console.log('Patient ID:', client.patient.id);

            client.request(`Patient/${client.patient.id}`)
                .then(patient => {
                    console.log('Fetched Patient:', patient);

                    document.getElementById('patient-name').textContent = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
                    document.getElementById('patient-birthDate').textContent = patient.birthDate;
                    document.getElementById('patient-gender').textContent = patient.gender;

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
    console.log('Before Authorize...');
    console.log('ClientId:', '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7');
    console.log('RedirectUri:', 'https://saurabhmindbowser.github.io/SMART-EMBEDED/');
    console.log('Current URL:', window.location.href);
    console.log('Starting authorization...');

    FHIR.oauth2.authorize({
        clientId: '0be0b3ac-b0ae-40da-97a3-d74a4b66f3d7',
        scope: 'launch/patient patient/*.read openid profile offline_access',
        redirectUri: 'https://saurabhmindbowser.github.io/SMART-EMBEDED/'
    });
}
