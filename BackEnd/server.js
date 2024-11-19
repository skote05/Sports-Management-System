const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login'); // Import login routes
const registerRoutes = require('./Routes/registerbackend');
const scheduleRoutes = require('./Routes/schedule');
const teamsRouter = require('./Routes/teams');
const statsRoutes = require('./Routes/statsRoutes');
const viewScheduleRoutes = require('./Routes/viewSchedule');

const app = express();
const port = 5001;

// CORS middleware configuration
app.use(cors({
origin: 'http://localhost:3000', // Allow requests only from your frontend
methods: ['GET', 'POST'], // Allow GET and POST methods
credentials: true, // Allow cookies if needed
}));
  

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', registerRoutes);
app.use(express.json());

// Use login routes
app.use('/api', loginRoutes); // Add '/api' prefix to all login routes
app.use('/api', registerRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', teamsRouter);
app.use('/api', viewScheduleRoutes);

// API Routes
app.use('/api', statsRoutes); // Use the stats routes

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
