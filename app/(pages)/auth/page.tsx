'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import SignUp from './Signup'
import ForgetPassword from './ForgetPass'

function AuthContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    alert(response.ok ? '로그인에 성공했습니다.' : '로그인에 실패했습니다.')
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
        <ForgetPassword />
      </Container>
    )
  }

  return (
    <Container>
      <LoginBox>
        <Brand>MyShoppingMall</Brand>
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

        <LoginButton type="button" onClick={handleLogin}>
          로그인
        </LoginButton>

        <Links>
          <a href="/auth?type=forgetpass">비밀번호를 잊으셨나요?</a>
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
  background:
    radial-gradient(circle at top, rgba(245, 158, 11, 0.18), transparent 30%),
    linear-gradient(180deg, #fff7ed 0%, #f8fafc 55%, #eef2ff 100%);
`

const LoginBox = styled.div`
  width: min(100%, 420px);
  padding: 2rem;
  border-radius: 24px;
  background: white;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.14);
`

const Brand = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #b45309;
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
  background: #f9fafb;
  font-size: 1rem;
`

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #111827, #374151);
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
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }
`

const Fallback = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
`
