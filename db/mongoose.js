const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true
        })

        console.log(`MongoDB connected: ${conn.connection.host}`)
        return conn
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
};

connectDB()