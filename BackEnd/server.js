const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const loginRoutes = require('./routes/login'); // Import login routes
const registerRoutes = require('./Routes/registerbackend');
const scheduleRoutes = require('./Routes/schedule');
const teamsRouter = require('./Routes/teams');
const statsRoutes = require('./Routes/statsRoutes');
const viewScheduleRoutes = require('./Routes/viewSchedule');
const createTeamRoutes = require('./Routes/CreateTeam'); // Import your CreateTeam route
const db = require('./db');  // Import the DB connection

const app = express();
const port = 5001;

// CORS middleware configuration
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests only from your frontend
  methods: ['GET', 'POST'],
  credentials: true,
}));

// Middleware
app.use(bodyParser.json()); // Use body parser middleware for POST requests

// API Routes
app.use('/api', loginRoutes);
app.use('/api', registerRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', teamsRouter);
app.use('/api', viewScheduleRoutes);
app.use('/api', createTeamRoutes);
app.use('/api', statsRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
