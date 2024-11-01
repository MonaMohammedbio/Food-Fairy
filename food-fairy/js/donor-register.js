document.getElementById('donor-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('donor-name').value;
    const contact = document.getElementById('donor-contact').value;

    fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, contact })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('donor-message').textContent = `Donor Registered: ${data.name}`;
        document.getElementById('donor-form').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('donor-message').textContent = 'Error registering donor.';
    });
});
