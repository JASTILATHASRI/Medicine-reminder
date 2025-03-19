const { sendEmail } = require("../services/emailService");
const User = require("../models/User");
const moment = require("moment");

// Function to send medicine reminders
const sendMedicineReminders = async (user, medicine) => {
  try {
    const today = moment().format('dddd'); // Get current day of the week

    // Check if the current day is in the user's medicine schedule
    if (medicine.days.includes(today)) {
      const subject = `Reminder: Take Your Medicine - ${medicine.medicineName}`;
      const message = `
        Hello ${user.username},\n\n
        This is a reminder to take your medicine today:\n\n
        Medicine: ${medicine.medicineName}\n
        Dosage: ${medicine.dosage}\n
        Please take it as prescribed.\n\n
        Stay healthy!
      `;

      // Send the email to the correct user
      await sendEmail(user.email, subject, message);
      console.log(`Reminder sent to ${user.username} for ${medicine.medicineName}`);
    }
  } catch (error) {
    console.log(`Error sending reminder to ${user.username} for ${medicine.medicineName}:`, error);
  }
};
// Correct export
module.exports = { sendMedicineReminders };
