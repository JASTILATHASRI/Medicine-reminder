// routes/addMedicine.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// POST route to add new medicine with reminder time
router.post("/:userId", authMiddleware, async (req, res) => {
    try {
        const { medicineName, dosage, days, reminderTime } = req.body;  // Include reminderTime in the request body
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingMedicine = user.medicines.find(medicine => medicine.medicineName === medicineName);

        if (existingMedicine) {
            return res.status(400).json({ message: "Medicine already exists" });
        }

        // Add new medicine with reminder time
        user.medicines.push({ medicineName, dosage, days, reminderTime });
        await user.save();

        res.status(200).json({ message: "Medicine details added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// PUT route to update medicine details including reminder time
router.put("/update/:userId", authMiddleware, async (req, res) => {
    try {
        const { medicineName, dosage, days, reminderTime } = req.body;  
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let medicineFound = false;
        user.medicines.forEach(medicine => {
            if (medicine.medicineName === medicineName) {
                medicine.dosage = dosage;
                medicine.days = days;
                medicine.reminderTime = reminderTime;  // Update reminderTime as well
                medicineFound = true;
            }
        });

        if (!medicineFound) {
            return res.status(400).json({ message: "Medicine details are not found" });
        }

        await user.save();

        // Reschedule cron jobs whenever medicine details are updated
        console.log(`Reminder time updated for ${user.username}. Rescheduling cron jobs...`);

        return res.status(200).json({ message: "Medicine details updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
