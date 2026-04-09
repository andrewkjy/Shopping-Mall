'use client'

import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import styled from 'styled-components'

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string
          address: string
          addressType: 'R' | 'J'
          bname: string
          buildingName: string
        }) => void
      }) => {
        open: () => void
      }
    }
  }
}

type FormState = {
  name: string
  username: string
  password: string
  confirmPassword: string
  birthDate: string
  phone: string
  postalCode: string
  address: string
  addressDetail: string
}

type FieldErrors = Partial<Record<keyof FormState, string>>

const initialForm: FormState = {
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  phone: '',
  postalCode: '',
  address: '',
  addressDetail: '',
}

function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  return hasMinLength && hasNumber && hasSpecialChar
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 4) {
    return digits
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`
}

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

function loadDaumPostcodeScript() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('BROWSER_ONLY'))
      return
    }

    if (window.daum?.Postcode) {
      resolve()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-daum-postcode="true"]')

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('SCRIPT_LOAD_FAILED')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.dataset.daumPostcode = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('SCRIPT_LOAD_FAILED'))
    document.body.appendChild(script)
  })
}

export default function SignUp() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isChecking, setIsChecking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
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

  const passwordMatchTone = !form.confirmPassword ? 'neutral' : passwordsMatch ? 'success' : 'error'
  const passwordMatchMessage = !form.confirmPassword
    ? ''
    : passwordsMatch
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.'

  const isPasswordRuleSatisfied = useMemo(() => {
    if (!form.password) {
      return true
    }

    return isValidPassword(form.password)
  }, [form.password])

  const shouldHidePasswordRuleSuccess = Boolean(form.confirmPassword) && passwordsMatch
  const passwordRuleTone =
    !form.password || shouldHidePasswordRuleSuccess ? 'neutral' : isPasswordRuleSatisfied ? 'success' : 'error'

  const setStatusMessage = (nextMessage: string, tone: 'success' | 'error' | 'neutral') => {
    setMessage(nextMessage)
    setMessageTone(tone)
  }

  const handleBirthDateTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatBirthDateInput(event.target.value)

    setForm((prev) => ({
      ...prev,
      birthDate: formattedValue,
    }))

    setFieldErrors((prev) => ({ ...prev, birthDate: undefined }))
    setStatusMessage('', 'neutral')
  }

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(event.target.value)

    setForm((prev) => ({
      ...prev,
      phone: formattedValue,
    }))

    setFieldErrors((prev) => ({ ...prev, phone: undefined }))
    setStatusMessage('', 'neutral')
  }

  const handleSearchAddress = async () => {
    setIsSearchingAddress(true)

    try {
      await loadDaumPostcodeScript()

      if (!window.daum?.Postcode) {
        throw new Error('POSTCODE_NOT_AVAILABLE')
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const extraAddress =
            data.addressType === 'R' ? [data.bname, data.buildingName].filter(Boolean).join(', ') : ''

          setForm((prev) => ({
            ...prev,
            postalCode: data.zonecode,
            address: extraAddress ? `${data.address} (${extraAddress})` : data.address,
          }))

          setFieldErrors((prev) => ({
            ...prev,
            postalCode: undefined,
            address: undefined,
          }))
          setStatusMessage('', 'neutral')
          setIsSearchingAddress(false)
        },
      }).open()
    } catch {
      setStatusMessage('주소 검색을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.', 'error')
      setIsSearchingAddress(false)
    }
  }

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))

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

    const nextFieldErrors: FieldErrors = {}

    if (!form.name.trim()) {
      nextFieldErrors.name = '이름을 입력해주세요.'
    }

    if (!form.username.trim()) {
      nextFieldErrors.username = '아이디를 입력해주세요.'
    }

    if (!form.password) {
      nextFieldErrors.password = '비밀번호를 입력해주세요.'
    }

    if (!form.confirmPassword) {
      nextFieldErrors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    }

    if (!form.birthDate.trim()) {
      nextFieldErrors.birthDate = '생년월일을 입력해주세요.'
    }

    if (form.phone.replace(/\D/g, '').length !== 11) {
      nextFieldErrors.phone = '전화번호를 입력해주세요.'
    }

    if (!form.postalCode.trim()) {
      nextFieldErrors.postalCode = '우편번호를 입력해주세요.'
    }

    if (!form.address.trim()) {
      nextFieldErrors.address = '기본 주소를 입력해주세요.'
    }

    if (!form.addressDetail.trim()) {
      nextFieldErrors.addressDetail = '상세주소를 입력해주세요.'
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    setFieldErrors({})

    if (!idChecked || !idAvailable) {
      setFieldErrors((prev) => ({
        ...prev,
        username: '아이디 중복 검사를 완료해주세요.',
      }))
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

    if (!form.postalCode || !form.address.trim()) {
      setStatusMessage('주소 검색을 통해 기본 주소를 입력해주세요.', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const fullAddress = [form.postalCode.trim(), form.address.trim(), form.addressDetail.trim()]
        .filter(Boolean)
        .join(' ')

      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          username: form.username.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          birthDate: form.birthDate,
          phone: form.phone.replace(/\D/g, ''),
          address: fullAddress,
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
      <Brand>SM Mall</Brand>
      <Title>회원가입</Title>
      <Subtitle>아이디 중복 검사를 완료한 뒤 가입할 수 있습니다.</Subtitle>

      <FieldGroup>
        <Label htmlFor="name">이름</Label>
        <Input
          $hasError={Boolean(fieldErrors.name)}
          id="name"
          type="text"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={handleChange('name')}
        />
        {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="username">아이디</Label>
        <InlineRow>
          <Input
            $hasError={Boolean(fieldErrors.username)}
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
        {fieldErrors.username && <FieldError>{fieldErrors.username}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          $hasError={Boolean(fieldErrors.password)}
          id="password"
          type="password"
          placeholder="8자 이상, 숫자/특수문자 포함"
          value={form.password}
          onChange={handleChange('password')}
        />
        {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
        {(!shouldHidePasswordRuleSuccess || !isPasswordRuleSatisfied) && (
          <HelperText $tone={passwordRuleTone}>8자 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야 합니다.</HelperText>
        )}
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          $hasError={Boolean(fieldErrors.confirmPassword)}
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 한 번 더 입력하세요"
          value={form.confirmPassword}
          onChange={handleChange('confirmPassword')}
        />
        {fieldErrors.confirmPassword && <FieldError>{fieldErrors.confirmPassword}</FieldError>}
        {passwordMatchMessage && <HelperText $tone={passwordMatchTone}>{passwordMatchMessage}</HelperText>}
      </FieldGroup>

      {!isPasswordRuleSatisfied && (
        <InlineWarning>비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.</InlineWarning>
      )}

      <FieldGroup>
        <Label htmlFor="birthDate">생년월일</Label>
        <BirthDateRow>
          <Input
            $hasError={Boolean(fieldErrors.birthDate)}
            id="birthDate"
            type="date"
            max={new Date().toISOString().split('T')[0]}
            value={form.birthDate}
            onChange={handleChange('birthDate')}
          />
          <Input
            $hasError={Boolean(fieldErrors.birthDate)}
            type="text"
            inputMode="numeric"
            placeholder="생년월일 8자리"
            value={form.birthDate}
            onChange={handleBirthDateTextChange}
          />
        </BirthDateRow>
        {fieldErrors.birthDate && <FieldError>{fieldErrors.birthDate}</FieldError>}
        <HelperText>달력으로 고르거나 숫자로 직접 입력할 수 있습니다.</HelperText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="phone">전화번호</Label>
        <Input
          $hasError={Boolean(fieldErrors.phone)}
          id="phone"
          type="text"
          inputMode="numeric"
          placeholder="전화번호를 입력하세요"
          value={form.phone}
          onChange={handlePhoneChange}
        />
        {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="postalCode">배송지</Label>
        <AddressInlineRow>
          <PostalCodeField>
            <Input
              $hasError={Boolean(fieldErrors.postalCode)}
              id="postalCode"
              type="text"
              placeholder="우편번호"
              value={form.postalCode}
              onChange={handleChange('postalCode')}
            />
            {(form.postalCode || form.address || form.addressDetail) && (
              <ClearIconButton
                type="button"
                aria-label="주소 입력 지우기"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    postalCode: '',
                    address: '',
                    addressDetail: '',
                  }))
                }
              >
                X
              </ClearIconButton>
            )}
          </PostalCodeField>
          <CheckButton type="button" onClick={handleSearchAddress} disabled={isSearchingAddress}>
            {isSearchingAddress ? '검색 중' : '주소 검색'}
          </CheckButton>
        </AddressInlineRow>
        {fieldErrors.postalCode && <FieldError>{fieldErrors.postalCode}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Input
          $hasError={Boolean(fieldErrors.address)}
          id="address"
          type="text"
          placeholder="기본 주소"
          value={form.address}
          onChange={handleChange('address')}
        />
        {fieldErrors.address && <FieldError>{fieldErrors.address}</FieldError>}
      </FieldGroup>

      <FieldGroup>
        <Input
          $hasError={Boolean(fieldErrors.addressDetail)}
          id="addressDetail"
          type="text"
          placeholder="상세주소를 입력하세요"
          value={form.addressDetail}
          onChange={handleChange('addressDetail')}
        />
        {fieldErrors.addressDetail && <FieldError>{fieldErrors.addressDetail}</FieldError>}
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

const AddressInlineRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 124px;
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const PostalCodeField = styled.div`
  position: relative;
`

const BirthDateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#dc2626' : '#d1d5db')};
  border-radius: 14px;
  background: #fafafa;
  font-size: 1rem;
  color: #111827;
`

const CheckButton = styled.button`
  padding: 0.9rem 1rem;
  border: none;
  border-radius: 14px;
  background: #52525b;
  color: white;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`

const ClearIconButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0.8rem;
  transform: translateY(-50%);
  width: 1.6rem;
  height: 1.6rem;
  border: none;
  border-radius: 999px;
  background: #e5e7eb;
  color: #52525b;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
`

const SignUpButton = styled.button`
  width: 100%;
  margin-top: 0.5rem;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #3f3f46, #18181b);
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
  color: #52525b;
  font-size: 0.9rem;
`

const FieldError = styled.p`
  margin: 0.45rem 0 0;
  color: #dc2626;
  font-size: 0.85rem;
`

const HelperText = styled.p<{ $tone?: 'success' | 'error' | 'neutral' }>`
  margin: 0.45rem 0 0;
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#6b7280')};
  font-size: 0.85rem;
`

const StatusMessage = styled.p<{ $tone: 'success' | 'error' | 'neutral' }>`
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: ${({ $tone }) => ($tone === 'success' ? '#f5f5f5' : $tone === 'error' ? '#eeeeee' : '#f5f5f5')};
  color: ${({ $tone }) => ($tone === 'success' ? '#3f3f46' : $tone === 'error' ? '#18181b' : '#3f3f46')};
  font-size: 0.95rem;
`

const Links = styled.div`
  margin-top: 1rem;
  text-align: center;

  a {
    color: #3f3f46;
    text-decoration: none;
    font-weight: 600;
  }
`
