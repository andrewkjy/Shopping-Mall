'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'

import StoreTopBand from './components/StoreTopBand'
import { mainCategoryLabels } from '@/lib/storefrontData'

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
  { name: 'Boxy Harrington Jacket', price: '119,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #d6d3d1, #78716c)' },
  { name: 'Premium Oxford Shirt', price: '59,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)' },
  { name: 'Straight Fit Denim', price: '72,000원', tag: 'HOT', tone: 'linear-gradient(135deg, #1f2937, #6b7280)' },
  { name: 'Leather Derby Shoes', price: '138,000원', tag: 'MD PICK', tone: 'linear-gradient(135deg, #44403c, #0f172a)' },
  { name: 'Soft Wool Cardigan', price: '69,000원', tag: '추천', tone: 'linear-gradient(135deg, #ddd6d3, #8b7d77)' },
  { name: 'Wide Tapered Slacks', price: '54,000원', tag: '인기', tone: 'linear-gradient(135deg, #d6d3d1, #6b7280)' },
  { name: 'Classic Leather Belt', price: '32,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #44403c, #0f172a)' },
  { name: 'Daily Knit Tee', price: '39,000원', tag: 'MD', tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)' },
  { name: 'Signature Denim Shirt', price: '52,000원', tag: '추천', tone: 'linear-gradient(135deg, #bfdbfe, #1d4ed8)' },
  { name: 'Daily Runner Sneakers', price: '74,000원', tag: '인기', tone: 'linear-gradient(135deg, #d1d5db, #4b5563)' },
  { name: 'Standard Ball Cap', price: '25,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #fde68a, #d97706)' },
  { name: 'Layered Long Sleeve Tee', price: '41,000원', tag: 'MD', tone: 'linear-gradient(135deg, #e9d5ff, #7c3aed)' },
  { name: 'Classic Chino Pants', price: '57,000원', tag: '추천', tone: 'linear-gradient(135deg, #f5e6c8, #b08968)' },
  { name: 'Half Zip Sweatshirt', price: '63,000원', tag: '인기', tone: 'linear-gradient(135deg, #c7d2fe, #4338ca)' },
  { name: 'Slim Card Wallet', price: '28,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #d6d3d1, #44403c)' },
  { name: 'Weekend Canvas Bag', price: '46,000원', tag: 'MD', tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)' },
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

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredPage, setFeaturedPage] = useState(0)
  const [salePage, setSalePage] = useState(0)
  const [trendingPage, setTrendingPage] = useState(0)
  const [accessoryPage, setAccessoryPage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 3800)

    return () => window.clearInterval(interval)
  }, [])

  const featuredPageSize = 4
  const salePageSize = 4
  const trendingPageSize = 4
  const accessoryPageSize = 4

  const featuredTotalPages = Math.ceil(featuredProducts.length / featuredPageSize)
  const saleTotalPages = Math.ceil(saleProducts.length / salePageSize)
  const trendingTotalPages = Math.ceil(trendingProducts.length / trendingPageSize)
  const accessoryTotalPages = Math.ceil(accessoryProducts.length / accessoryPageSize)

  const visibleFeaturedProducts = featuredProducts.slice(featuredPage * featuredPageSize, (featuredPage + 1) * featuredPageSize)
  const visibleSaleProducts = saleProducts.slice(salePage * salePageSize, (salePage + 1) * salePageSize)
  const visibleTrendingProducts = trendingProducts.slice(trendingPage * trendingPageSize, (trendingPage + 1) * trendingPageSize)
  const visibleAccessoryProducts = accessoryProducts.slice(accessoryPage * accessoryPageSize, (accessoryPage + 1) * accessoryPageSize)

  return (
    <PageShell>
      <StoreTopBand />
      <ContentScale>
        <MainContent>
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
                        {mainCategoryLabels.map((category) => (
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
              <SectionPageIndicator>{featuredPage + 1}/{featuredTotalPages}</SectionPageIndicator>
              <SectionArrowButton type="button" onClick={() => setFeaturedPage((prev) => Math.max(0, prev - 1))} disabled={featuredPage === 0}>&lt;</SectionArrowButton>
              <SectionArrowButton type="button" onClick={() => setFeaturedPage((prev) => Math.min(featuredTotalPages - 1, prev + 1))} disabled={featuredPage === featuredTotalPages - 1}>&gt;</SectionArrowButton>
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
                  <SectionPageIndicator>{salePage + 1}/{saleTotalPages}</SectionPageIndicator>
                  <SectionArrowButton type="button" onClick={() => setSalePage((prev) => Math.max(0, prev - 1))} disabled={salePage === 0}>&lt;</SectionArrowButton>
                  <SectionArrowButton type="button" onClick={() => setSalePage((prev) => Math.min(saleTotalPages - 1, prev + 1))} disabled={salePage === saleTotalPages - 1}>&gt;</SectionArrowButton>
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
                  <SectionPageIndicator>{trendingPage + 1}/{trendingTotalPages}</SectionPageIndicator>
                  <SectionArrowButton type="button" onClick={() => setTrendingPage((prev) => Math.max(0, prev - 1))} disabled={trendingPage === 0}>&lt;</SectionArrowButton>
                  <SectionArrowButton type="button" onClick={() => setTrendingPage((prev) => Math.min(trendingTotalPages - 1, prev + 1))} disabled={trendingPage === trendingTotalPages - 1}>&gt;</SectionArrowButton>
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
              <SectionPageIndicator>{accessoryPage + 1}/{accessoryTotalPages}</SectionPageIndicator>
              <SectionArrowButton type="button" onClick={() => setAccessoryPage((prev) => Math.max(0, prev - 1))} disabled={accessoryPage === 0}>&lt;</SectionArrowButton>
              <SectionArrowButton type="button" onClick={() => setAccessoryPage((prev) => Math.min(accessoryTotalPages - 1, prev + 1))} disabled={accessoryPage === accessoryTotalPages - 1}>&gt;</SectionArrowButton>
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
      </ContentScale>
    </PageShell>
  )
}

const PageShell = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
  background: #f5f5f4;
`

const ContentScale = styled.div`
  width: 100%;
  transform: scale(0.8);
  transform-origin: top center;
  will-change: transform;

  @media (max-width: 860px) {
    transform: none;
  }
`

const MainContent = styled.main`
  width: min(1600px, 100%);
  margin: 0 auto;
  margin-top: 3.11rem;
  padding: 0 2.5rem 4rem;

  @media (max-width: 860px) {
    margin-top: 2.4rem;
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

  @media (max-width: 720px) {
    right: 1.35rem;
    bottom: 1.1rem;
    left: 1.35rem;
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

const SectionMiniTitle = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 1.5rem;
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

