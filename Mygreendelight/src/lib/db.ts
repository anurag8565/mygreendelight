import mongoose from "mongoose";

const mongourl = process.env.DB_URL || process.env.MONGODB_URI;

if (!mongourl) {
    throw new Error("error")
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

const connectDb = async () => {
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
