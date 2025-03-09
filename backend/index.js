const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 4000;
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/medicine");
const addMedicineRoutes = require("./routes/addMedicine")

const cronScheduler = require('./config/cronScheduler'); 
const cron = require('node-cron');

require('./cron-jobs/sendReminders'); 

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/add",addMedicineRoutes)

app.listen(port, () => console.log(`Server is running on port: ${port}`));
