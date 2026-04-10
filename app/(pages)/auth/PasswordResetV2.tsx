'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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

function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return hasMinLength && hasNumber && hasSpecialChar
}

export default function PasswordResetV2() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'neutral'>('neutral')

  const passwordsMatch = useMemo(() => {
    if (!password || !confirmPassword) {
      return true
    }

    return password === confirmPassword
  }, [confirmPassword, password])

  const passwordMatchTone = !confirmPassword ? 'neutral' : passwordsMatch ? 'success' : 'error'
  const passwordMatchMessage = !confirmPassword
    ? ''
    : passwordsMatch
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.'

  const isPasswordRuleSatisfied = useMemo(() => {
    if (!password) {
      return true
    }

    return isValidPassword(password)
  }, [password])

  const shouldHidePasswordRuleSuccess = Boolean(confirmPassword) && passwordsMatch
  const passwordRuleTone =
    !password || shouldHidePasswordRuleSuccess ? 'neutral' : isPasswordRuleSatisfied ? 'success' : 'error'

  const handleVerify = async () => {
    const response = await fetch('/api/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        phone: phone.replace(/\D/g, ''),
      }),
    })

    const result = (await response.json()) as { message?: string; verified?: boolean }
    setMessage(result.message ?? '본인 확인 결과를 확인해주세요.')
    setMessageTone(response.ok ? 'success' : 'error')
    setIsVerified(Boolean(response.ok && result.verified))
  }

  const handleResetPassword = async () => {
    const response = await fetch('/api/password-reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim(),
        phone: phone.replace(/\D/g, ''),
        password,
        confirmPassword,
      }),
    })

    const result = (await response.json()) as { message?: string }
    setMessage(result.message ?? '비밀번호 재설정 결과를 확인해주세요.')
    setMessageTone(response.ok ? 'success' : 'error')

    if (response.ok) {
      setPassword('')
      setConfirmPassword('')
      setIsVerified(false)
      const successMessage = result.message ?? '비밀번호가 재설정되었습니다.'
      window.alert(successMessage)
      router.push('/auth?type=login')
    }
  }

  return (
    <PasswordResetBox>
      <Brand>SM Mall</Brand>
      <Title>비밀번호 재설정</Title>
      <Subtitle>가입한 아이디와 전화번호를 입력한 뒤 새 비밀번호를 설정할 수 있습니다.</Subtitle>

      <InputField
        type="text"
        placeholder="아이디를 입력하세요"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <InputField
        type="text"
        inputMode="numeric"
        placeholder="전화번호를 입력하세요"
        value={phone}
        onChange={(event) => setPhone(formatPhoneNumber(event.target.value))}
      />

      {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

      <ActionButton type="button" onClick={handleVerify}>
        확인
      </ActionButton>

      {isVerified && (
        <ResetSection>
          <InputField
            type="password"
            placeholder="새 비밀번호를 입력해주세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {(!shouldHidePasswordRuleSuccess || !isPasswordRuleSatisfied) && (
            <HelperText $tone={passwordRuleTone}>8자 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야 합니다.</HelperText>
          )}

          <InputField
            type="password"
            placeholder="새 비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
          {passwordMatchMessage && <HelperText $tone={passwordMatchTone}>{passwordMatchMessage}</HelperText>}

          {!isPasswordRuleSatisfied && (
            <InlineWarning>비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.</InlineWarning>
          )}

          <ActionButton type="button" onClick={handleResetPassword}>
            비밀번호 재설정
          </ActionButton>
        </ResetSection>
      )}

      <HintLinks>
        <HintLink href="/auth?type=login">로그인 하러 가기</HintLink>
        <HintLink href="/auth?type=find-id">아이디를 잃어버리셨나요?</HintLink>
      </HintLinks>
    </PasswordResetBox>
  )
}

const PasswordResetBox = styled.div`
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

const ActionButton = styled.button`
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

const ResetSection = styled.div`
  margin-top: 1rem;
`

const HelperText = styled.p<{ $tone?: 'success' | 'error' | 'neutral' }>`
  margin: -0.55rem 0 1rem;
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#6b7280')};
  font-size: 0.78rem;
  white-space: nowrap;
`

const InlineWarning = styled.p`
  margin: -0.25rem 0 1rem;
  color: #52525b;
  font-size: 0.9rem;
`

const HintLinks = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const HintLink = styled.a`
  display: block;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  text-decoration: none;
`
