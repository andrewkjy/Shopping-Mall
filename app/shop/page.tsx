'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'

import StoreTopBand from '../components/StoreTopBand'
import { categoryMenu, getCategoryMenuItem, shopProducts } from '@/lib/storefrontData'

export default function ShopPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')

  const filteredProducts = useMemo(() => {
    return shopProducts.filter((product) => {
      if (category && product.category !== category) {
        return false
      }

      if (subcategory) {
        if (category === 'SHOES' && subcategory === '샌들/슬리퍼') {
          return product.subcategory === '샌들' || product.subcategory === '슬리퍼'
        }

        if (product.subcategory !== subcategory) {
          return false
        }
      }

      return true
    })
  }, [category, subcategory])

  const categoryItem = getCategoryMenuItem(category)
  const headline = subcategory ?? categoryItem?.label ?? 'SHOP'
  const filterItems = categoryItem
    ? [
        {
          label: '전체',
          href: `/shop?category=${categoryItem.key}`,
          active: !subcategory,
        },
        ...getShopSubcategoryItems(categoryItem.key, categoryItem.subcategories).map((item) => ({
          label: item.label,
          href: `/shop?category=${categoryItem.key}&subcategory=${encodeURIComponent(item.value)}`,
          active: subcategory === item.value,
        })),
      ]
    : categoryMenu.map((item) => ({
        label: item.label,
        href: `/shop?category=${item.key}`,
        active: item.key === category,
      }))

  return (
    <PageShell>
      <StoreTopBand />
      <ContentScale>
        <ContentWrap>
          <HeroCard>
            <HeroTitle>{headline}</HeroTitle>
            <FilterRow>
              {filterItems.map((item) => (
                <FilterChip
                  key={item.href}
                  href={item.href}
                  $active={item.active}
                >
                  {item.label}
                </FilterChip>
              ))}
            </FilterRow>
          </HeroCard>

          <SectionHeader>
            <SectionTitle>상품 목록</SectionTitle>
            <ResultCount>{filteredProducts.length}개 상품</ResultCount>
          </SectionHeader>

          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id}>
                  <ProductVisual $tone={product.tone}>
                    <Badge>{product.tag}</Badge>
                  </ProductVisual>
                  <ProductInfo>
                    <ProductMeta>{product.category} / {product.subcategory}</ProductMeta>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductGrid>
          ) : (
            <EmptyState>선택한 조건에 맞는 상품이 아직 없습니다.</EmptyState>
          )}
        </ContentWrap>
      </ContentScale>
    </PageShell>
  )
}

const getShopSubcategoryItems = (categoryKey: string, subcategories: readonly string[]) => {
  if (categoryKey === 'SHOES') {
    return [
      { label: '스니커즈', value: '스니커즈' },
      { label: '운동화', value: '운동화' },
      { label: '구두', value: '구두' },
      { label: '샌들/슬리퍼', value: '샌들/슬리퍼' },
    ]
  }

  return subcategories.map((subcategory) => ({
    label: subcategory,
    value: subcategory,
  }))
}

const PageShell = styled.div`
  min-height: 100vh;
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

const ContentWrap = styled.main`
  width: min(1600px, 100%);
  margin: 0 auto;
  margin-top: 1.6rem;
  padding: 0.7rem 2.5rem 4rem;

  @media (max-width: 860px) {
    margin-top: 1rem;
    padding: 1.25rem 1rem 3rem;
  }
`

const HeroCard = styled.section`
  padding: 2rem 2.1rem;
  border-radius: 36px;
  background: linear-gradient(135deg, #ffffff, #f5f5f4);
  border: 1px solid #e7e5e4;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
`

const HeroTitle = styled.h1`
  margin: 0 0 1.35rem;
  color: #111827;
  font-size: clamp(2.2rem, 5vw, 4rem);
`

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`

const FilterChip = styled.a<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#18181b' : '#ffffff')};
  border: 1px solid ${({ $active }) => ($active ? '#18181b' : '#d6d3d1')};
  color: ${({ $active }) => ($active ? '#fafaf9' : '#292524')};
  text-decoration: none;
  font-size: 0.94rem;
  font-weight: 800;
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-top: 2.2rem;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: start;
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.8rem;
`

const ResultCount = styled.span`
  color: #78716c;
  font-size: 0.95rem;
  font-weight: 700;
`

const ProductGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.35rem 1.05rem;
  margin-top: 1.15rem;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ProductCard = styled.article`
  background: transparent;
`

const ProductVisual = styled.div<{ $tone: string }>`
  position: relative;
  height: 340px;
  border-radius: 0;
  background: ${({ $tone }) => $tone};

  @media (max-width: 1080px) {
    height: 320px;
  }

  @media (max-width: 900px) {
    height: 280px;
  }
`

const Badge = styled.span`
  position: absolute;
  left: 0.4rem;
  bottom: 0.4rem;
  padding: 0.16rem 0.36rem;
  border-radius: 4px;
  background: rgba(37, 99, 235, 0.92);
  color: white;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.03em;
`

const ProductInfo = styled.div`
  padding: 0.55rem 0.12rem 0;
`

const ProductMeta = styled.p`
  margin: 0;
  color: #44403c;
  font-size: 0.74rem;
  font-weight: 700;
`

const ProductName = styled.h3`
  margin: 0.2rem 0 0;
  color: #111827;
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.45;
`

const ProductPrice = styled.p`
  margin: 0.28rem 0 0;
  color: #dc2626;
  font-size: 0.95rem;
  font-weight: 800;
`

const EmptyState = styled.div`
  margin-top: 1.25rem;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid #e7e5e4;
  background: #ffffff;
  color: #57534e;
  text-align: center;
`
