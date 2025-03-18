const cron = require('node-cron');
const User = require('../models/User');
const { sendMedicineReminders } = require('../cron-jobs/sendReminders');
const moment = require('moment');
const scheduleReminderJobs = async () => {
  try {
    const users = await User.find({ 'medicines.reminderTime': { $exists: true } });

    users.forEach(user => {
      user.medicines.forEach(medicine => {
        if (medicine.reminderTime) {
          const [hour, minute] = medicine.reminderTime.split(':');
          const cronExpression = `${minute} ${hour} * * *`; 

          console.log(`Scheduling cron job for ${user.username} to take ${medicine.medicineName} at ${medicine.reminderTime}`);
          console.log(cronExpression)
          
          cron.schedule(cronExpression, async () => {
            console.log(`Cron job triggered: Sending reminder for ${user.username} for medicine ${medicine.medicineName} at ${medicine.reminderTime}...`);
            
            try {
              await sendMedicineReminders(user, medicine);  
              console.log(`Reminder successfully sent to ${user.username} for ${medicine.medicineName}`);
            } catch (err) {
              console.error('Error while sending reminder:', err);
            }
          });
        }
      });
    });
  } catch (err) {
    console.error('Error scheduling reminder jobs:', err);
  }
};

scheduleReminderJobs();

module.exports = { scheduleReminderJobs };
