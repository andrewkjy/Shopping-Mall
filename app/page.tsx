'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const heroSlides = [
  {
    title: 'Urban Tailored Layers',
    description: 'Structured outerwear, refined knits, and clean silhouettes for a sharper everyday wardrobe.',
    tag: 'Spring Edit',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=80',
  },
  {
    title: 'Minimal Weekend Uniform',
    description: 'Relaxed shirts, washed denim, and premium basics built for calm but confident styling.',
    tag: 'Weekend Drop',
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=2200&q=80',
  },
  {
    title: 'Modern Business Casual',
    description: 'Lightweight jackets and monochrome essentials that keep a polished mood without feeling rigid.',
    tag: 'Office Ready',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=2200&q=80',
  },
  {
    title: 'Night Shift Essentials',
    description: 'Dark palettes, textured fabrics, and bold details for a stronger statement after sunset.',
    tag: 'After Dark',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2200&q=80',
  },
]

const featuredProducts = [
  {
    name: 'Boxy Harrington Jacket',
    price: '119,000원',
    tag: 'BEST',
    tone: 'linear-gradient(135deg, #d6d3d1, #78716c)',
  },
  {
    name: 'Premium Oxford Shirt',
    price: '59,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)',
  },
  {
    name: 'Straight Fit Denim',
    price: '72,000원',
    tag: 'HOT',
    tone: 'linear-gradient(135deg, #1f2937, #6b7280)',
  },
  {
    name: 'Leather Derby Shoes',
    price: '138,000원',
    tag: 'MD PICK',
    tone: 'linear-gradient(135deg, #44403c, #0f172a)',
  },
]

const categories = ['Outer', 'Shirts', 'Denim', 'Slacks', 'Shoes', 'Accessories']
const headerCategories = ['상의', '하의', '자켓', '패딩', '신발', '가방', '액세서리']

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loggedInUsername, setLoggedInUsername] = useState('')
  const [isNameMenuOpen, setIsNameMenuOpen] = useState(false)
  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false)
  const nameMenuRef = useRef<HTMLDivElement | null>(null)
  const iconMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3800)

    return () => window.clearInterval(interval)
  }, [])

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

  return (
    <PageShell>
      <HomeScale>
        <Header>
          <Logo>SM Mall</Logo>
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
            <CartLink href="/cart" aria-label="장바구니">
              <CartIcon viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3.75 4.5a.75.75 0 0 1 0-1.5h1.11c.84 0 1.57.58 1.75 1.41l.18.84h11.85a1.875 1.875 0 0 1 1.83 2.28l-1.03 4.84a2.625 2.625 0 0 1-2.57 2.08H9.53a2.625 2.625 0 0 1-2.57-2.08L5.4 5.25H3.75Zm3.56 2.25l1.12 5.25c.07.34.37.58.72.58h7.32c.34 0 .64-.24.71-.58l1.03-4.84a.375.375 0 0 0-.37-.45H7.31ZM9 18.75a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm8.25 1.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z"
                  fill="currentColor"
                />
              </CartIcon>
            </CartLink>
          </TopActions>
        </Header>

        <MainContent>
          <HeaderSearch role="search">
            <SearchInput type="search" placeholder="상품을 검색해보세요" aria-label="상품 검색" />
            <SearchButton type="button" aria-label="검색">
              <SearchIcon viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10.5 4.75a5.75 5.75 0 1 0 0 11.5a5.75 5.75 0 0 0 0-11.5Zm-7.25 5.75a7.25 7.25 0 1 1 12.39 5.127l4.49 4.49a.75.75 0 1 1-1.06 1.06l-4.49-4.49A7.25 7.25 0 0 1 3.25 10.5Z"
                  fill="currentColor"
                />
              </SearchIcon>
            </SearchButton>
          </HeaderSearch>

          <HeroSection>
            <HeroTrack $index={currentSlide}>
              {heroSlides.map((slide) => (
                <HeroSlide key={slide.title} $image={slide.image}>
                  <HeroOverlay />
                  <HeroContent>
                    <HeroCopy>
                      <Eyebrow>{slide.tag}</Eyebrow>
                      <Title>{slide.title}</Title>
                      <Description>{slide.description}</Description>

                      <CategoryRow>
                        {categories.map((category) => (
                          <CategoryChip key={category}>{category}</CategoryChip>
                        ))}
                      </CategoryRow>
                    </HeroCopy>
                  </HeroContent>
                </HeroSlide>
              ))}
            </HeroTrack>

            <HeroNav>
              <IndicatorRow>
                {heroSlides.map((slide, index) => (
                  <IndicatorButton
                    key={slide.title}
                    type="button"
                    aria-label={`${index + 1} slide`}
                    $active={index === currentSlide}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </IndicatorRow>
            </HeroNav>
          </HeroSection>

          <CategoryBar aria-label="상품 카테고리">
            {headerCategories.map((category) => (
              <CategoryBarLink key={category} href="#">
                {category}
              </CategoryBarLink>
            ))}
          </CategoryBar>

          <SectionHeader>
            <SectionTitle>추천 상품</SectionTitle>
            <SectionCaption>남성 쇼핑몰 메인 홈에서 바로 둘러볼 수 있는 추천 아이템</SectionCaption>
          </SectionHeader>

          <ProductGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product.name}>
                <ProductVisual $tone={product.tone}>
                  <Badge>{product.tag}</Badge>
                </ProductVisual>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        </MainContent>
      </HomeScale>
    </PageShell>
  )
}

const PageShell = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
  background: radial-gradient(circle at top left, rgba(120, 113, 108, 0.18), transparent 22%),
    linear-gradient(180deg, #18181b 0%, #292524 28%, #f5f5f4 28%, #f5f5f4 100%);
`

const HomeScale = styled.div`
  width: 100%;
  transform: scale(0.8);
  transform-origin: top center;

  @media (max-width: 860px) {
    width: 100%;
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
  width: min(1600px, 100%);
  margin: 0 auto;
  padding: 1.5rem 2.5rem 1rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    padding: 1.25rem 1rem 1rem;
  }
`

const Logo = styled.h1`
  margin: 0;
  color: #fafaf9;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
`

const HeaderSearch = styled.form`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
  margin-bottom: 1rem;
  padding: 0.45rem;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);

  @media (max-width: 860px) {
    margin-bottom: 0.85rem;
  }
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

const TopActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.1rem;
  justify-self: end;

  @media (max-width: 860px) {
    justify-self: start;
  }
`

const TopLink = styled.a`
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

const UserIcon = styled.svg`
  width: 18px;
  height: 18px;
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

const UserLabel = styled.span`
  color: #fafaf9;
  font-weight: 700;
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

const UserMenuLink = styled.a`
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

const CartLink = styled.a`
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

const MainContent = styled.main`
  width: min(1600px, 100%);
  margin: 0 auto;
  padding: 0.35rem 2.5rem 4rem;

  @media (max-width: 860px) {
    padding: 0.35rem 1rem 4rem;
  }
`

const HeroSection = styled.section`
  position: relative;
  min-height: 56vh;
  overflow: hidden;
  border-radius: 40px;
  background: #111827;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.32);
`

const HeroTrack = styled.div<{ $index: number }>`
  display: flex;
  width: 100%;
  min-height: 56vh;
  transform: translateX(${({ $index }) => `-${$index * 100}%`});
  transition: transform 0.8s ease;
`

const HeroSlide = styled.article<{ $image: string }>`
  position: relative;
  flex: 0 0 100%;
  min-height: 56vh;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
`

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(12, 10, 9, 0.84) 0%, rgba(12, 10, 9, 0.52) 42%, rgba(12, 10, 9, 0.18) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.22));
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 56vh;
  align-items: flex-end;
  padding: 2.25rem 2.5rem;

  @media (max-width: 720px) {
    padding: 1.35rem;
  }
`

const HeroCopy = styled.div`
  max-width: 620px;
`

const Eyebrow = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const Title = styled.h2`
  margin: 1rem 0 0;
  color: #fafaf9;
  font-size: clamp(2.6rem, 7vw, 5.4rem);
  line-height: 0.95;
  text-transform: uppercase;
`

const Description = styled.p`
  margin: 1rem 0 0;
  max-width: 540px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  line-height: 1.7;
`

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.4rem;
`

const CategoryChip = styled.span`
  padding: 0.72rem 0.92rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fafaf9;
  font-weight: 700;
  backdrop-filter: blur(10px);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
`

const HeroNav = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 1.4rem;
  left: 2rem;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;

  @media (max-width: 720px) {
    right: 1.35rem;
    bottom: 1.1rem;
    left: 1.35rem;
  }
`

const CategoryBar = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1.35rem;
  margin-top: 1rem;
  padding: 0.2rem 0 0.5rem;

  @media (max-width: 960px) {
    justify-content: flex-start;
    overflow-x: auto;
    white-space: nowrap;
  }
`

const CategoryBarLink = styled.a`
  flex: 0 0 auto;
  color: #2f2a27;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 800;
  white-space: nowrap;

  &:hover {
    color: #111827;
  }
`

const IndicatorRow = styled.div`
  display: flex;
  gap: 0.65rem;
`

const IndicatorButton = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '44px' : '12px')};
  height: 12px;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#fafaf9' : 'rgba(255, 255, 255, 0.32)')};
  cursor: pointer;
  transition: all 0.25s ease;
`

const SectionHeader = styled.div`
  margin-top: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
  }
`

const SectionTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 2rem;
`

const SectionCaption = styled.p`
  margin: 0;
  color: #57534e;
`

const ProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.article`
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
`

const ProductVisual = styled.div<{ $tone: string }>`
  position: relative;
  height: 240px;
  background: ${({ $tone }) => $tone};
`

const Badge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: rgba(12, 10, 9, 0.88);
  color: white;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.06em;
`

const ProductInfo = styled.div`
  padding: 1.15rem 1.15rem 1.35rem;
`

const ProductName = styled.h4`
  margin: 0;
  color: #111827;
  font-size: 1.04rem;
`

const ProductPrice = styled.p`
  margin: 0.5rem 0 0;
  color: #292524;
  font-size: 1rem;
  font-weight: 800;
`
