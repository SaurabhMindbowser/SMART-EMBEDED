console.log("SMART App initializing...");

if (window.location.href.includes('code=') || window.location.href.includes('state=')) {
    console.log('Detected OAuth2 callback...');

    FHIR.oauth2.ready()
        .then(client => {
            console.log('FHIR Client Ready:', client);

            document.getElementById('status').textContent = 'Fetching Patient and Provider Details...';
            console.log('Access Token:', client.state.tokenResponse.access_token);
            console.log('Patient ID:', client.patient.id);

            // Fetch Patient List (Assuming you want all patients related to the provider or context)
            client.request(`Patient?_count=5`)  // Fetch 5 patients as an example
                .then(patients => {
                    console.log('Fetched Patients:', patients);
                    const patientCards = document.getElementById('patient-cards');
                    patientCards.innerHTML = '';  // Clear previous results

                    // Displaying patient details
                    patients.entry.forEach(patient => {
                        const card = document.createElement('div');
                        card.classList.add('patient-card');
                        card.innerHTML = `
                            <h3>${patient.resource.name[0].given.join(' ')} ${patient.resource.name[0].family}</h3>
                            <p><strong>Birth Date:</strong> ${patient.resource.birthDate}</p>
                            <p><strong>Gender:</strong> ${patient.resource.gender}</p>
                            <p><strong>Address:</strong> ${patient.resource.address ? patient.resource.address[0].line.join(', ') : 'N/A'}</p>
                        `;
                        patientCards.appendChild(card);
                    });

                    document.getElementById('patients-list').style.display = 'block';
                    document.getElementById('status').style.display = 'none';
                })
                .catch(error => {
                    console.error('Error fetching Patients:', error);
                    document.getElementById('status').textContent = 'Failed to fetch patients.';
                });

            // Fetch Provider Info (Practitioner)
            client.request(`Practitioner/${client.patient.providerId}`)  // Assuming you have provider ID in the patient's info
                .then(provider => {
                    console.log('Fetched Provider:', provider);
                    document.getElementById('provider-name').textContent = provider.name[0].given.join(' ') + " " + provider.name[0].family;
                    document.getElementById('provider-specialty').textContent = provider.specialty ? provider.specialty.map(s => s.text).join(', ') : 'Not available';
                    document.getElementById('provider-location').textContent = provider.address ? provider.address[0].city : 'Not available';

                    document.getElementById('provider-info').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error fetching Provider:', error);
                    document.getElementById('provider-info').style.display = 'none';
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
