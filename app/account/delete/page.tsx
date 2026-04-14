'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

type SessionUser = {
  username?: string
}

export default function AccountDeletePage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'neutral'>('neutral')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem('smmall-user')

    if (!storedUser) {
      setMessage('로그인 정보가 없습니다. 다시 로그인해주세요.')
      setMessageTone('error')
      setIsLoading(false)
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser) as SessionUser

      if (!parsedUser.username) {
        throw new Error('INVALID_SESSION')
      }

      setUsername(parsedUser.username)
    } catch {
      setMessage('로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.')
      setMessageTone('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!password.trim()) {
      setMessage('비밀번호를 입력해주세요.')
      setMessageTone('error')
      return
    }

    if (!window.confirm('정말로 회원탈퇴를 진행하시겠습니까?')) {
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        setMessage(result.message ?? '회원탈퇴에 실패했습니다.')
        setMessageTone('error')
        return
      }

      window.sessionStorage.removeItem('smmall-user')
      window.alert(result.message ?? '회원탈퇴가 완료되었습니다.')
      router.push('/')
    } catch {
      setMessage('회원탈퇴 처리 중 오류가 발생했습니다.')
      setMessageTone('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell>
      <Card>
        <Eyebrow>Account</Eyebrow>
        <Title>회원탈퇴</Title>
        <Description>회원탈퇴를 진행하려면 비밀번호를 입력해주세요.</Description>

        {isLoading ? (
          <LoadingText>회원정보를 확인하는 중...</LoadingText>
        ) : (
          <DeleteForm onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="username">아이디</Label>
              <Input id="username" type="text" value={username} disabled />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setMessage('')
                }}
              />
            </FieldGroup>

            <WarningBox>
              회원탈퇴 후에는 계정을 다시 되돌릴 수 없습니다.
            </WarningBox>

            {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

            <ButtonRow>
              <BackButton type="button" onClick={() => router.push('/')}>
                취소
              </BackButton>
              <DeleteButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '처리 중...' : '회원탈퇴'}
              </DeleteButton>
            </ButtonRow>
          </DeleteForm>
        )}
      </Card>
    </PageShell>
  )
}

const PageShell = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%);
`

const Card = styled.section`
  width: min(100%, 480px);
  padding: 2rem;
  border-radius: 28px;
  background: white;
  border: 1px solid #e7e5e4;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.08);
`

const DeleteForm = styled.form``

const Eyebrow = styled.p`
  margin: 0;
  color: #78716c;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0.65rem 0 0;
  color: #111827;
  font-size: 2rem;
`

const Description = styled.p`
  margin: 0.85rem 0 1.5rem;
  color: #57534e;
  line-height: 1.7;
`

const LoadingText = styled.p`
  margin: 0;
  color: #57534e;
`

const FieldGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.45rem;
  color: #1f2937;
  font-size: 0.95rem;
  font-weight: 700;
`

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #fafafa;
  font-size: 1rem;
  color: #111827;

  &:disabled {
    color: #6b7280;
    background: #f5f5f4;
    cursor: not-allowed;
  }
`

const WarningBox = styled.p`
  margin: 0 0 1rem;
  padding: 0.95rem 1rem;
  border-radius: 14px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.92rem;
  line-height: 1.6;
`

const StatusMessage = styled.p<{ $tone: 'success' | 'error' | 'neutral' }>`
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: ${({ $tone }) => ($tone === 'success' ? '#f0fdf4' : $tone === 'error' ? '#fef2f2' : '#f5f5f5')};
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#3f3f46')};
  font-size: 0.95rem;
`

const ButtonRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
`

const BackButton = styled.button`
  padding: 1rem;
  border: 1px solid #d6d3d1;
  border-radius: 16px;
  background: white;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`

const DeleteButton = styled.button`
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #dc2626, #991b1b);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`
