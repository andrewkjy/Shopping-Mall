import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { deleteUserByUsername, findUserByUsername, updateUserPasswordByUsername, updateUserProfile } from '@/lib/userStore'

type VerifyAccountBody = {
  username?: string
  password?: string
}

type UpdateAccountBody = {
  username?: string
  currentPassword?: string
  name?: string
  birthDate?: string
  phone?: string
  postalCode?: string
  address?: string
  addressDetail?: string
  newPassword?: string
  confirmNewPassword?: string
}

type DeleteAccountBody = {
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

function parseStoredAddress(fullAddress: string) {
  const trimmed = fullAddress.trim()
  const structuredParts = trimmed.split('|||')

  if (structuredParts.length >= 3) {
    return {
      postalCode: structuredParts[0],
      address: structuredParts[1],
      addressDetail: structuredParts.slice(2).join('|||'),
    }
  }

  const postalCodeMatch = trimmed.match(/^(\d{5})\s+(.*)$/)

  if (!postalCodeMatch) {
    return {
      postalCode: '',
      address: trimmed,
      addressDetail: '',
    }
  }

  return {
    postalCode: postalCodeMatch[1],
    address: postalCodeMatch[2],
    addressDetail: '',
  }
}

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username')?.trim()

    if (!username) {
      return NextResponse.json({ message: '아이디를 확인할 수 없습니다.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 회원정보를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!lookupResult.user) {
      return NextResponse.json({ message: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    const parsedAddress = parseStoredAddress(lookupResult.user.address)

    return NextResponse.json(
      {
        user: {
          name: lookupResult.user.name,
          role: lookupResult.user.role,
          username: lookupResult.user.username,
          birthDate: lookupResult.user.birthDate,
          phone: lookupResult.user.phone,
          postalCode: parsedAddress.postalCode,
          address: parsedAddress.address,
          addressDetail: parsedAddress.addressDetail,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: '회원정보 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as VerifyAccountBody
    const username = body.username?.trim()
    const password = body.password ?? ''

    if (!username || !password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 본인 확인을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!lookupResult.user || !verifyPassword(password, lookupResult.user.passwordHash)) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: '비밀번호 확인이 완료되었습니다.',
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
        message: '본인 확인 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as UpdateAccountBody
    const username = body.username?.trim()
    const currentPassword = body.currentPassword ?? ''
    const name = body.name?.trim()
    const birthDate = body.birthDate?.trim()
    const phone = body.phone?.replace(/\D/g, '')
    const postalCode = body.postalCode?.trim()
    const address = body.address?.trim()
    const addressDetail = body.addressDetail?.trim() ?? ''
    const newPassword = body.newPassword?.trim() ?? ''
    const confirmNewPassword = body.confirmNewPassword?.trim() ?? ''

    if (!username || !name || !birthDate || !phone || !postalCode || !address) {
      return NextResponse.json({ message: '모든 필수 항목을 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 회원정보를 수정할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!lookupResult.user) {
      return NextResponse.json({ message: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (newPassword || confirmNewPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: '현재 비밀번호를 입력해주세요.' }, { status: 400 })
      }

      if (!verifyPassword(currentPassword, lookupResult.user.passwordHash)) {
        return NextResponse.json({ message: '현재 비밀번호가 올바르지 않습니다.' }, { status: 401 })
      }

      if (!newPassword || !confirmNewPassword) {
        return NextResponse.json({ message: '새 비밀번호와 비밀번호 확인을 모두 입력해주세요.' }, { status: 400 })
      }

      if (newPassword !== confirmNewPassword) {
        return NextResponse.json({ message: '새 비밀번호가 일치하지 않습니다.' }, { status: 400 })
      }

      if (!isValidPassword(newPassword)) {
        return NextResponse.json(
          { message: '새 비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.' },
          { status: 400 }
        )
      }
    }

    const fullAddress = [postalCode, address, addressDetail].join('|||')

    const updateResult = await updateUserProfile(username, {
      name,
      birthDate,
      phone,
      address: fullAddress,
    })

    if (updateResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 회원정보를 수정할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!updateResult.user) {
      return NextResponse.json({ message: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (newPassword) {
      const passwordUpdateResult = await updateUserPasswordByUsername(username, hashPassword(newPassword))

      if (passwordUpdateResult.degraded) {
        return NextResponse.json(
          { message: '현재 DB 연결 상태가 불안정하여 비밀번호를 수정할 수 없습니다. 잠시 후 다시 시도해주세요.' },
          { status: 503 }
        )
      }

      if (!passwordUpdateResult.updated) {
        return NextResponse.json({ message: '비밀번호 수정에 실패했습니다.' }, { status: 500 })
      }
    }

    return NextResponse.json(
      {
        message: '회원정보가 수정되었습니다.',
        user: {
          name: updateResult.user.name,
          role: updateResult.user.role,
          username: updateResult.user.username,
          birthDate: updateResult.user.birthDate,
          phone: updateResult.user.phone,
          postalCode,
          address,
          addressDetail,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: '회원정보 수정 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as DeleteAccountBody
    const username = body.username?.trim()
    const password = body.password ?? ''

    if (!username || !password) {
      return NextResponse.json({ message: '비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 회원탈퇴를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!lookupResult.user) {
      return NextResponse.json({ message: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (!verifyPassword(password, lookupResult.user.passwordHash)) {
      return NextResponse.json({ message: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const deleteResult = await deleteUserByUsername(username)

    if (deleteResult.degraded) {
      return NextResponse.json(
        { message: '현재 DB 연결 상태가 불안정하여 회원탈퇴를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 503 }
      )
    }

    if (!deleteResult.deleted) {
      return NextResponse.json({ message: '회원 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json({ message: '회원탈퇴가 완료되었습니다.' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        message: '회원탈퇴 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}
