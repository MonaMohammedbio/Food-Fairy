const form = document.getElementById('deliveryRecordForm');
const tableBody = document.querySelector('#deliveryRecordTable tbody');

// Fetch delivery records on page load
document.addEventListener('DOMContentLoaded', fetchDeliveryRecords);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const donor_id = document.getElementById('donor_id').value;
    const beneficiary_id = document.getElementById('beneficiary_id').value;
    const distribution_center_id = document.getElementById('distribution_center_id').value;

    if (!date || !donor_id || !beneficiary_id || !distribution_center_id) {
        alert('Please fill in all fields.');
        return;
    }
    console.log('Submitting:', { date, donor_id,beneficiary_id,distribution_center_id}); // Log the submitted values

    try {
        const response = await fetch('http://localhost:3000/delivery-records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, donor_id,beneficiary_id,distribution_center_id })
        });

          console.log('Response status:', response.status);
      

        if (response.ok) {
            fetchDeliveryRecords(); 
            form.reset(); 
        } else {
            const errorData = await response.json();
            alert(`Failed to add delivery record: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error adding delivery record:', error);
        alert('An error occurred while adding the delivery record.');
    }
});

// Function to fetch and display delivery records
async function fetchDeliveryRecords() {
    const response = await fetch('http://localhost:3000/delivery-records'); // Adjusted endpoint
    const records = await response.json();

    console.log('Fetched delivery records:', records); // Log the fetched data
     

        tableBody.innerHTML = ''; // Clear existing table rows
       records.forEach(record => {
    console.log('Record:', record); // Log each record to check its structure
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${record.id}</td>
        <td>${record.date}</td>
        <td>${record.donor_id}</td>
        <td>${record.beneficiary_id}</td>
        <td>${record.distribution_center_id}</td>
        <td>
            <button onclick="confirmDelete(${record.id})">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
});

    } 

// Function to confirm deletion of a delivery record
function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this delivery record?')) {
        deleteDeliveryRecord(id);
    }
}



// Function to delete a delivery Record
async function deleteDeliveryRecord(id) {
    try {
        const response = await fetch(`http://localhost:3000/delivery-records/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Delivery record with ID ${id} deleted successfully.`);
            fetchDeliveryRecords(); // Refresh the delivery record list
        } else {
            const errorData = await response.json();
            alert(`Failed to delete delivery record: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting delivery record:', error);
        alert('An error occurred while deleting the delivery record.');
    }
}