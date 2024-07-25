// Import express
const express = require('express');
const path = require('path');

// Create an express application
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Optionally, define a route for the game's entry point, e.g., index.html
app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
