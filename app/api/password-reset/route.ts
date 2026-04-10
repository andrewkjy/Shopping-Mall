import { randomBytes, scryptSync } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { findUserByUsernameAndPhone, updateUserPassword } from '@/lib/userStore'

type PasswordResetBody = {
  username?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return hasMinLength && hasNumber && hasSpecialChar
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PasswordResetBody
    const username = body.username?.trim()
    const phone = body.phone?.replace(/\D/g, '')
    const password = body.password?.trim()
    const confirmPassword = body.confirmPassword?.trim()

    if (!username || !phone) {
      return NextResponse.json({ message: '아이디와 전화번호를 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsernameAndPhone(username, phone)

    if (lookupResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 비밀번호 재설정을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      )
    }

    if (!lookupResult.user) {
      return NextResponse.json({ message: '아이디 또는 전화번호가 올바르지 않습니다.' }, { status: 404 })
    }

    if (!password && !confirmPassword) {
      return NextResponse.json(
        {
          message: '본인 확인이 완료되었습니다. 새 비밀번호를 입력해주세요.',
          verified: true,
        },
        { status: 200 }
      )
    }

    if (!password || !confirmPassword) {
      return NextResponse.json({ message: '새 비밀번호와 비밀번호 확인을 입력해주세요.' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 400 })
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          message: '비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.',
        },
        { status: 400 }
      )
    }

    const updateResult = await updateUserPassword(username, phone, hashPassword(password))

    if (updateResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 비밀번호 재설정을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      )
    }

    if (!updateResult.updated) {
      return NextResponse.json({ message: '아이디 또는 전화번호가 올바르지 않습니다.' }, { status: 404 })
    }

    return NextResponse.json({ message: '비밀번호가 재설정되었습니다.' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: '비밀번호 재설정 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}
