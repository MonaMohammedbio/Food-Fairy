// register.js
// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('http://localhost:3000/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password })
//         });

//         const data = await response.json(); // Parse JSON response

//         if (response.ok) {
//             alert('Registration successful!');
//             window.location.href = 'login.html'; // Redirect to login
//         } else {
//             alert(`Registration failed: ${data.message || 'Unknown error'}`); // Show error message
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('An error occurred during registration.');
//     }
// });
// Path: js/register.js
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(`User registered successfully! User ID: ${data.id}`);
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert('Error registering user. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server error. Please try again later.');
    }
});
