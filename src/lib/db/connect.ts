import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

// Disable Mongoose buffering so operations fail fast if DB is disconnected
mongoose.set("bufferCommands", false);

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 second timeout instead of buffering forever
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log("Connected to MongoDB Atlas");
      return m;
    }).catch((err) => {
      console.warn("MongoDB connection failed:", err.message);
      cached.promise = null;
      return null as any;
    });
  }

  try {
    const conn = await cached.promise;
    if (conn && mongoose.connection.readyState === 1) {
      cached.conn = conn;
      return conn;
    }
  } catch (e: any) {
    console.warn("MongoDB connection error:", e.message);
    cached.promise = null;
  }

  return null;
}

export { connectToDatabase as connectDB };

