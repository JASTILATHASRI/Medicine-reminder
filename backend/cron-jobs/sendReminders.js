const { sendEmail } = require("../services/emailService");
const User = require("../models/User");
const moment = require("moment");

// Function to send medicine reminders
const sendMedicineReminders = async () => {
  try {
    const users = await User.find({ opted: true });

    const today = moment().format('dddd'); 
    users.forEach(user => {
      user.medicines.forEach(medicine => {
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
          sendEmail(user.email, subject, message);
        }
      });
    });

    console.log("Medicine reminders sent successfully!");
  } catch (error) {
    console.log("Error sending reminders:", error);
  }
};

module.exports = { sendMedicineReminders };
