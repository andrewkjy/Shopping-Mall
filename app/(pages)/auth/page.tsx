'use client'

import { FormEvent, Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import SignUp from './Signup'
import FindId from './FindId'
import PasswordResetV2 from './PasswordResetV2'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const result = (await response.json()) as {
      message?: string
      user?: { username?: string; name?: string; role?: string }
    }

    if (!response.ok) {
      alert(result.message ?? '로그인에 실패했습니다.')
      return
    }

    if (result.user?.username) {
      window.sessionStorage.setItem(
        'smmall-user',
        JSON.stringify({
          username: result.user.username,
          name: result.user.name ?? '',
          role: result.user.role ?? '',
        })
      )
    }

    router.push('/')
  }

  if (type === 'sign-up') {
    return (
      <Container>
        <SignUp />
      </Container>
    )
  }

  if (type === 'forgetpass') {
    return (
      <Container>
        <PasswordResetV2 />
      </Container>
    )
  }

  if (type === 'find-id') {
    return (
      <Container>
        <FindId />
      </Container>
    )
  }

  return (
    <Container>
      <LoginBox as="form" onSubmit={handleLogin}>
        <Brand>SM Mall</Brand>
        <Title>로그인</Title>
        <Subtitle>가입한 아이디와 비밀번호로 로그인하세요.</Subtitle>

        <InputField
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <InputField
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <LoginButton type="submit">
          로그인
        </LoginButton>

        <Links>
          <a href="/auth?type=find-id">아이디를 잃어버리셨나요?</a>
          <a href="/auth?type=forgetpass">비밀번호를 잃어버리셨나요?</a>
          <a href="/auth?type=sign-up">회원가입 하러가기</a>
        </Links>
      </LoginBox>
    </Container>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<Fallback>불러오는 중...</Fallback>}>
      <AuthContent />
    </Suspense>
  )
}

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  background: radial-gradient(circle at top, rgba(0, 0, 0, 0.03), transparent 28%),
    linear-gradient(180deg, #ffffff 0%, #fafafa 52%, #f3f4f6 100%);
`

const LoginBox = styled.div`
  width: min(100%, 420px);
  padding: 2rem;
  border-radius: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08);
`

const Brand = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #525252;
  text-transform: uppercase;
`

const Title = styled.h2`
  margin: 0.5rem 0 0;
  font-size: 2rem;
  color: #111827;
`

const Subtitle = styled.p`
  margin: 0.5rem 0 1.5rem;
  color: #6b7280;
`

const InputField = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #fafafa;
  font-size: 1rem;
`

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #3f3f46, #18181b);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`

const Links = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  a {
    color: #3f3f46;
    text-decoration: none;
    font-weight: 600;
  }
`

const Fallback = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`
