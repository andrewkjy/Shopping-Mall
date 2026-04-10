'use client'

import styled from 'styled-components'

export default function AccountEditPage() {
  return (
    <PageShell>
      <Card>
        <Eyebrow>Account</Eyebrow>
        <Title>회원정보 수정</Title>
        <Description>여기서 회원정보 수정 기능을 이어서 붙일 수 있습니다.</Description>
        <BackLink href="/">메인홈으로 돌아가기</BackLink>
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
  margin: 0.85rem 0 0;
  color: #57534e;
  line-height: 1.7;
`

const BackLink = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  color: #1f2937;
  text-decoration: none;
  font-weight: 700;
`
