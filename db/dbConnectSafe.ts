/* eslint-disable no-var */
import mongoose from 'mongoose'

const MONGO_RETRY_COOLDOWN_MS = 60_000

function summarizeMongoUri(uri: string) {
  try {
    const normalizedUri = uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://') ? uri : `mongodb://${uri}`
    const parsed = new URL(normalizedUri)
    const protocol = parsed.protocol.replace(':', '')
    const hosts = parsed.host
    const database = parsed.pathname.replace(/^\//, '') || '(default)'

    return `${protocol}://${hosts}/${database}`
  } catch {
    return '(unparseable mongodb uri)'
  }
}

function describeMongoError(error: unknown) {
  if (error instanceof Error) {
    const mongoLikeError = error as Error & { code?: string; cause?: unknown }
    const code = mongoLikeError.code ? ` code=${mongoLikeError.code}` : ''
    const cause =
      mongoLikeError.cause instanceof Error ? ` cause=${mongoLikeError.cause.name}: ${mongoLikeError.cause.message}` : ''

    return `${error.name}: ${error.message}${code}${cause}`
  }

  return String(error)
}

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
    console.info(`[db] Reusing existing MongoDB connection (${cached.conn.name || '(default)'})`)
    return cached.conn
  }

  if (cached.lastErrorAt && Date.now() - cached.lastErrorAt < MONGO_RETRY_COOLDOWN_MS) {
    const remainingMs = MONGO_RETRY_COOLDOWN_MS - (Date.now() - cached.lastErrorAt)
    console.warn(`[db] Skipping MongoDB reconnect during cooldown (${remainingMs}ms remaining)`)
    throw new Error('MONGODB_TEMPORARILY_UNAVAILABLE')
  }

  if (!process.env.MONGODB_URI) {
    console.error('[db] MONGODB_URI environment variable is not set.')
    throw new Error('MONGODB_URI environment variable is not set.')
  }

  if (!cached.promise) {
    console.info(`[db] Attempting MongoDB connection to ${summarizeMongoUri(process.env.MONGODB_URI)}`)
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        socketTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        cached.lastErrorAt = undefined
        console.info(`[db] MongoDB connected successfully (${mongooseInstance.connection.name || '(default)'})`)
        return mongooseInstance.connection
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    cached.lastErrorAt = Date.now()
    console.error(`[db] MongoDB connection failed: ${describeMongoError(error)}`)
    throw error
  }

  return cached.conn
}

export default dbConnectSafe
