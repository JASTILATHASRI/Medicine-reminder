// config/cronScheduler.js

const cron = require('node-cron');
const User = require('../models/User'); // Assuming you have a User model to fetch users from the database
const { sendMedicineReminders } = require('../cron-jobs/sendReminders');
const moment = require('moment');

// Function to fetch users and schedule cron jobs
const scheduleReminderJobs = async () => {
  try {
    // Fetch all users with their reminder time and medicines
    const users = await User.find({ 'medicines.reminderTime': { $exists: true } }); // Ensure users have reminder times

    // Loop through each user
    users.forEach(user => {
      // Loop through each medicine of the user
      user.medicines.forEach(medicine => {
        if (medicine.reminderTime) {
          // Parse the reminder time into hours and minutes
          const [hour, minute] = medicine.reminderTime.split(':');
          
          // Cron expression to run at the selected time (e.g., 'minute hour * * *')
          const cronExpression = `${minute} ${hour} * * *`; // Example: '0 8 * * *' for 8:00 AM daily

          // Log for debugging purposes
          console.log(`Scheduling cron job for ${user.username} to take ${medicine.medicineName} at ${medicine.reminderTime}`);
          
          // Schedule a cron job for the user's reminder time
          cron.schedule(cronExpression, () => {
            console.log(`Sending reminder for ${user.username} for medicine ${medicine.medicineName} at ${medicine.reminderTime}...`);
            // Send the medicine reminder email
            sendMedicineReminders(user, medicine); // Pass the user and medicine to the sendReminder function
          });
        }
      });
    });

  } catch (err) {
    console.error('Error scheduling reminder jobs:', err);
  }
};

scheduleReminderJobs();

// Export the function so it can be used in other files
module.exports = { scheduleReminderJobs };
