import mongoose from "mongoose";

const getMongoUrl = () => process.env.DB_URL || process.env.MONGODB_URI || "";

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    const mongourl = getMongoUrl();
    if (!mongourl) {
        console.warn("MONGODB_URI is not defined");
        return null;
    }
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
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
