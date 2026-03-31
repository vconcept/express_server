// server.js
const express = require('express');
const path = require('path');
const workingHoursMiddleware = require('./middleware/workingHours');

const app = express();
const PORT = 3000;

// Apply the working hours middleware globally
app.use(workingHoursMiddleware);

// Serve static files (CSS)
app.use('/css', express.static(path.join(__dirname, 'public/css')));

// API endpoint to check working status
app.get('/api/working-status', (req, res) => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isWorkingDay = day >= 1 && day <= 5;
    const isWorkingHour = hour >= 9 && hour < 17;
    const isWorking = isWorkingDay && isWorkingHour;
    
    res.json({ isWorking });
});

// API endpoint to get next working time
app.get('/api/next-working-time', (req, res) => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    let nextWorking = new Date(now);
    const isWorkingDay = day >= 1 && day <= 5;
    const isWorkingHour = hour >= 9 && hour < 17;
    
    if (isWorkingDay && hour < 9) {
        // Before working hours today
        nextWorking.setHours(9, 0, 0, 0);
    } else if (isWorkingDay && hour >= 17) {
        // After working hours today, go to tomorrow 9 AM
        nextWorking.setDate(now.getDate() + 1);
        nextWorking.setHours(9, 0, 0, 0);
    } else if (day === 5 && hour >= 17) {
        // Friday after hours, go to Monday 9 AM
        nextWorking.setDate(now.getDate() + 3);
        nextWorking.setHours(9, 0, 0, 0);
    } else if (day === 6) {
        // Saturday, go to Monday 9 AM
        nextWorking.setDate(now.getDate() + 2);
        nextWorking.setHours(9, 0, 0, 0);
    } else if (day === 0) {
        // Sunday, go to Monday 9 AM
        nextWorking.setDate(now.getDate() + 1);
        nextWorking.setHours(9, 0, 0, 0);
    } else if (!isWorkingDay) {
        // Weekend
        nextWorking.setDate(now.getDate() + (8 - day));
        nextWorking.setHours(9, 0, 0, 0);
    } else {
        // During working hours
        nextWorking = null;
    }
    
    if (nextWorking) {
        const diffMs = nextWorking - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        res.json({ hours, minutes });
    } else {
        res.json({ hours: 0, minutes: 0 });
    }
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Handle 404 - Page Not Found
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/services">Our Services</a></li>
                    <li><a href="/contact">Contact Us</a></li>
                </ul>
            </nav>
            <div class="container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" class="request-btn" style="display: inline-block; text-decoration: none;">Go Home</a>
            </div>
            <footer>
                <p>&copy; 2026 WEB SPECIALIST LTD. All rights reserved.</p>
            </footer>
        </body>
        </html>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Working hours: Monday-Friday, 9:00-17:00`);
});