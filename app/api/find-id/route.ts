import { NextRequest, NextResponse } from 'next/server'
import { findUserByNameAndPhone } from '@/lib/userStore'

type FindIdBody = {
  name?: string
  phone?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FindIdBody
    const name = body.name?.trim()
    const phone = body.phone?.replace(/\D/g, '')

    if (!name || !phone) {
      return NextResponse.json({ message: '이름과 전화번호를 입력해주세요.' }, { status: 400 })
    }

    const lookupResult = await findUserByNameAndPhone(name, phone)

    if (lookupResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 아이디 찾기를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
        },
        { status: 503 }
      )
    }

    if (!lookupResult.user) {
      return NextResponse.json({ message: '입력한 정보와 일치하는 아이디를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: `회원님의 아이디는 ${lookupResult.user.username} 입니다.`,
        username: lookupResult.user.username,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: '아이디 찾기 처리 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'unknown error',
      },
      { status: 500 }
    )
  }
}
