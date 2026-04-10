import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import dbConnect from '@/db/dbConnectSafe'
import User from '@/db/models/user'

export type StoredUser = {
  name: string
  role: 'consumer' | 'seller'
  username: string
  passwordHash: string
  birthDate: string
  phone: string
  address: string
}

export type UserLookupResult = {
  user: StoredUser | null
  storage: 'mongodb' | 'file'
  degraded: boolean
}

const fallbackFilePath = path.join(process.cwd(), 'data', 'users.json')

async function readFallbackUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(fallbackFilePath, 'utf8')
    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? (parsed as StoredUser[]) : []
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException

    if (nodeError.code === 'ENOENT') {
      return []
    }

    throw error
  }
}

async function writeFallbackUsers(users: StoredUser[]) {
  await mkdir(path.dirname(fallbackFilePath), { recursive: true })
  await writeFile(fallbackFilePath, JSON.stringify(users, null, 2), 'utf8')
}

function isTemporaryMongoFailure(error: unknown) {
  return error instanceof Error && error.message === 'MONGODB_TEMPORARILY_UNAVAILABLE'
}

export async function findUserByUsername(username: string): Promise<UserLookupResult> {
  try {
    console.info(`[userStore] Looking up username="${username}" in MongoDB`)
    await dbConnect()
    const user = await User.findOne({ username }).lean<StoredUser | null>()
    console.info(`[userStore] Lookup completed in MongoDB for username="${username}" found=${Boolean(user)}`)

    return {
      user,
      storage: 'mongodb',
      degraded: false,
    }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while finding user:', error)
    }

    const users = await readFallbackUsers()
    const user = users.find((user) => user.username === username) ?? null
    console.info(`[userStore] Lookup completed in file storage for username="${username}" found=${Boolean(user)}`)

    return {
      user,
      storage: 'file',
      degraded: true,
    }
  }
}

export async function createUser(user: StoredUser) {
  try {
    console.info(`[userStore] Creating username="${user.username}" in MongoDB`)
    await dbConnect()
    await User.create(user)
    console.info(`[userStore] User created in MongoDB username="${user.username}"`)
    return { storage: 'mongodb' as const }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while creating user:', error)
    }

    const users = await readFallbackUsers()
    const exists = users.some((existingUser) => existingUser.username === user.username)

    if (exists) {
      throw new Error('DUPLICATE_USERNAME')
    }

    users.push(user)
    await writeFallbackUsers(users)
    console.info(`[userStore] User created in file storage username="${user.username}"`)

    return { storage: 'file' as const }
  }
}
