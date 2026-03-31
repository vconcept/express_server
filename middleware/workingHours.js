// middleware/workingHours.js
const workingHoursMiddleware = (req, res, next) => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Check if it's working hours: Monday to Friday, 9 AM to 5 PM
    const isWorkingDay = day >= 1 && day <= 5; // Monday (1) to Friday (5)
    const isWorkingHour = hour >= 9 && hour < 17;
    
    // Calculate time until next working hours
    const getNextWorkingTime = () => {
        const now = new Date();
        let nextWorking = new Date(now);
        
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
        } else {
            // Weekend or after hours
            nextWorking.setDate(now.getDate() + 1);
            nextWorking.setHours(9, 0, 0, 0);
        }
        
        const diffMs = nextWorking - now;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes };
    };
    
    // Attach working hours info to request object
    req.workingHours = {
        isWorkingTime: isWorkingDay && isWorkingHour,
        getNextWorkingTime
    };
    
    next();
};

module.exports = workingHoursMiddleware;