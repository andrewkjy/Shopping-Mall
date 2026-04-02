'use client'

import { useState } from 'react'
import styled from 'styled-components'

export default function ForgetPassword() {
  const [username, setUsername] = useState('')

  const handleSendCode = async () => {
    const response = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })

    alert(response.ok ? '재설정 안내를 전송했습니다.' : '재설정 요청에 실패했습니다.')
  }

  return (
    <ForgetPasswordBox>
      <Brand>MyShoppingMall</Brand>
      <Title>비밀번호 찾기</Title>
      <Subtitle>가입한 아이디를 입력하면 재설정 안내를 보낼 수 있습니다.</Subtitle>

      <InputField
        type="text"
        placeholder="아이디를 입력하세요"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <SendCodeButton type="button" onClick={handleSendCode}>
        재설정 요청
      </SendCodeButton>
    </ForgetPasswordBox>
  )
}

const ForgetPasswordBox = styled.div`
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

const SendCodeButton = styled.button`
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
