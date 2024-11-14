const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login'); // Import login routes
const registerRoutes = require('./Routes/registerbackend');
const scheduleRoutes = require('./Routes/schedule');
const teamsRouter = require('./Routes/teams');

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', registerRoutes);

// Use login routes
app.use('/api', loginRoutes); // Add '/api' prefix to all login routes
app.use('/api', registerRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', teamsRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
