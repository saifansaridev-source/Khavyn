import mongoose from "mongoose";

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

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("MONGODB_URI environment variable is not defined");
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 8000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
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

