import { scryptSync, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { findUserByUsername } from '@/lib/userStore'

type LoginBody = {
  username?: string
  password?: string
}

function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(':')

  if (!salt || !storedHash) {
    return false
  }

  const derivedKey = scryptSync(password, salt, 64)
  const storedKey = Buffer.from(storedHash, 'hex')

  if (storedKey.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedKey, derivedKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody
    const username = body.username?.trim()
    const password = body.password ?? ''

    if (!username || !password) {
      return NextResponse.json({ message: '아이디와 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 로그인을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      )
    }

    if (!lookupResult.user || !verifyPassword(password, lookupResult.user.passwordHash)) {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: '로그인에 성공했습니다.',
        user: {
          name: lookupResult.user.name,
          role: lookupResult.user.role,
          username: lookupResult.user.username,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: '로그인 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}
