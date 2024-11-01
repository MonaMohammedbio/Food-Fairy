const form = document.getElementById('foodTypeForm');
const tableBody = document.querySelector('#foodTypeTable tbody');

// Fetch foodTypes on page load
document.addEventListener('DOMContentLoaded', fetchFoodTypes);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('foodTypeName').value;
  

    if (!name ) {
        alert('Please fill in all field.');
        return;
    }

    console.log('Submitting:', { name }); // Log the submitted values

    try {
        const response = await fetch('http://localhost:3000/food-Types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        console.log('Response status:', response.status); // Log response status

        if (response.ok) {
            fetchFoodTypes(); // Refresh the food type list
            form.reset(); // Clear the form
        } else {
            const errorData = await response.json();
            alert(`Failed to add food type: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error adding food type:', error);
        alert('An error occurred while adding the food type.');
    }
});

// Function to fetch and display food types
async function fetchFoodTypes() {
    try {
        const response = await fetch('http://localhost:3000/food-types'); // Ensure this endpoint exists
        const types = await response.json();

        console.log('Fetched food types:', types); // Log the fetched data

        tableBody.innerHTML = ''; // Clear existing table rows
     types.forEach(type => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${type.id}</td>
                <td>${type.name}</td>
                
                <td>
                    <button onclick="confirmDelete(${type.id})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row); // Add new row to the table
        });
    } catch (error) {
        console.error('Error fetching food types:', error);
        alert(`An error occurred while fetching food types: ${error.message}`);
    }
}

// Function to confirm deletion of a food type

function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this food type?')) {
        deleteFoodType(id);
    }
}

// Function to delete a food type
async function deleteFoodType(id) {
    try {
        const response = await fetch(`http://localhost:3000/food-types/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Food type with ID ${id} deleted successfully.`);
            fetchFoodTypes(); // Refresh the food type list
        } else {
            const errorData = await response.json();
            alert(`Failed to delete food type: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting food type:', error);
        alert('An error occurred while deleting the food type.');
    }
}
