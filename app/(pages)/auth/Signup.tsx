'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import styled from 'styled-components'

type FormState = {
  username: string
  password: string
  confirmPassword: string
  age: string
  phone: string
  address: string
}

const initialForm: FormState = {
  username: '',
  password: '',
  confirmPassword: '',
  age: '',
  phone: '',
  address: '',
}

function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return hasMinLength && hasNumber && hasSpecialChar
}

export default function SignUp() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [idChecked, setIdChecked] = useState(false)
  const [idAvailable, setIdAvailable] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'neutral'>('neutral')

  const passwordsMatch = useMemo(() => {
    if (!form.password || !form.confirmPassword) {
      return true
    }

    return form.password === form.confirmPassword
  }, [form.confirmPassword, form.password])

  const isPasswordRuleSatisfied = useMemo(() => {
    if (!form.password) {
      return true
    }

    return isValidPassword(form.password)
  }, [form.password])

  const setStatusMessage = (nextMessage: string, tone: 'success' | 'error' | 'neutral') => {
    setMessage(nextMessage)
    setMessageTone(tone)
  }

  const handleChange =
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))

      if (field === 'username') {
        setIdChecked(false)
        setIdAvailable(false)
      }

      setStatusMessage('', 'neutral')
    }

  const handleCheckDuplicate = async () => {
    const username = form.username.trim()

    if (username.length < 4) {
      setIdChecked(false)
      setIdAvailable(false)
      setStatusMessage('아이디는 4자 이상 입력해주세요.', 'error')
      return
    }

    setIsChecking(true)

    try {
      const response = await fetch(`/api/signup/check-id?username=${encodeURIComponent(username)}`)
      const result = (await response.json()) as { available?: boolean; message?: string }

      if (!response.ok) {
        setIdChecked(false)
        setIdAvailable(false)
        setStatusMessage(result.message ?? '중복 검사 중 오류가 발생했습니다.', 'error')
        return
      }

      setIdChecked(true)
      setIdAvailable(Boolean(result.available))
      setStatusMessage(result.message ?? '중복 검사를 완료했습니다.', result.available ? 'success' : 'error')
    } catch {
      setIdChecked(false)
      setIdAvailable(false)
      setStatusMessage('중복 검사 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!idChecked || !idAvailable) {
      setStatusMessage('아이디 중복 검사를 먼저 완료해주세요.', 'error')
      return
    }

    if (!passwordsMatch) {
      setStatusMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error')
      return
    }

    if (!isPasswordRuleSatisfied) {
      setStatusMessage('비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          age: Number(form.age),
          phone: form.phone.trim(),
          address: form.address.trim(),
        }),
      })

      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatusMessage(result.message ?? '회원가입에 실패했습니다.', 'error')
        return
      }

      setForm(initialForm)
      setIdChecked(false)
      setIdAvailable(false)
      setStatusMessage(result.message ?? '회원가입이 완료되었습니다.', 'success')
    } catch {
      setStatusMessage('회원가입 요청 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SignUpBox as="form" onSubmit={handleSubmit}>
      <Brand>MyShoppingMall</Brand>
      <Title>회원가입</Title>
      <Subtitle>아이디 중복 검사를 완료한 뒤 가입할 수 있습니다.</Subtitle>

      <FieldGroup>
        <Label htmlFor="username">아이디</Label>
        <InlineRow>
          <Input
            id="username"
            type="text"
            placeholder="아이디를 입력하세요"
            value={form.username}
            onChange={handleChange('username')}
          />
          <CheckButton type="button" onClick={handleCheckDuplicate} disabled={isChecking}>
            {isChecking ? '확인 중' : '중복 검사'}
          </CheckButton>
        </InlineRow>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="8자 이상, 숫자/특수문자 포함"
          value={form.password}
          onChange={handleChange('password')}
        />
        <HelperText>8자 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야 합니다.</HelperText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
        />
      </FieldGroup>

      {!isPasswordRuleSatisfied && (
        <InlineWarning>비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.</InlineWarning>
      )}
      {!passwordsMatch && <InlineWarning>비밀번호가 서로 다릅니다.</InlineWarning>}

      <FieldGroup>
        <Label htmlFor="age">나이</Label>
        <Input
          id="age"
          type="number"
          min="0"
          placeholder="나이를 입력하세요"
          value={form.age}
          onChange={handleChange('age')}
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="phone">전화번호</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="전화번호를 입력하세요"
          value={form.phone}
          onChange={handleChange('phone')}
        />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="address">배송지</Label>
        <TextArea
          id="address"
          placeholder="배송지를 입력하세요"
          value={form.address}
          onChange={handleChange('address')}
          rows={4}
        />
      </FieldGroup>

      {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

      <SignUpButton type="submit" disabled={isSubmitting}>
        {isSubmitting ? '가입 처리 중...' : '회원가입'}
      </SignUpButton>

      <Links>
        <a href="/auth?type=login">이미 계정이 있나요? 로그인</a>
      </Links>
    </SignUpBox>
  )
}

const SignUpBox = styled.form`
  width: min(100%, 540px);
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

const FieldGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.45rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
`

const InlineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 124px;
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #f9fafb;
  font-size: 1rem;
  color: #111827;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: #f9fafb;
  font-size: 1rem;
  color: #111827;
  resize: vertical;
`

const CheckButton = styled.button`
  padding: 0.9rem 1rem;
  border: none;
  border-radius: 14px;
  background: #d97706;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`

const SignUpButton = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #111827, #374151);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`

const InlineWarning = styled.p`
  margin: -0.25rem 0 1rem;
  color: #dc2626;
  font-size: 0.9rem;
`

const HelperText = styled.p`
  margin: 0.45rem 0 0;
  color: #6b7280;
  font-size: 0.85rem;
`

const StatusMessage = styled.p<{ $tone: 'success' | 'error' | 'neutral' }>`
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: ${({ $tone }) =>
    $tone === 'success' ? '#ecfdf5' : $tone === 'error' ? '#fef2f2' : '#f3f4f6'};
  color: ${({ $tone }) =>
    $tone === 'success' ? '#047857' : $tone === 'error' ? '#b91c1c' : '#374151'};
  font-size: 0.95rem;
`

const Links = styled.div`
  margin-top: 1rem;
  text-align: center;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
  }
`
