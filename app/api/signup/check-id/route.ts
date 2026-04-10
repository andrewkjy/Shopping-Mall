import { NextRequest, NextResponse } from 'next/server'
import { findUserByUsername } from '@/lib/userStore'

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username')?.trim()

    if (!username) {
      return NextResponse.json({ message: '아이디를 입력해주세요.', available: false }, { status: 400 })
    }

    const lookupResult = await findUserByUsername(username)

    if (lookupResult.degraded) {
      return NextResponse.json(
        {
          message: '현재 DB 연결 상태가 불안정하여 아이디 중복 확인을 진행할 수 없습니다. 잠시 후 다시 시도해주세요.',
          available: false,
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      available: !lookupResult.user,
      message: lookupResult.user ? '이미 사용 중인 아이디입니다.' : '사용 가능한 아이디입니다.',
    })
  } catch (error) {
    console.error('[signup/check-id] duplicate check failed:', error)

    const detail = error instanceof Error ? error.message : 'unknown error'

    return NextResponse.json(
      {
        message: `중복 검사 중 오류가 발생했습니다. ${detail}`,
        available: false,
        error: detail,
      },
      { status: 500 }
    )
  }
}
