const cron = require('node-cron');
const User = require('../models/User');
const { sendMedicineReminders } = require('../cron-jobs/sendReminders');
const moment = require('moment');

// Store the active cron jobs so we can cancel or reschedule them later
let activeCronJobs = new Map();

const scheduleReminderJobs = async () => {
  try {
    // Fetch all users with valid reminder times
    const users = await User.find({ 'medicines.reminderTime': { $exists: true } });

    // Loop through each user
    for (const user of users) {
      // Loop through each medicine of the user
      for (const medicine of user.medicines) {
        if (medicine.reminderTime) {
          const [hour, minute] = medicine.reminderTime.split(':');
          
          // Check if the reminder time is valid
          if (hour && minute && moment(`${hour}:${minute}`, 'HH:mm').isValid()) {
            const cronExpression = `${minute} ${hour} * * *`;  // Cron expression format: 'minute hour * * *'
            console.log(`Scheduling cron job for ${user.username} to take ${medicine.medicineName} at ${medicine.reminderTime}`);

            // If a cron job for this user already exists, stop it first
            if (activeCronJobs.has(user._id.toString())) {
              const existingCronJob = activeCronJobs.get(user._id.toString());
              existingCronJob.stop();
              console.log(`Existing cron job for ${user.username} canceled.`);
            }

            // Create a new cron job to trigger at the specified time
            const cronJob = cron.schedule(cronExpression, async () => {
              console.log(`Cron job triggered: Sending reminder for ${user.username} to take ${medicine.medicineName} at ${medicine.reminderTime}...`);

              try {
                await sendMedicineReminders(user, medicine);  // Send the medicine reminder
                console.log(`Reminder successfully sent to ${user.username} for ${medicine.medicineName}`);
              } catch (err) {
                console.error('Error while sending reminder:', err);
              }
            });

            // Save the cron job in the map
            activeCronJobs.set(user._id.toString(), cronJob);
          } else {
            console.log(`Invalid reminder time format for ${medicine.medicineName} for user ${user.username}`);
          }
        }
      }
    }
  } catch (err) {
    console.error('Error scheduling reminder jobs:', err);
  }
};

// Call the function to schedule reminder jobs
scheduleReminderJobs();

// Export the function for use elsewhere in the application
module.exports = { scheduleReminderJobs };
