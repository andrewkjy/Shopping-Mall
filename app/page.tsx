'use client'

import styled from 'styled-components'

const featuredProducts = [
  {
    name: 'Spring Layered Jacket',
    price: '79,000원',
    tag: 'BEST',
    tone: 'linear-gradient(135deg, #f5f5f5, #e5e7eb)',
  },
  {
    name: 'Classic Leather Bag',
    price: '92,000원',
    tag: 'NEW',
    tone: 'linear-gradient(135deg, #f3f4f6, #d1d5db)',
  },
  {
    name: 'Daily Sneakers',
    price: '64,000원',
    tag: 'HOT',
    tone: 'linear-gradient(135deg, #fafafa, #e5e7eb)',
  },
  {
    name: 'Minimal Table Lamp',
    price: '48,000원',
    tag: 'MD PICK',
    tone: 'linear-gradient(135deg, #f9fafb, #d4d4d8)',
  },
]

const categories = ['여성', '남성', '가방', '신발', '리빙', '세일']

export default function Home() {
  return (
    <PageShell>
      <Header>
        <Logo>MyShoppingMall</Logo>
        <TopActions>
          <TopLink href="/auth?type=login">로그인</TopLink>
          <TopLink href="/auth?type=sign-up">회원가입</TopLink>
        </TopActions>
      </Header>

      <MainContent>
        <HeroSection>
          <HeroText>
            <Eyebrow>NEW SEASON CURATION</Eyebrow>
            <Title>오늘의 무드에 맞는 쇼핑을 시작해보세요.</Title>
            <Description>
              이번 시즌 인기 아이템과 새로 들어온 상품을 한눈에 둘러보고, 원하는 스타일을 빠르게 찾아보세요.
            </Description>

            <CategoryRow>
              {categories.map((category) => (
                <CategoryChip key={category}>{category}</CategoryChip>
              ))}
            </CategoryRow>
          </HeroText>

          <HeroPanel>
            <PanelLabel>이번 주 추천</PanelLabel>
            <PanelTitle>가볍게 바꾸는 봄 스타일</PanelTitle>
            <PanelDescription>
              데일리 아우터, 포인트 백, 라이프스타일 소품까지 지금 많이 찾는 조합으로 구성했어요.
            </PanelDescription>
            <PanelStats>
              <StatCard>
                <strong>24h</strong>
                <span>빠른 인기 업데이트</span>
              </StatCard>
              <StatCard>
                <strong>3,200+</strong>
                <span>이번 주 조회수</span>
              </StatCard>
            </PanelStats>
          </HeroPanel>
        </HeroSection>

        <SectionHeader>
          <SectionTitle>추천 상품</SectionTitle>
          <SectionCaption>메인 홈에서 바로 둘러볼 수 있는 대표 아이템</SectionCaption>
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
    </PageShell>
  )
}

const PageShell = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top left, rgba(0, 0, 0, 0.03), transparent 18%),
    radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.04), transparent 22%),
    linear-gradient(180deg, #ffffff 0%, #fcfcfc 50%, #f5f5f5 100%);
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
`

const Logo = styled.h1`
  margin: 0;
  color: #111827;
  font-size: 1.8rem;
  font-weight: 800;
`

const TopActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.1rem;
`

const TopLink = styled.a`
  color: #111827;
  text-decoration: none;
  font-weight: 700;
`

const MainContent = styled.main`
  width: min(1200px, calc(100% - 2rem));
  margin: 0 auto;
  padding: 1rem 0 4rem;
`

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const HeroText = styled.div`
  padding: 3rem;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #ececec;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
`

const Eyebrow = styled.p`
  margin: 0;
  color: #525252;
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`

const Title = styled.h2`
  margin: 1rem 0 0;
  color: #0f172a;
  font-size: clamp(2.6rem, 6vw, 5.2rem);
  line-height: 1.02;
`

const Description = styled.p`
  margin: 1.25rem 0 0;
  max-width: 640px;
  color: #475569;
  font-size: 1.08rem;
  line-height: 1.8;
`

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;
`

const CategoryChip = styled.span`
  padding: 0.8rem 1rem;
  border-radius: 999px;
  background: #fafafa;
  color: #262626;
  font-weight: 700;
  box-shadow: inset 0 0 0 1px #e5e5e5;
`

const HeroPanel = styled.aside`
  padding: 2rem;
  border-radius: 32px;
  background: linear-gradient(160deg, #3f3f46 0%, #18181b 100%);
  color: white;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.14);
`

const PanelLabel = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.9rem;
  font-weight: 700;
`

const PanelTitle = styled.h3`
  margin: 0.75rem 0 0;
  font-size: 2rem;
  line-height: 1.15;
`

const PanelDescription = styled.p`
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
`

const PanelStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-top: 2rem;
`

const StatCard = styled.div`
  padding: 1rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.12);

  strong {
    display: block;
    font-size: 1.35rem;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: rgba(255, 255, 255, 0.74);
    font-size: 0.92rem;
  }
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
  color: #0f172a;
  font-size: 2rem;
`

const SectionCaption = styled.p`
  margin: 0;
  color: #64748b;
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
  border: 1px solid #ececec;
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
  background: rgba(24, 24, 27, 0.88);
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
  color: #404040;
  font-size: 1rem;
  font-weight: 800;
`
