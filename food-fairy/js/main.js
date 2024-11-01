async function fetchData(route) {
    const response = await fetch(`/${route}`);
    return await response.json();
}

async function createRecord(route, data) {
    await fetch(`/${route}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    loadRecords(route);
}

async function deleteRecord(route, id) {
    await fetch(`/${route}/${id}`, {
        method: 'DELETE'
    });
    loadRecords(route);
}

function loadRecords(route) {
    fetchData(route).then(records => {
        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = '';
        records.forEach(record => {
            const row = document.createElement('tr');
            for (const key in record) {
                const cell = document.createElement('td');
                cell.textContent = record[key];
                row.appendChild(cell);
            }
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteRecord(route, record.id);
            const cell = document.createElement('td');
            cell.appendChild(deleteButton);
            row.appendChild(cell);
            tableBody.appendChild(row);
        });
    });
}
