const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        .then(()=>{
            console.log("MongoDB connected successfully")
        })
    }
    catch(err)
    {
        console.log("error in connecting database",err)
    }
}

module.exports = connectDB