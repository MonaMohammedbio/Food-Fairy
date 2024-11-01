const form = document.getElementById('donorForm');
const tableBody = document.querySelector('#donorTable tbody');

// Fetch donors on page load
document.addEventListener('DOMContentLoaded', fetchDonors);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('donorName').value;
    const contact = document.getElementById('donorContact').value;

    console.log('Submitting:', { name, contact }); // Log the submitted values

    const response = await fetch('http://localhost:3000/donors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, contact })
    });

    console.log('Response status:', response.status); // Log response status

    if (response.ok) {
        fetchDonors();
        form.reset();
    } else {
        console.error('Failed to add donor:', response.statusText);
    }
});

// Function to fetch and display donors
async function fetchDonors() {
    const response = await fetch('http://localhost:3000/donors/data');
    const donors = await response.json();

    console.log('Fetched donors:', donors); // Log the fetched data

    tableBody.innerHTML = ''; // Clear existing table rows
    donors.forEach(donor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donor.id}</td>
            <td>${donor.name}</td>
            <td>${donor.contact}</td>
            <td>
                <button onclick="deleteDonor(${donor.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row); // Add new row to the table
    });
}

async function deleteDonor(id) {
    const response = await fetch(`http://localhost:3000/donors/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Donor with ID ${id} deleted successfully.`);
        fetchDonors(); // Refresh the donor list
    } else {
        console.error(`Failed to delete donor: ${response.statusText}`);
    }
}
