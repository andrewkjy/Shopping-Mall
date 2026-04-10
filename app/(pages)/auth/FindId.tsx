'use client'

import { useState } from 'react'
import styled from 'styled-components'

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) {
    return digits
  }

  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export default function FindId() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'neutral'>('neutral')

  const handleFindId = async () => {
    if (!name.trim() || phone.replace(/\D/g, '').length !== 11) {
      setMessage('이름과 전화번호를 정확히 입력해주세요.')
      setMessageTone('error')
      return
    }

    const response = await fetch('/api/find-id', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
      }),
    })

    const result = (await response.json()) as { message?: string }

    setMessage(result.message ?? '아이디 찾기 결과를 확인해주세요.')
    setMessageTone(response.ok ? 'success' : 'error')
  }

  return (
    <FindIdBox>
      <Brand>SM Mall</Brand>
      <Title>아이디 찾기</Title>
      <Subtitle>가입할 때 입력한 이름과 전화번호를 입력해주세요.</Subtitle>

      <InputField
        type="text"
        placeholder="이름을 입력하세요"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <InputField
        type="text"
        inputMode="numeric"
        placeholder="전화번호를 입력하세요"
        value={phone}
        onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
      />

      {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

      <ConfirmButton type="button" onClick={handleFindId}>
        확인
      </ConfirmButton>

      <Links>
        <a href="/auth?type=login">로그인 하러 가기</a>
        <a href="/auth?type=forgetpass">비밀번호를 잃어버리셨나요?</a>
      </Links>
    </FindIdBox>
  )
}

const FindIdBox = styled.div`
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

const ConfirmButton = styled.button`
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

const StatusMessage = styled.p<{ $tone: 'success' | 'error' | 'neutral' }>`
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: ${({ $tone }) => ($tone === 'success' ? '#f0fdf4' : $tone === 'error' ? '#fef2f2' : '#f5f5f5')};
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#3f3f46')};
  font-size: 0.95rem;
`

const Links = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;

  a {
    color: #3f3f46;
    text-decoration: none;
    font-weight: 600;
  }
`
