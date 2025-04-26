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

                    // Displaying basic patient info
                    document.getElementById('patient-name').textContent = `${patient.name[0].given.join(' ')} ${patient.name[0].family}`;
                    document.getElementById('patient-birthDate').textContent = patient.birthDate;
                    document.getElementById('patient-gender').textContent = patient.gender;

                    // Displaying additional patient info
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

                    if (patient.managingOrganization) {
                        document.getElementById('patient-organization').textContent = patient.managingOrganization.display;
                    } else {
                        document.getElementById('patient-organization').textContent = "No organization available";
                    }

                    // Marital Status
                    if (patient.maritalStatus) {
                        document.getElementById('patient-maritalStatus').textContent = patient.maritalStatus.text || "Not specified";
                    } else {
                        document.getElementById('patient-maritalStatus').textContent = "Not specified";
                    }

                    // Language
                    if (patient.communication && patient.communication.length > 0) {
                        document.getElementById('patient-language').textContent = patient.communication[0].language.text || "No language specified";
                    } else {
                        document.getElementById('patient-language').textContent = "No language specified";
                    }

                    // Contact Information (if available)
                    if (patient.contact && patient.contact.length > 0) {
                        let contactInfo = patient.contact[0].telecom ? patient.contact[0].telecom[0].value : "No contact information available";
                        document.getElementById('patient-contactInfo').textContent = contactInfo;
                    } else {
                        document.getElementById('patient-contactInfo').textContent = "No contact information available";
                    }

                    // Conditions (if available)
                    client.request(`Condition?patient=${patient.id}`)
                        .then(conditions => {
                            if (conditions.entry && conditions.entry.length > 0) {
                                const conditionList = conditions.entry.map(condition => condition.resource.code.text).join(', ');
                                document.getElementById('patient-conditions').textContent = conditionList;
                            } else {
                                document.getElementById('patient-conditions').textContent = "No conditions available";
                            }

                            document.getElementById('status').style.display = 'none';
                            document.getElementById('patient-info').style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error fetching Conditions:', error);
                            document.getElementById('patient-conditions').textContent = 'Failed to fetch conditions.';
                        });

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
