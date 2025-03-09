const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:userId", authMiddleware, async (req, res) => {
    try {
        const { medicineName, dosage, days } = req.body;
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingMedicine = user.medicines.find(medicine => medicine.medicineName === medicineName);

        if (existingMedicine) {
            return res.status(400).json({ message: "Medicine already exists" });
        }

        // Add new medicine
        user.medicines.push({ medicineName, dosage, days });
        await user.save();

        res.status(200).json({ message: "Medicine details added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});



router.put("/update/:userId", authMiddleware, async (req, res) => {
    try {
        const { medicineName, dosage, days } = req.body;
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
                medicineFound = true;
            }
        });

        if (!medicineFound) {
            return res.status(400).json({ message: "Medicine details are not found" });
        }

        await user.save();

        return res.status(200).json({ message: "Medicine details updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;