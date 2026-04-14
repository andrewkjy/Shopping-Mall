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

export async function findUserByNameAndPhone(name: string, phone: string): Promise<UserLookupResult> {
  try {
    console.info(`[userStore] Looking up name="${name}" phone="${phone}" in MongoDB`)
    await dbConnect()
    const user = await User.findOne({ name, phone }).lean<StoredUser | null>()
    console.info(`[userStore] Lookup completed in MongoDB for name="${name}" phone="${phone}" found=${Boolean(user)}`)

    return {
      user,
      storage: 'mongodb',
      degraded: false,
    }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while finding user by profile:', error)
    }

    const users = await readFallbackUsers()
    const user = users.find((storedUser) => storedUser.name === name && storedUser.phone === phone) ?? null
    console.info(`[userStore] Lookup completed in file storage for name="${name}" phone="${phone}" found=${Boolean(user)}`)

    return {
      user,
      storage: 'file',
      degraded: true,
    }
  }
}

export async function findUserByUsernameAndPhone(username: string, phone: string): Promise<UserLookupResult> {
  try {
    console.info(`[userStore] Looking up username="${username}" phone="${phone}" in MongoDB`)
    await dbConnect()
    const user = await User.findOne({ username, phone }).lean<StoredUser | null>()
    console.info(
      `[userStore] Lookup completed in MongoDB for username="${username}" phone="${phone}" found=${Boolean(user)}`
    )

    return {
      user,
      storage: 'mongodb',
      degraded: false,
    }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while finding user by account:', error)
    }

    const users = await readFallbackUsers()
    const user = users.find((storedUser) => storedUser.username === username && storedUser.phone === phone) ?? null
    console.info(
      `[userStore] Lookup completed in file storage for username="${username}" phone="${phone}" found=${Boolean(user)}`
    )

    return {
      user,
      storage: 'file',
      degraded: true,
    }
  }
}

export async function updateUserPassword(username: string, phone: string, passwordHash: string) {
  try {
    console.info(`[userStore] Updating password in MongoDB for username="${username}"`)
    await dbConnect()
    const updatedUser = await User.findOneAndUpdate({ username, phone }, { passwordHash }, { new: true }).lean<
      StoredUser | null
    >()

    if (!updatedUser) {
      return { updated: false, storage: 'mongodb' as const, degraded: false }
    }

    console.info(`[userStore] Password updated in MongoDB for username="${username}"`)
    return { updated: true, storage: 'mongodb' as const, degraded: false }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while updating password:', error)
    }

    const users = await readFallbackUsers()
    const userIndex = users.findIndex((storedUser) => storedUser.username === username && storedUser.phone === phone)

    if (userIndex === -1) {
      return { updated: false, storage: 'file' as const, degraded: true }
    }

    users[userIndex] = {
      ...users[userIndex],
      passwordHash,
    }

    await writeFallbackUsers(users)
    console.info(`[userStore] Password updated in file storage for username="${username}"`)
    return { updated: true, storage: 'file' as const, degraded: true }
  }
}

export async function updateUserProfile(
  username: string,
  profile: Pick<StoredUser, 'name' | 'birthDate' | 'phone' | 'address'>
) {
  try {
    console.info(`[userStore] Updating profile in MongoDB for username="${username}"`)
    await dbConnect()
    const updatedUser = await User.findOneAndUpdate({ username }, profile, { new: true }).lean<StoredUser | null>()

    if (!updatedUser) {
      return { user: null, storage: 'mongodb' as const, degraded: false }
    }

    console.info(`[userStore] Profile updated in MongoDB for username="${username}"`)
    return { user: updatedUser, storage: 'mongodb' as const, degraded: false }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while updating profile:', error)
    }

    const users = await readFallbackUsers()
    const userIndex = users.findIndex((storedUser) => storedUser.username === username)

    if (userIndex === -1) {
      return { user: null, storage: 'file' as const, degraded: true }
    }

    users[userIndex] = {
      ...users[userIndex],
      ...profile,
      username: users[userIndex].username,
    }

    await writeFallbackUsers(users)
    console.info(`[userStore] Profile updated in file storage for username="${username}"`)
    return { user: users[userIndex], storage: 'file' as const, degraded: true }
  }
}

export async function updateUserPasswordByUsername(username: string, passwordHash: string) {
  try {
    console.info(`[userStore] Updating password in MongoDB for username="${username}"`)
    await dbConnect()
    const updatedUser = await User.findOneAndUpdate({ username }, { passwordHash }, { new: true }).lean<StoredUser | null>()

    if (!updatedUser) {
      return { updated: false, storage: 'mongodb' as const, degraded: false }
    }

    console.info(`[userStore] Password updated in MongoDB for username="${username}"`)
    return { updated: true, storage: 'mongodb' as const, degraded: false }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while updating password by username:', error)
    }

    const users = await readFallbackUsers()
    const userIndex = users.findIndex((storedUser) => storedUser.username === username)

    if (userIndex === -1) {
      return { updated: false, storage: 'file' as const, degraded: true }
    }

    users[userIndex] = {
      ...users[userIndex],
      passwordHash,
    }

    await writeFallbackUsers(users)
    console.info(`[userStore] Password updated in file storage for username="${username}"`)
    return { updated: true, storage: 'file' as const, degraded: true }
  }
}

export async function deleteUserByUsername(username: string) {
  try {
    console.info(`[userStore] Deleting user in MongoDB for username="${username}"`)
    await dbConnect()
    const deletedUser = await User.findOneAndDelete({ username }).lean<StoredUser | null>()

    if (!deletedUser) {
      return { deleted: false, storage: 'mongodb' as const, degraded: false }
    }

    console.info(`[userStore] User deleted in MongoDB for username="${username}"`)
    return { deleted: true, storage: 'mongodb' as const, degraded: false }
  } catch (error) {
    if (isTemporaryMongoFailure(error)) {
      console.warn('[userStore] Using file storage while MongoDB is cooling down.')
    } else {
      console.error('[userStore] Falling back to file storage while deleting user:', error)
    }

    const users = await readFallbackUsers()
    const nextUsers = users.filter((storedUser) => storedUser.username !== username)

    if (nextUsers.length === users.length) {
      return { deleted: false, storage: 'file' as const, degraded: true }
    }

    await writeFallbackUsers(nextUsers)
    console.info(`[userStore] User deleted in file storage for username="${username}"`)
    return { deleted: true, storage: 'file' as const, degraded: true }
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
