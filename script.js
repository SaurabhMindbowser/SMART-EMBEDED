// Wait for OAuth2 launch to complete
FHIR.oauth2.ready()
    .then(function(client) {
        console.log("SMART client ready", client);

        // Read the Patient resource
        return client.request("Patient/" + client.patient.id);
    })
    .then(function(patient) {
        console.log("Patient resource", patient);
        
        // Render patient info
        const appDiv = document.getElementById('app');
        const name = patient.name && patient.name.length > 0 ? 
                     patient.name[0].given.join(' ') + ' ' + patient.name[0].family :
                     'Name not available';
        const gender = patient.gender || 'Gender not available';
        const birthDate = patient.birthDate || 'Birth Date not available';

        appDiv.innerHTML = `
            <h2>Patient Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Gender:</strong> ${gender}</p>
            <p><strong>Birth Date:</strong> ${birthDate}</p>
        `;
    })
    .catch(function(error) {
        console.error("Failed to load Patient", error);
        document.getElementById('app').innerHTML = "<p>Error loading patient data.</p>";
    });
