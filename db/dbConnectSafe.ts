/* eslint-disable no-var */
import mongoose from 'mongoose'

const MONGO_RETRY_COOLDOWN_MS = 60_000

declare global {
  var safeMongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
    lastErrorAt?: number
  }
}

let cached = global.safeMongoose

if (!cached) {
  cached = global.safeMongoose = { conn: null, promise: null }
}

async function dbConnectSafe(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn
  }

  if (cached.lastErrorAt && Date.now() - cached.lastErrorAt < MONGO_RETRY_COOLDOWN_MS) {
    throw new Error('MONGODB_TEMPORARILY_UNAVAILABLE')
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set.')
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        cached.lastErrorAt = undefined
        return mongooseInstance.connection
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    cached.lastErrorAt = Date.now()
    throw error
  }

  return cached.conn
}

export default dbConnectSafe
