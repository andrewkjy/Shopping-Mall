import { randomBytes, scryptSync } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByUsername } from '@/lib/userStore'

type SignupBody = {
  name?: string
  role?: string
  username?: string
  password?: string
  confirmPassword?: string
  birthDate?: string
  phone?: string
  address?: string
}

function isValidRole(role: string): role is 'consumer' | 'seller' {
  return role === 'consumer' || role === 'seller'
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
    const body = (await request.json()) as SignupBody
    const name = body.name?.trim()
    const role = body.role?.trim()
    const username = body.username?.trim()
    const password = body.password?.trim()
    const confirmPassword = body.confirmPassword?.trim()
    const birthDate = body.birthDate?.trim()
    const phone = body.phone?.trim()
    const address = body.address?.trim()
    const parsedBirthDate = birthDate ? new Date(birthDate) : null

    if (!name || !role || !username || !password || !confirmPassword || !birthDate || !phone || !address) {
      return NextResponse.json({ message: '모든 항목을 입력해주세요.' }, { status: 400 })
    }

    if (!isValidRole(role)) {
      return NextResponse.json({ message: '회원 유형을 올바르게 선택해주세요.' }, { status: 400 })
    }

    if (!parsedBirthDate || Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > new Date()) {
      return NextResponse.json({ message: '올바른 생년월일을 입력해주세요.' }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 400 })
    }

    if (username.length < 4) {
      return NextResponse.json({ message: '아이디는 4자 이상이어야 합니다.' }, { status: 400 })
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: '비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.' },
        { status: 400 }
      )
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 회원가입을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      )
    }

    if (lookupResult.user) {
      return NextResponse.json({ message: '이미 사용 중인 아이디입니다.' }, { status: 409 })
    }

    await createUser({
      name,
      role,
      username,
      passwordHash: hashPassword(password),
      birthDate,
      phone,
      address,
    })

    return NextResponse.json({ message: '회원가입이 완료되었습니다.' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'DUPLICATE_USERNAME') {
      return NextResponse.json({ message: '이미 사용 중인 아이디입니다.' }, { status: 409 })
    }

    return NextResponse.json(
      {
        message: '회원가입 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}
