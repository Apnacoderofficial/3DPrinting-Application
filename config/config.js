const mongoose = require('mongoose');

// MongoDB connection string with database name
const MONGODB_URI = 'mongodb+srv://harshitsrivastava374:JlnXnuek7qCD4U5t@3dprinting.5iyk7yd.mongodb.net/3dprinting';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: '3dprinting' // Specify the database name explicitly
        });

        console.log('Connected db ...');
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // You can perform additional operations here after connecting successfully
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // Exit process on failure
        process.exit(1);
    }
};

module.exports = connectDB;
