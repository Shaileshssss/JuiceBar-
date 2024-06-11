const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Shi#123$', // Replace with your MySQL password
    database: 'shopping_cart' // Ensure this matches your database name
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Endpoint to save cart items
app.post('/save-cart', (req, res) => {
    const cartItems = req.body.cartItems;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).send('No cart items to save.');
    }

    const query = 'INSERT INTO cart_items (product, price, quantity) VALUES ?';
    const values = cartItems.map(item => [item.product, item.price, item.quantity]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to save cart items.');
        }
        res.status(200).send('Cart items saved successfully.');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});
