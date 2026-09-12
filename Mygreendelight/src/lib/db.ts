import mongoose from "mongoose";

const getMongoUrl = () => process.env.DB_URL || process.env.MONGODB_URI || "";

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    const mongourl = getMongoUrl();
    if (!mongourl) {
        console.warn("⚠️ MONGODB_URI is not defined in Environment Variables. Database calls will be skipped during static build.");
        return null;
    }
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
            maxPoolSize: 10, // Maintain up to 10 socket connections for high concurrency without exhausting Atlas limits
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000, // Fail fast after 5 seconds instead of hanging
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };
        cached.promise = mongoose.connect(mongourl, opts).then((mongoose) => {
            return mongoose.connection;
        })
    }

    try {
        cached.conn = await cached.promise
        return cached.conn
    } catch (error) {
        cached.promise = null; // Clear the failed promise so we can retry!
        console.log("MongoDB connection error:", error)
        throw error;
    }

    
}

export default connectDb
