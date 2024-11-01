const form = document.getElementById('beneficiaryForm');
const tableBody = document.querySelector('#beneficiaryTable tbody');

// Fetch beneficiaries on page load
document.addEventListener('DOMContentLoaded', fetchBeneficiaries);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('beneficiaryName').value;
    const location = document.getElementById('beneficiaryLocation').value;

    console.log('Submitting:', { name, location });  // Log the submitted values

    const response = await fetch('http://localhost:3000/beneficiaries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, location })
    });

    console.log('Response status:', response.status); // Log response status

    if (response.ok) {
        fetchBeneficiaries();
        form.reset();
    } else {
        console.error('Failed to add beneficiary:', response.statusText);
    }
});

// Function to fetch and display beneficiaries
async function fetchBeneficiaries() {
    const response = await fetch('http://localhost:3000/beneficiaries/data'); // Adjusted endpoint
    const beneficiaries = await response.json();

    console.log('Fetched beneficiaries:', beneficiaries); // Log the fetched data

    tableBody.innerHTML = ''; // Clear existing table rows
    beneficiaries.forEach(beneficiary => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${beneficiary.id}</td>
            <td>${beneficiary.name}</td>
            <td>${beneficiary.location}</td>
            <td>
                <button onclick="deleteBeneficiary(${beneficiary.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row); // Add new row to the table
    });
} 
async function deleteBeneficiary(id) {
    const response = await fetch(`http://localhost:3000/beneficiaries/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        console.log(`Beneficiary with ID ${id} deleted successfully.`);
        fetchBeneficiaries(); // Refresh the beneficiary list
    } else {
        console.error(`Failed to delete beneficiary: ${response.statusText}`);
    }
}