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
  {
    name: 'Soft Wool Cardigan',
    price: '69,000원',
    tag: '추천',
    tone: 'linear-gradient(135deg, #ddd6d3, #8b7d77)',
  },
  {
    name: 'Wide Tapered Slacks',
    price: '54,000원',
    tag: '인기',
    tone: 'linear-gradient(135deg, #d6d3d1, #6b7280)',
  },
  {
    name: 'Classic Leather Belt',
    price: '32,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #44403c, #0f172a)',
  },
  {
    name: 'Daily Knit Tee',
    price: '39,000원',
    tag: 'MD',
    tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)',
  },
  {
    name: 'Signature Denim Shirt',
    price: '52,000원',
    tag: '추천',
    tone: 'linear-gradient(135deg, #bfdbfe, #1d4ed8)',
  },
  {
    name: 'Daily Runner Sneakers',
    price: '74,000원',
    tag: '인기',
    tone: 'linear-gradient(135deg, #d1d5db, #4b5563)',
  },
  {
    name: 'Standard Ball Cap',
    price: '25,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #fde68a, #d97706)',
  },
  {
    name: 'Layered Long Sleeve Tee',
    price: '41,000원',
    tag: 'MD',
    tone: 'linear-gradient(135deg, #e9d5ff, #7c3aed)',
  },
  {
    name: 'Classic Chino Pants',
    price: '57,000원',
    tag: '추천',
    tone: 'linear-gradient(135deg, #f5e6c8, #b08968)',
  },
  {
    name: 'Half Zip Sweatshirt',
    price: '63,000원',
    tag: '인기',
    tone: 'linear-gradient(135deg, #c7d2fe, #4338ca)',
  },
  {
    name: 'Slim Card Wallet',
    price: '28,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #d6d3d1, #44403c)',
  },
  {
    name: 'Weekend Canvas Bag',
    price: '46,000원',
    tag: 'MD',
    tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
  },
  {
    name: 'Waffle Knit Henley',
    price: '43,000원',
    tag: '추천',
    tone: 'linear-gradient(135deg, #fed7aa, #c2410c)',
  },
  {
    name: 'Minimal Track Jacket',
    price: '71,000원',
    tag: '인기',
    tone: 'linear-gradient(135deg, #a7f3d0, #047857)',
  },
  {
    name: 'Everyday Socks Set',
    price: '19,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #f3f4f6, #6b7280)',
  },
  {
    name: 'Soft Touch Hoodie',
    price: '66,000원',
    tag: 'MD',
    tone: 'linear-gradient(135deg, #fecaca, #b91c1c)',
  },
]

const saleProducts = [
  { name: 'Overfit Wool Coat', price: '159,000원', detail: '219,000원', tag: '28% OFF', tone: 'linear-gradient(135deg, #d4d4d8, #52525b)' },
  { name: 'Vintage Blue Denim', price: '49,000원', detail: '79,000원', tag: 'SALE', tone: 'linear-gradient(135deg, #93c5fd, #1d4ed8)' },
  { name: 'Soft Touch Knit', price: '39,000원', detail: '58,000원', tag: '특가', tone: 'linear-gradient(135deg, #fde68a, #d97706)' },
  { name: 'Daily Chelsea Boots', price: '99,000원', detail: '149,000원', tag: '32% OFF', tone: 'linear-gradient(135deg, #57534e, #1c1917)' },
  { name: 'Classic Trench Coat', price: '129,000원', detail: '189,000원', tag: 'SALE', tone: 'linear-gradient(135deg, #d6d3d1, #78716c)' },
  { name: 'Heavy Cotton Hoodie', price: '45,000원', detail: '69,000원', tag: '35% OFF', tone: 'linear-gradient(135deg, #c7d2fe, #4338ca)' },
  { name: 'Wide Fit Denim Pants', price: '54,000원', detail: '82,000원', tag: '특가', tone: 'linear-gradient(135deg, #bfdbfe, #2563eb)' },
  { name: 'Minimal Derby Shoes', price: '87,000원', detail: '126,000원', tag: 'SALE', tone: 'linear-gradient(135deg, #44403c, #111827)' },
]

const trendingProducts = [
  { name: 'Loose Fit Oxford Shirt', price: '61,000원', tag: '실시간 인기', tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)' },
  { name: 'Two-Tuck Wide Slacks', price: '68,000원', tag: '급상승', tone: 'linear-gradient(135deg, #cbd5e1, #475569)' },
  { name: 'Classic Harrington Jumper', price: '109,000원', tag: '인기 상품', tone: 'linear-gradient(135deg, #d6d3d1, #57534e)' },
  { name: 'Minimal Runner', price: '84,000원', tag: '베스트', tone: 'linear-gradient(135deg, #e5e7eb, #6b7280)' },
  { name: 'Daily Waffle Knit', price: '43,000원', tag: '실시간 인기', tone: 'linear-gradient(135deg, #fed7aa, #c2410c)' },
  { name: 'Relaxed Cargo Pants', price: '72,000원', tag: '급상승', tone: 'linear-gradient(135deg, #d9f99d, #4d7c0f)' },
  { name: 'Soft Touch Cardigan', price: '58,000원', tag: '인기 상품', tone: 'linear-gradient(135deg, #e9d5ff, #7c3aed)' },
  { name: 'Classic Backpack', price: '63,000원', tag: '베스트', tone: 'linear-gradient(135deg, #374151, #111827)' },
]

const accessoryProducts = [
  { name: 'Silver Buckle Belt', price: '29,000원', tag: 'ACC', tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)' },
  { name: 'Classic Leather Wallet', price: '43,000원', tag: '추천', tone: 'linear-gradient(135deg, #78350f, #451a03)' },
  { name: 'Vintage Ball Cap', price: '27,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #fecaca, #b91c1c)' },
  { name: 'Canvas Cross Bag', price: '46,000원', tag: 'MD', tone: 'linear-gradient(135deg, #ddd6d3, #78716c)' },
  { name: 'Minimal Card Wallet', price: '24,000원', tag: 'ACC', tone: 'linear-gradient(135deg, #d6d3d1, #44403c)' },
  { name: 'Daily Beanie', price: '21,000원', tag: '추천', tone: 'linear-gradient(135deg, #cbd5e1, #475569)' },
  { name: 'Nylon Shoulder Bag', price: '39,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #bfdbfe, #1d4ed8)' },
  { name: 'Metal Key Holder', price: '18,000원', tag: 'MD', tone: 'linear-gradient(135deg, #f3f4f6, #6b7280)' },
]

const categories = ['SHOES', 'TOP', 'PANTS', 'OUTER', 'BAG', 'HAT', 'ACCESSORIES']
const headerCategories = ['SHOES', 'TOP', 'PANTS', 'OUTER', 'BAG', 'HAT', 'ACCESSORIES']

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredPage, setFeaturedPage] = useState(0)
  const [salePage, setSalePage] = useState(0)
  const [trendingPage, setTrendingPage] = useState(0)
  const [accessoryPage, setAccessoryPage] = useState(0)
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

  const featuredPageSize = 4
  const featuredTotalPages = Math.ceil(featuredProducts.length / featuredPageSize)
  const visibleFeaturedProducts = featuredProducts.slice(
    featuredPage * featuredPageSize,
    (featuredPage + 1) * featuredPageSize
  )
  const salePageSize = 4
  const saleTotalPages = Math.ceil(saleProducts.length / salePageSize)
  const visibleSaleProducts = saleProducts.slice(salePage * salePageSize, (salePage + 1) * salePageSize)
  const trendingPageSize = 4
  const trendingTotalPages = Math.ceil(trendingProducts.length / trendingPageSize)
  const visibleTrendingProducts = trendingProducts.slice(
    trendingPage * trendingPageSize,
    (trendingPage + 1) * trendingPageSize
  )
  const accessoryPageSize = 4
  const accessoryTotalPages = Math.ceil(accessoryProducts.length / accessoryPageSize)
  const visibleAccessoryProducts = accessoryProducts.slice(
    accessoryPage * accessoryPageSize,
    (accessoryPage + 1) * accessoryPageSize
  )

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

          <CategoryBar aria-label="상품 카테고리">
            {headerCategories.map((category) => (
              <CategoryBarLink key={category} href="#">
                {category}
              </CategoryBarLink>
            ))}
          </CategoryBar>

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

          <SectionHeader>
            <SectionTitle>추천 상품</SectionTitle>
            <SectionControls>
              <SectionPageIndicator>
                {featuredPage + 1}/{featuredTotalPages}
              </SectionPageIndicator>
              <SectionArrowButton
                type="button"
                onClick={() => setFeaturedPage((prev) => Math.max(0, prev - 1))}
                disabled={featuredPage === 0}
                aria-label="이전 추천 상품 보기"
              >
                &lt;
              </SectionArrowButton>
              <SectionArrowButton
                type="button"
                onClick={() => setFeaturedPage((prev) => Math.min(featuredTotalPages - 1, prev + 1))}
                disabled={featuredPage === featuredTotalPages - 1}
                aria-label="다음 추천 상품 보기"
              >
                &gt;
              </SectionArrowButton>
            </SectionControls>
          </SectionHeader>

          <ProductGrid>
            {visibleFeaturedProducts.map((product) => (
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

          <SplitSection>
            <FeatureColumn>
              <SectionMiniHeader>
                <SectionMiniTitle>할인 중인 상품</SectionMiniTitle>
                <SectionControls>
                  <SectionPageIndicator>
                    {salePage + 1}/{saleTotalPages}
                  </SectionPageIndicator>
                  <SectionArrowButton
                    type="button"
                    onClick={() => setSalePage((prev) => Math.max(0, prev - 1))}
                    disabled={salePage === 0}
                    aria-label="이전 할인 상품 보기"
                  >
                    &lt;
                  </SectionArrowButton>
                  <SectionArrowButton
                    type="button"
                    onClick={() => setSalePage((prev) => Math.min(saleTotalPages - 1, prev + 1))}
                    disabled={salePage === saleTotalPages - 1}
                    aria-label="다음 할인 상품 보기"
                  >
                    &gt;
                  </SectionArrowButton>
                </SectionControls>
              </SectionMiniHeader>
              <SaleGrid>
                {visibleSaleProducts.map((product) => (
                  <SaleCard key={product.name}>
                    <SaleVisual $tone={product.tone}>
                      <MiniBadge>{product.tag}</MiniBadge>
                    </SaleVisual>
                    <SaleInfo>
                      <MiniName>{product.name}</MiniName>
                      <SalePriceRow>
                        <MiniPrice>{product.price}</MiniPrice>
                        <MiniMuted>{product.detail}</MiniMuted>
                      </SalePriceRow>
                    </SaleInfo>
                  </SaleCard>
                ))}
              </SaleGrid>
            </FeatureColumn>

            <FeatureColumn>
              <SectionMiniHeader>
                <SectionMiniTitle>지금 인기 있는 상품</SectionMiniTitle>
                <SectionControls>
                  <SectionPageIndicator>
                    {trendingPage + 1}/{trendingTotalPages}
                  </SectionPageIndicator>
                  <SectionArrowButton
                    type="button"
                    onClick={() => setTrendingPage((prev) => Math.max(0, prev - 1))}
                    disabled={trendingPage === 0}
                    aria-label="이전 인기 상품 보기"
                  >
                    &lt;
                  </SectionArrowButton>
                  <SectionArrowButton
                    type="button"
                    onClick={() => setTrendingPage((prev) => Math.min(trendingTotalPages - 1, prev + 1))}
                    disabled={trendingPage === trendingTotalPages - 1}
                    aria-label="다음 인기 상품 보기"
                  >
                    &gt;
                  </SectionArrowButton>
                </SectionControls>
              </SectionMiniHeader>
              <MiniList>
                {visibleTrendingProducts.map((product) => (
                  <MiniListCard key={product.name}>
                    <MiniThumb $tone={product.tone} />
                    <MiniMeta>
                      <MiniTag>{product.tag}</MiniTag>
                      <MiniName>{product.name}</MiniName>
                      <MiniPrice>{product.price}</MiniPrice>
                    </MiniMeta>
                  </MiniListCard>
                ))}
              </MiniList>
            </FeatureColumn>
          </SplitSection>

          <SectionHeader>
            <SectionTitle>액세서리 추천</SectionTitle>
            <SectionControls>
              <SectionPageIndicator>
                {accessoryPage + 1}/{accessoryTotalPages}
              </SectionPageIndicator>
              <SectionArrowButton
                type="button"
                onClick={() => setAccessoryPage((prev) => Math.max(0, prev - 1))}
                disabled={accessoryPage === 0}
                aria-label="이전 액세서리 보기"
              >
                &lt;
              </SectionArrowButton>
              <SectionArrowButton
                type="button"
                onClick={() => setAccessoryPage((prev) => Math.min(accessoryTotalPages - 1, prev + 1))}
                disabled={accessoryPage === accessoryTotalPages - 1}
                aria-label="다음 액세서리 보기"
              >
                &gt;
              </SectionArrowButton>
            </SectionControls>
          </SectionHeader>

          <ProductGrid>
            {visibleAccessoryProducts.map((product) => (
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
    linear-gradient(180deg, #18181b 0%, #292524 163px, #f5f5f4 163px, #f5f5f4 100%);
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
  margin-bottom: 0.85rem;
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
  padding: 0 2.5rem 4rem;

  @media (max-width: 860px) {
    padding: 0 1rem 4rem;
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
  gap: 2.25rem;
  margin-top: 0;
  margin-bottom: 1.15rem;
  padding: 0.15rem 0 0.2rem;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 960px) {
    justify-content: flex-start;
    white-space: nowrap;
  }
`

const CategoryBarLink = styled.a`
  flex: 0 0 auto;
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

const SectionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`

const SectionPageIndicator = styled.span`
  min-width: 42px;
  color: #44403c;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
`

const SectionArrowButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid #d6d3d1;
  border-radius: 10px;
  background: white;
  color: #18181b;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
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

const SplitSection = styled.section`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.25rem;
  margin-top: 2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const FeatureColumn = styled.div`
  display: grid;
  gap: 1rem;
`

const SectionMiniTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
`

const SectionMiniHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
  }
`

const SaleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const SaleCard = styled.article`
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
`

const SaleVisual = styled.div<{ $tone: string }>`
  position: relative;
  height: 220px;
  background: ${({ $tone }) => $tone};
`

const SaleInfo = styled.div`
  padding: 1rem 1rem 1.2rem;
`

const SalePriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  margin-top: 0.55rem;
`

const MiniMuted = styled.span`
  color: #a8a29e;
  font-size: 0.9rem;
  text-decoration: line-through;
`

const MiniList = styled.div`
  display: grid;
  gap: 1rem;
`

const MiniListCard = styled.article`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
`

const MiniThumb = styled.div<{ $tone: string }>`
  min-height: 120px;
  border-radius: 18px;
  background: ${({ $tone }) => $tone};
`

const MiniMeta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
`

const MiniTag = styled.span`
  color: #78716c;
  font-size: 0.82rem;
  font-weight: 800;
`

const MiniName = styled.h4`
  margin: 0;
  color: #111827;
  font-size: 1rem;
`

const MiniPrice = styled.p`
  margin: 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`

const MiniBadge = styled.span`
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
