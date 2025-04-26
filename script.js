FHIR.oauth2.ready()
    .then(function (client) {
        console.log("SMART client ready:", client);

        if (!client.patient || !client.patient.id) {
            throw new Error("No patient ID found in context");
        }

        return client.request(`Patient/${client.patient.id}`);
    })
    .then(function (patient) {
        console.log("Fetched patient:", patient);

        const appDiv = document.getElementById('app');
        const name = patient.name && patient.name.length > 0 ?
            `${patient.name[0].given.join(' ')} ${patient.name[0].family}` :
            'No name found';
        const gender = patient.gender || 'Unknown gender';
        const birthDate = patient.birthDate || 'Unknown birth date';

        appDiv.innerHTML = `
        <h2>Patient Information</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Gender:</strong> ${gender}</p>
        <p><strong>Birth Date:</strong> ${birthDate}</p>
    `;
    })
    .catch(function (error) {
        console.error("Error loading patient:", error);
        document.getElementById('app').innerHTML = `
        <p><strong>Error loading patient data:</strong> ${error.message}</p>
    `;
    });
