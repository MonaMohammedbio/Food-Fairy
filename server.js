const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
 
const bcrypt = require('bcryptjs'); // Use bcryptjs instead

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '01094765812Moni', // Update with your MySQL password
    database: 'food_fairy'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// -------- User Registration Route --------

// Register a new user
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, hashedPassword], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ id: results.insertId, name, email });
    });
});

// -------- User Login Route --------

// Login a user
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Query to find the user by email
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a token (this could be a JWT in a real application)
        const token = 'dummy-token'; // Replace with actual token generation logic (e.g., JWT)

        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    });
});



// -------- Donors Routes --------

// Serve the donors HTML page
app.get('/donors', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'donors.html'));
});

// Get all donors data
app.get('/donors/data', (req, res) => {
    db.query('SELECT * FROM donors', (err, results) => {
        if (err) {
            console.error('Error fetching donors:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// Add a new donor
app.post('/donors', (req, res) => {
    const { name, contact } = req.body;
    const query = 'INSERT INTO donors (name, contact) VALUES (?, ?)';

    db.query(query, [name, contact], (err, results) => {
        if (err) {
            console.error('Error inserting donor:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ id: results.insertId, name, contact });
    });
});

// Delete a donor by ID
app.delete('/donors/:id', (req, res) => {
    db.query('DELETE FROM donors WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting donor:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.sendStatus(204);
    });
});

// -------- Beneficiaries Routes --------

app.get('/beneficiaries/data', (req, res) => {
    db.query('SELECT * FROM beneficiaries', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/beneficiaries', (req, res) => {
    const { name, location } = req.body;
    const query = 'INSERT INTO beneficiaries (name, location) VALUES (?, ?)';

    db.query(query, [name, location], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.status(201).json({ id: results.insertId, name, location });
    });
});

app.delete('/beneficiaries/:id', (req, res) => {
    db.query('DELETE FROM beneficiaries WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

// -------- Distribution Centers Routes --------

app.get('/distribution-centers', (req, res) => {
    db.query('SELECT * FROM distribution_centers', (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        res.json(results);
    });
});

app.post('/distribution-centers', (req, res) => {
    const { name, location } = req.body;
    const query = 'INSERT INTO distribution_centers (name, location) VALUES (?, ?)';

    db.query(query, [name, location], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.status(201).json({ id: results.insertId, name, location });
    });
});

app.delete('/distribution-centers/:id', (req, res) => {
    db.query('DELETE FROM distribution_centers WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

// -------- Food Types Routes --------

app.get('/food-types', (req, res) => {
    db.query('SELECT * FROM food_types', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/food-types', (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO food_types (name) VALUES (?)';

    db.query(query, [name], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.status(201).json({ id: results.insertId, name });
    });
});

app.delete('/food-types/:id', (req, res) => {
    db.query('DELETE FROM food_types WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

// -------- Delivery Records Routes --------

app.get('/delivery-records', (req, res) => {
    const query = 'SELECT * FROM delivery_records';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching delivery records:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

app.post('/delivery-records', (req, res) => {
    const { date, donor_id, beneficiary_id, distribution_center_id } = req.body;
    const query = 'INSERT INTO delivery_records (date, donor_id, beneficiary_id, distribution_center_id) VALUES (?, ?, ?, ?)';

    db.query(query, [date, donor_id, beneficiary_id, distribution_center_id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.status(201).json({ id: results.insertId, date, donor_id, beneficiary_id, distribution_center_id });
    });
});

app.delete('/delivery-records/:id', (req, res) => {
    db.query('DELETE FROM delivery_records WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});
// -------- Food Listings Routes --------

// Get all food listings
app.get('/food-listings', (req, res) => {
    db.query('SELECT * FROM food_listings', (err, results) => {
        if (err) {
            console.error('Error fetching food listings:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// Add a new food listing
app.post('/food-listings', (req, res) => {
    const { name, description, quantity } = req.body;
    const query = 'INSERT INTO food_listings (name, description, quantity) VALUES (?, ?, ?)';

    db.query(query, [name, description, quantity], (err, results) => {
        if (err) {
            console.error('Error inserting food listing:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(201).json({ id: results.insertId, name, description, quantity });
    });
});
app.delete('/food-listings/:id', (req, res) => {
    db.query('DELETE FROM food_listings WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
