import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import dbConnect from '@/db/dbConnectSafe'
import User from '@/db/models/user'

export type StoredUser = {
  username: string
  passwordHash: string
  age: number
  phone: string
  address: string
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

export async function findUserByUsername(username: string) {
  try {
    await dbConnect()
    return await User.findOne({ username }).lean<StoredUser | null>()
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while finding user:', error)
    }

    const users = await readFallbackUsers()
    return users.find((user) => user.username === username) ?? null
  }
}

export async function createUser(user: StoredUser) {
  try {
    await dbConnect()
    await User.create(user)
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

    return { storage: 'file' as const }
  }
}
