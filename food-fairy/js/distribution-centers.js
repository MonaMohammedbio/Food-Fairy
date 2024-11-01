const form = document.getElementById('distributionCenterForm');
const tableBody = document.querySelector('#distributionCenterTable tbody');

// Fetch distribution centers on page load
document.addEventListener('DOMContentLoaded', fetchDistributionCenters);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('distributionCenterName').value;
    const location = document.getElementById('distributionCenterLocation').value;

    if (!name || !location) {
        alert('Please fill in all fields.');
        return;
    }

    console.log('Submitting:', { name, location }); // Log the submitted values

    try {
        const response = await fetch('http://localhost:3000/distribution-centers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, location })
        });

        console.log('Response status:', response.status); // Log response status

        if (response.ok) {
            fetchDistributionCenters(); // Refresh the distribution center list
            form.reset(); // Clear the form
        } else {
            const errorData = await response.json();
            alert(`Failed to add distribution center: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error adding distribution center:', error);
        alert('An error occurred while adding the distribution center.');
    }
});

// Function to fetch and display distribution centers
async function fetchDistributionCenters() {
    try {
        const response = await fetch('http://localhost:3000/distribution-centers'); // Ensure this endpoint exists
        const centers = await response.json();

        console.log('Fetched distribution centers:', centers); // Log the fetched data

        tableBody.innerHTML = ''; // Clear existing table rows
        centers.forEach(center => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${center.id}</td>
                <td>${center.name}</td>
                <td>${center.location}</td>
                <td>
                    <button onclick="confirmDelete(${center.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row); // Add new row to the table
        });
    } catch (error) {
        console.error('Error fetching distribution centers:', error);
        alert(`An error occurred while fetching distribution centers: ${error.message}`);
    }
}

// Function to confirm deletion of a distribution center
function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this distribution center?')) {
        deleteDistributionCenter(id);
    }
}

// Function to delete a distribution center
async function deleteDistributionCenter(id) {
    try {
        const response = await fetch(`http://localhost:3000/distribution-centers/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Distribution center with ID ${id} deleted successfully.`);
            fetchDistributionCenters(); // Refresh the distribution center list
        } else {
            const errorData = await response.json();
            alert(`Failed to delete distribution center: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting distribution center:', error);
        alert('An error occurred while deleting the distribution center.');
    }
}
