const cron = require('node-cron');
const { sendMedicineReminders } = require('../cron-jobs/sendReminders');

// Schedule the cron job to run once a day (e.g., at 8:00 AM)
console.log("reminder")
cron.schedule('12 12 * * *', () => {
  console.log('Running the medicine reminder cron job...');
  sendMedicineReminders();
});
