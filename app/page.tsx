'use client'

import styled from 'styled-components'

export default function Home() {
  return (
    <Container>
      {/* 상단 네비게이션 바 */}
      <Header>
        <Logo>MyShoppingMall</Logo>
        <Nav>
          <a href="/auth?type=login">로그인</a>
          <a href="/auth?type=sign-up">회원가입</a>
        </Nav>
      </Header>

      {/* 메인 상품 홍보 배너 (Hero Section) */}
      <HeroSection>
        <BannerImageWrapper>
          {/* 임시 배너 이미지 */}
          <img
            src="https://picsum.photos/seed/promo/1920/600"
            alt="Promotion Banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <BannerContent>
            <Title>여름 맞이 특가 할인!</Title>
            <Subtitle>지금 바로 이번 시즌 최고의 상품들을 만나보세요.</Subtitle>
            <ShopNowButton>지금 보러가기</ShopNowButton>
          </BannerContent>
        </BannerImageWrapper>
      </HeroSection>

      {/* 상품 리스트 섹션 */}
      <ProductList>
        <h2>추천 상품</h2>
        <Grid>
          {/* 4개의 임시 상품 카드를 생성합니다 */}
          {[1, 2, 3, 4].map((item) => (
            <ProductCard key={item}>
              <ProductImage src={`https://picsum.photos/seed/${item * 10}/300/300`} alt={`Product ${item}`} />
              <ProductName>트렌디한 아이템 {item}</ProductName>
              <ProductPrice>₩ {(item * 15000).toLocaleString()}</ProductPrice>
            </ProductCard>
          ))}
        </Grid>
      </ProductList>
    </Container>
  )
}

/* Styled Components */
const Container = styled.div`
  min-height: 100vh;
  background-color: #f9f9f9;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const Logo = styled.h1`
  font-size: 1.5rem;
  color: #2d3748;
  font-weight: bold;
  margin: 0;
`

const Nav = styled.nav`
  a {
    margin-left: 1rem;
    color: #4a5568;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      color: #3182ce;
    }
  }
`

const HeroSection = styled.section`
  width: 100%;
  height: 500px;
  position: relative;
  background-color: #e2e8f0;
`

const BannerImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`

const BannerContent = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.5); /* 텍스트 가독성을 위해 어두운 배경 추가 */
  padding: 2.5rem;
  border-radius: 12px;
`

const Title = styled.h2`
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
`

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
`

const ShopNowButton = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #e53e3e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c53030;
  }
`

const ProductList = styled.section`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #2d3748;
    text-align: center;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin: 1rem;
  color: #2d3748;
`

const ProductPrice = styled.p`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 1rem 1.5rem;
  color: #e53e3e;
`