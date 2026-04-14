'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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

type AccountForm = {
  name: string
  role: 'consumer' | 'seller' | ''
  username: string
  birthDate: string
  phone: string
  postalCode: string
  address: string
  addressDetail: string
}

type SessionUser = {
  name?: string
  role?: 'consumer' | 'seller'
  username?: string
}

type FieldErrors = Partial<Record<'name' | 'birthDate' | 'phone' | 'postalCode' | 'address' | 'currentPassword' | 'newPassword' | 'confirmNewPassword', string>>

const initialForm: AccountForm = {
  name: '',
  role: '',
  username: '',
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

export default function AccountEditPage() {
  const router = useRouter()
  const [form, setForm] = useState<AccountForm>(initialForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'neutral'>('neutral')
  const [isLoading, setIsLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

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

      setForm((prev) => ({
        ...prev,
        username: parsedUser.username ?? '',
      }))
    } catch {
      setMessage('로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.')
      setMessageTone('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const passwordsMatch = useMemo(() => {
    if (!newPassword || !confirmNewPassword) {
      return true
    }

    return newPassword === confirmNewPassword
  }, [confirmNewPassword, newPassword])

  const isPasswordRuleSatisfied = useMemo(() => {
    if (!newPassword) {
      return true
    }

    return isValidPassword(newPassword)
  }, [newPassword])

  const passwordMatchTone = !confirmNewPassword ? 'neutral' : passwordsMatch ? 'success' : 'error'
  const passwordMatchMessage = !confirmNewPassword
    ? ''
    : passwordsMatch
      ? '비밀번호가 일치합니다.'
      : '비밀번호가 일치하지 않습니다.'

  const passwordRuleTone = !newPassword ? 'neutral' : isPasswordRuleSatisfied ? 'success' : 'error'

  const setStatusMessage = (nextMessage: string, tone: 'success' | 'error' | 'neutral') => {
    setMessage(nextMessage)
    setMessageTone(tone)
  }

  const loadAccount = async (username: string) => {
    const response = await fetch(`/api/account?username=${encodeURIComponent(username)}`)
    const result = (await response.json()) as {
      message?: string
      user?: AccountForm & { phone: string }
    }

    if (!response.ok || !result.user) {
      throw new Error(result.message ?? '회원정보를 불러오지 못했습니다.')
    }

    setForm({
      ...result.user,
      phone: formatPhoneNumber(result.user.phone),
    })
  }

  const handleVerifyPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.username) {
      setStatusMessage('로그인 정보가 없습니다. 다시 로그인해주세요.', 'error')
      return
    }

    if (!currentPassword) {
      setFieldErrors((prev) => ({ ...prev, currentPassword: '비밀번호를 입력해주세요.' }))
      return
    }

    setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }))
    setIsVerifying(true)

    try {
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          password: currentPassword,
        }),
      })

      const result = (await response.json()) as { message?: string }

      if (!response.ok) {
        setStatusMessage(result.message ?? '비밀번호 확인에 실패했습니다.', 'error')
        return
      }

      await loadAccount(form.username)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setIsVerified(true)
      setStatusMessage('', 'neutral')
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : '비밀번호 확인에 실패했습니다.', 'error')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleChange =
    (field: keyof AccountForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }))
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
      setStatusMessage('', 'neutral')
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
          const extraAddress = data.addressType === 'R' ? [data.bname, data.buildingName].filter(Boolean).join(', ') : ''

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextFieldErrors: FieldErrors = {}

    if (!form.name.trim()) {
      nextFieldErrors.name = '이름을 입력해주세요.'
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

    if (newPassword || confirmNewPassword) {
      if (!currentPassword) {
        nextFieldErrors.currentPassword = '현재 비밀번호를 입력해주세요.'
      }

      if (!newPassword) {
        nextFieldErrors.newPassword = '새 비밀번호를 입력해주세요.'
      }

      if (!confirmNewPassword) {
        nextFieldErrors.confirmNewPassword = '비밀번호 확인을 입력해주세요.'
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors)
      return
    }

    if (newPassword && !isPasswordRuleSatisfied) {
      setStatusMessage('새 비밀번호는 8자 이상이며 숫자와 특수문자를 포함해야 합니다.', 'error')
      return
    }

    if (newPassword && !passwordsMatch) {
      setStatusMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error')
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.username,
          currentPassword,
          name: form.name.trim(),
          birthDate: form.birthDate,
          phone: form.phone.replace(/\D/g, ''),
          postalCode: form.postalCode.trim(),
          address: form.address.trim(),
          addressDetail: form.addressDetail.trim(),
          newPassword,
          confirmNewPassword,
        }),
      })

      const result = (await response.json()) as {
        message?: string
        user?: AccountForm & { name: string; role: 'consumer' | 'seller'; username: string }
      }

      if (!response.ok || !result.user) {
        setStatusMessage(result.message ?? '회원정보 수정에 실패했습니다.', 'error')
        return
      }

      window.sessionStorage.setItem(
        'smmall-user',
        JSON.stringify({
          name: result.user.name,
          role: result.user.role,
          username: result.user.username,
        })
      )

      window.alert(result.message ?? '회원정보가 수정되었습니다.')
      router.push('/')
    } catch {
      setStatusMessage('회원정보 수정 중 오류가 발생했습니다.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageShell>
        <Card>
          <Eyebrow>Account</Eyebrow>
          <Title>회원정보 수정</Title>

        {isLoading ? (
          <LoadingText>회원정보를 준비하는 중...</LoadingText>
        ) : !isVerified ? (
          <form onSubmit={handleVerifyPassword}>
            <FieldGroup>
              <Label htmlFor="currentPassword">비밀번호</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }))
                  setStatusMessage('', 'neutral')
                }}
                $hasError={Boolean(fieldErrors.currentPassword)}
              />
              {fieldErrors.currentPassword && <FieldError>{fieldErrors.currentPassword}</FieldError>}
            </FieldGroup>

            {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

            <SubmitButton type="submit" disabled={isVerifying}>
              {isVerifying ? '확인 중...' : '확인'}
            </SubmitButton>
          </form>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="name">이름</Label>
              <Input id="name" type="text" value={form.name} onChange={handleChange('name')} $hasError={Boolean(fieldErrors.name)} />
              {fieldErrors.name && <FieldError>{fieldErrors.name}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="usernameReadonly">아이디</Label>
              <Input id="usernameReadonly" type="text" value={form.username} disabled />
              <HelperText>아이디는 변경할 수 없습니다.</HelperText>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="currentPasswordEdit">현재 비밀번호</Label>
              <Input
                id="currentPasswordEdit"
                type="password"
                placeholder="현재 비밀번호를 입력해주세요"
                value={currentPassword}
                onChange={(event) => {
                  setCurrentPassword(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, currentPassword: undefined }))
                  setStatusMessage('', 'neutral')
                }}
                $hasError={Boolean(fieldErrors.currentPassword)}
              />
              {fieldErrors.currentPassword && <FieldError>{fieldErrors.currentPassword}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="newPassword">새 비밀번호</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="새 비밀번호를 입력해주세요"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, newPassword: undefined }))
                  setStatusMessage('', 'neutral')
                }}
                $hasError={Boolean(fieldErrors.newPassword)}
              />
              {fieldErrors.newPassword && <FieldError>{fieldErrors.newPassword}</FieldError>}
              {newPassword && (
                <HelperText $tone={passwordRuleTone}>8자 이상, 숫자 1개 이상, 특수문자 1개 이상 포함해야 합니다.</HelperText>
              )}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="confirmNewPassword">새 비밀번호 확인</Label>
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="새 비밀번호를 한 번 더 입력하세요"
                value={confirmNewPassword}
                onChange={(event) => {
                  setConfirmNewPassword(event.target.value)
                  setFieldErrors((prev) => ({ ...prev, confirmNewPassword: undefined }))
                  setStatusMessage('', 'neutral')
                }}
                $hasError={Boolean(fieldErrors.confirmNewPassword)}
              />
              {fieldErrors.confirmNewPassword && <FieldError>{fieldErrors.confirmNewPassword}</FieldError>}
              {passwordMatchMessage && <HelperText $tone={passwordMatchTone}>{passwordMatchMessage}</HelperText>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="birthDate">생년월일</Label>
              <BirthDateRow>
                <Input
                  id="birthDate"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={form.birthDate}
                  onChange={handleChange('birthDate')}
                  $hasError={Boolean(fieldErrors.birthDate)}
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="생년월일 8자리"
                  value={form.birthDate}
                  onChange={handleBirthDateTextChange}
                  $hasError={Boolean(fieldErrors.birthDate)}
                />
              </BirthDateRow>
              {fieldErrors.birthDate && <FieldError>{fieldErrors.birthDate}</FieldError>}
              <HelperText>달력으로 고르거나 숫자로 직접 입력할 수 있습니다.</HelperText>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                value={form.phone}
                onChange={handlePhoneChange}
                $hasError={Boolean(fieldErrors.phone)}
              />
              {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="postalCode">주소</Label>
              <AddressInlineRow>
                <PostalCodeField>
                  <Input
                    id="postalCode"
                    type="text"
                    placeholder="우편번호"
                    value={form.postalCode}
                    onChange={handleChange('postalCode')}
                    $hasError={Boolean(fieldErrors.postalCode)}
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
                <SearchButton type="button" onClick={handleSearchAddress} disabled={isSearchingAddress}>
                  {isSearchingAddress ? '검색 중' : '주소 검색'}
                </SearchButton>
              </AddressInlineRow>
              {fieldErrors.postalCode && <FieldError>{fieldErrors.postalCode}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <Input
                id="address"
                type="text"
                placeholder="기본 주소"
                value={form.address}
                onChange={handleChange('address')}
                $hasError={Boolean(fieldErrors.address)}
              />
              {fieldErrors.address && <FieldError>{fieldErrors.address}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <Input
                id="addressDetail"
                type="text"
                placeholder="상세주소를 입력하세요"
                value={form.addressDetail}
                onChange={handleChange('addressDetail')}
              />
            </FieldGroup>

            {message && <StatusMessage $tone={messageTone}>{message}</StatusMessage>}

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '수정 중...' : '수정'}
            </SubmitButton>
          </Form>
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
  width: min(100%, 560px);
  padding: 2rem;
  border-radius: 28px;
  background: white;
  border: 1px solid #e7e5e4;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.08);
`

const Form = styled.form``

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

const SectionTitle = styled.h2`
  margin: 0 0 0.5rem;
  color: #111827;
  font-size: 1.1rem;
`

const SectionDescription = styled.p`
  margin: 0 0 1rem;
  color: #6b7280;
  font-size: 0.9rem;
`

const SectionDivider = styled.hr`
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
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

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid ${({ $hasError }) => ($hasError ? '#dc2626' : '#d1d5db')};
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

const BirthDateRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

const SearchButton = styled.button`
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

const HelperText = styled.p<{ $tone?: 'success' | 'error' | 'neutral' }>`
  margin: 0.45rem 0 0;
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#6b7280')};
  font-size: 0.85rem;
`

const FieldError = styled.p`
  margin: 0.45rem 0 0;
  color: #dc2626;
  font-size: 0.85rem;
`

const StatusMessage = styled.p<{ $tone: 'success' | 'error' | 'neutral' }>`
  margin: 0 0 1rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: ${({ $tone }) => ($tone === 'success' ? '#f0fdf4' : $tone === 'error' ? '#fef2f2' : '#f5f5f5')};
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : $tone === 'error' ? '#dc2626' : '#3f3f46')};
  font-size: 0.95rem;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #3f3f46, #18181b);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`
