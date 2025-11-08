import mongoose from 'mongoose'

/**
 * MongoDB connection URI from environment variables.
 * Make sure to set MONGODB_URI in your .env.local file.
 * Example: mongodb://localhost:27017/your-database or MongoDB Atlas connection string
 */
const MONGODB_URI: string = process.env.MONGODB_URI || ''

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global cache for the MongoDB connection.
 * This prevents multiple connections during development hot-reloading.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Use global to persist the connection across hot reloads in development
declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

/**
 * Establishes and returns a cached MongoDB connection using Mongoose.
 * 
 * - In development: Reuses the connection to prevent exhausting database connections during hot-reloading.
 * - In production: Creates a stable connection that persists across requests.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose instance with an active connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering for better error handling
    }

    // Connect to MongoDB with proper error handling
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully')
      return mongoose
    })
  }

  try {
    // Wait for the connection promise to resolve
    cached.conn = await cached.promise
  } catch (error) {
    // Clear the promise on error so next call will retry
    cached.promise = null
    console.error('❌ MongoDB connection error:', error)
    throw error
  }

  return cached.conn
}

export default connectDB
