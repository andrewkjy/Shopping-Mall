'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { categoryMenu } from '@/lib/storefrontData'

export default function StoreTopBand() {
  const [loggedInUsername, setLoggedInUsername] = useState('')
  const [isNameMenuOpen, setIsNameMenuOpen] = useState(false)
  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false)
  const nameMenuRef = useRef<HTMLDivElement | null>(null)
  const iconMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem('smmall-user')

    if (!storedUser) {
      setLoggedInUsername('')
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { username?: string }
      setLoggedInUsername(parsedUser.username ?? '')
    } catch {
      setLoggedInUsername('')
    }
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!nameMenuRef.current?.contains(event.target as Node)) {
        setIsNameMenuOpen(false)
      }

      if (!iconMenuRef.current?.contains(event.target as Node)) {
        setIsIconMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    return () => window.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleLogout = () => {
    window.sessionStorage.removeItem('smmall-user')
    setLoggedInUsername('')
    setIsNameMenuOpen(false)
    setIsIconMenuOpen(false)
    window.location.href = '/'
  }

  const handleCartClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (loggedInUsername) {
      return
    }

    event.preventDefault()
    window.alert('먼저 로그인해주세요.')
    window.location.href = '/auth?type=login'
  }

  return (
    <TopBand>
      <BandInner>
        <Header>
          <LogoLink href="/">SM Mall</LogoLink>
          <TopActions>
            {loggedInUsername ? (
              <>
                <UserMenuContainer ref={nameMenuRef}>
                  <UserNameButton
                    type="button"
                    onClick={() => {
                      setIsNameMenuOpen((prev) => !prev)
                      setIsIconMenuOpen(false)
                    }}
                  >
                    <UserLabel>{loggedInUsername}</UserLabel>
                  </UserNameButton>
                  {isNameMenuOpen && (
                    <UserMenuPanel>
                      <UserMenuAction type="button" onClick={handleLogout}>
                        로그아웃
                      </UserMenuAction>
                    </UserMenuPanel>
                  )}
                </UserMenuContainer>

                <UserMenuContainer ref={iconMenuRef}>
                  <UserIconButton
                    type="button"
                    aria-label="사용자 메뉴 열기"
                    onClick={() => {
                      setIsIconMenuOpen((prev) => !prev)
                      setIsNameMenuOpen(false)
                    }}
                  >
                    <UserIcon viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
                        fill="currentColor"
                      />
                    </UserIcon>
                  </UserIconButton>
                  {isIconMenuOpen && (
                    <UserMenuPanel>
                      <UserMenuLink href="/account/edit">회원정보 수정</UserMenuLink>
                      <UserMenuLink href="/account/delete">회원탈퇴</UserMenuLink>
                    </UserMenuPanel>
                  )}
                </UserMenuContainer>
              </>
            ) : (
              <TopLink href="/auth?type=login">로그인</TopLink>
            )}
            <CartLink href="/cart" aria-label="장바구니" onClick={handleCartClick}>
              <CartIcon viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3.75 4.5a.75.75 0 0 1 0-1.5h1.11c.84 0 1.57.58 1.75 1.41l.18.84h11.85a1.875 1.875 0 0 1 1.83 2.28l-1.03 4.84a2.625 2.625 0 0 1-2.57 2.08H9.53a2.625 2.625 0 0 1-2.57-2.08L5.4 5.25H3.75Zm3.56 2.25l1.12 5.25c.07.34.37.58.72.58h7.32c.34 0 .64-.24.71-.58l1.03-4.84a.375.375 0 0 0-.37-.45H7.31ZM9 18.75a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm8.25 1.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z"
                  fill="currentColor"
                />
              </CartIcon>
            </CartLink>
          </TopActions>
        </Header>

        <HeaderSearch role="search" onSubmit={(event) => event.preventDefault()}>
          <SearchInput type="search" placeholder="상품을 검색해보세요" aria-label="상품 검색" />
          <SearchButton type="submit" aria-label="검색">
            <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M10.5 4.75a5.75 5.75 0 1 0 0 11.5a5.75 5.75 0 0 0 0-11.5Zm-7.25 5.75a7.25 7.25 0 1 1 12.39 5.127l4.49 4.49a.75.75 0 1 1-1.06 1.06l-4.49-4.49A7.25 7.25 0 0 1 3.25 10.5Z"
                fill="currentColor"
              />
            </SearchIcon>
          </SearchButton>
        </HeaderSearch>

        <CategoryBar aria-label="상품 카테고리">
          {categoryMenu.map((category) => (
            <CategoryMenuItem key={category.key}>
              <CategoryBarLink href={`/shop?category=${category.key}`}>{category.label}</CategoryBarLink>
              <SubcategoryPanel>
                {getCategoryPreviewItems(category.key, category.subcategories).map((subcategory) => (
                  <SubcategoryLink
                    key={subcategory.label}
                    href={`/shop?category=${category.key}&subcategory=${encodeURIComponent(subcategory.value)}`}
                  >
                    {subcategory.label}
                  </SubcategoryLink>
                ))}
              </SubcategoryPanel>
            </CategoryMenuItem>
          ))}
        </CategoryBar>
      </BandInner>
    </TopBand>
  )
}

const getCategoryPreviewItems = (categoryKey: string, subcategories: readonly string[]) => {
  if (categoryKey === 'SHOES') {
    return [
      { label: '스니커즈', value: '스니커즈' },
      { label: '운동화', value: '운동화' },
      { label: '구두', value: '구두' },
      { label: '샌들/슬리퍼', value: '샌들' },
    ]
  }

  return subcategories.map((subcategory) => ({
    label: subcategory,
    value: subcategory,
  }))
}

const TopBand = styled.div`
  background:
    radial-gradient(circle at top left, rgba(120, 113, 108, 0.18), transparent 24%),
    linear-gradient(180deg, #18181b 0%, #292524 100%);
  margin-bottom: -1.86rem;
`

const BandInner = styled.div`
  width: min(1600px, 100%);
  margin: 0 auto;
  padding: 1.05rem 2.5rem 0 2.5rem;
  transform: scale(0.8);
  transform-origin: top center;
  will-change: transform;

  @media (max-width: 860px) {
    padding: 0.9rem 1rem 0 1rem;
    transform: none;
  }
`

const Header = styled.header`
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.35rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`

const LogoLink = styled(Link)`
  color: #fafaf9;
  text-decoration: none;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
`

const TopActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  justify-self: end;

  @media (max-width: 860px) {
    justify-self: start;
  }
`

const TopLink = styled(Link)`
  color: #fafaf9;
  text-decoration: none;
  font-weight: 700;
`

const UserMenuContainer = styled.div`
  position: relative;
  z-index: 20;
`

const UserNameButton = styled.button`
  border: none;
  background: transparent;
  color: #fafaf9;
  padding: 0;
  cursor: pointer;
  font: inherit;
`

const UserLabel = styled.span`
  color: #fafaf9;
  font-weight: 700;
`

const UserIconButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #fafaf9;
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
`

const UserIcon = styled.svg`
  width: 18px;
  height: 18px;
`

const UserMenuPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.7rem);
  right: 0;
  z-index: 30;
  min-width: 152px;
  padding: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(24, 24, 27, 0.96);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
`

const UserMenuAction = styled.button`
  display: block;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #fafaf9;
  text-align: left;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const UserMenuLink = styled(Link)`
  display: block;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border-radius: 12px;
  color: #fafaf9;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 700;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

const CartLink = styled(Link)`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #fafaf9;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.06);
`

const CartIcon = styled.svg`
  width: 18px;
  height: 18px;
`

const HeaderSearch = styled.form`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
  margin-bottom: 0.1rem;
  padding: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #fafaf9;
  font-size: 1rem;
  padding: 0.78rem 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.56);
  }
`

const SearchButton = styled.button`
  border: none;
  border-radius: 999px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  padding: 0;
  background: #fafaf9;
  color: #18181b;
  font-weight: 800;
  cursor: pointer;
`

const SearchIcon = styled.svg`
  width: 18px;
  height: 18px;
`

const CategoryBar = styled.nav`
  position: relative;
  z-index: 15;
  display: flex;
  justify-content: center;
  gap: 2.25rem;
  margin-top: 0.8rem;
  margin-bottom: -0.7rem;
  padding: 0 0 0.02rem;
  overflow: visible;

  @media (max-width: 960px) {
    justify-content: flex-start;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: visible;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const CategoryMenuItem = styled.div`
  position: relative;
  flex: 0 0 auto;
  padding-bottom: 0.8rem;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 0.7rem;
  }

  &:hover > div {
    opacity: 1;
    transform: translate(-50%, 0);
    pointer-events: auto;
  }
`

const CategoryBarLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: #fafaf9;
  text-decoration: none;
  font-size: 1.24rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    color: #ffffff;
    opacity: 0.86;
  }
`

const SubcategoryPanel = styled.div`
  position: absolute;
  top: calc(100% + 0.02rem);
  left: 50%;
  z-index: 40;
  display: flex;
  gap: 0.45rem;
  padding: 0.62rem 0.72rem;
  border: 1px solid #e7e5e4;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.14);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 6px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  @media (max-width: 960px) {
    left: 0;
    transform: translate(0, 6px);

    ${CategoryMenuItem}:hover > & {
      transform: translate(0, 0);
    }
  }
`

const SubcategoryLink = styled(Link)`
  padding: 0.48rem 0.72rem;
  border-radius: 10px;
  color: #44403c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  white-space: nowrap;

  &:hover {
    background: #f5f5f4;
    color: #111827;
  }
`
