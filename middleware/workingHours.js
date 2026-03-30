// middleware/workingHours.js
const workingHoursMiddleware = (req, res, next) => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    
    // Check if it's working hours: Monday to Friday, 9 AM to 5 PM
    const isWorkingDay = day >= 1 && day <= 5; // Monday (1) to Friday (5)
    const isWorkingHour = hour >= 9 && hour < 17;
    
    if (isWorkingDay && isWorkingHour) {
        next(); // Continue to the requested page
    } else {
        // Send a message when outside working hours
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Closed - Working Hours</title>
                <link rel="stylesheet" href="/css/style.css">
            </head>
            <body>
                <div class="closed-message">
                    <h1>🚧 Sorry, We're Closed 🚧</h1>
                    <p>Our website is only available during working hours:</p>
                    <p><strong>Monday to Friday, 9:00 AM - 5:00 PM</strong></p>
                    <p>Please visit us during business hours.</p>
                    <p class="current-time">Current time: ${now.toString()}</p>
                </div>
            </body>
            </html>
        `);
    }
};

module.exports = workingHoursMiddleware;