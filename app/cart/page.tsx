'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'

const sampleCartItems = [
  {
    id: 1,
    name: 'Boxy Harrington Jacket',
    option: '블랙 / M',
    price: 119000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #d6d3d1, #78716c)',
  },
  {
    id: 2,
    name: 'Premium Oxford Shirt',
    option: '화이트 / L',
    price: 59000,
    quantity: 2,
    tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)',
  },
  {
    id: 3,
    name: 'Relaxed Stripe Knit',
    option: '네이비 / L',
    price: 47000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #cbd5e1, #64748b)',
  },
  {
    id: 4,
    name: 'Minimal Cotton Blazer',
    option: '차콜 / M',
    price: 98000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #d6d3d1, #57534e)',
  },
  {
    id: 5,
    name: 'Daily Wide Denim',
    option: '중청 / L',
    price: 61000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #bfdbfe, #60a5fa)',
  },
  {
    id: 6,
    name: 'Comfort Hood Zip-Up',
    option: '그레이 / XL',
    price: 53000,
    quantity: 2,
    tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
  },
  {
    id: 7,
    name: 'Premium Mock Neck Tee',
    option: '아이보리 / M',
    price: 35000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #f5f5f4, #d6d3d1)',
  },
  {
    id: 8,
    name: 'Urban Cargo Pants',
    option: '카키 / L',
    price: 67000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #d9f99d, #65a30d)',
  },
  {
    id: 9,
    name: 'Classic Loafer',
    option: '브라운 / 270',
    price: 89000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #a16207, #451a03)',
  },
  {
    id: 10,
    name: 'Lightweight Windbreaker',
    option: '블루 / M',
    price: 76000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #93c5fd, #1d4ed8)',
  },
  {
    id: 11,
    name: 'Daily Backpack',
    option: '블랙 / FREE',
    price: 58000,
    quantity: 1,
    tone: 'linear-gradient(135deg, #374151, #111827)',
  },
  {
    id: 12,
    name: 'Soft Wool Muffler',
    option: '베이지 / FREE',
    price: 29000,
    quantity: 2,
    tone: 'linear-gradient(135deg, #f5e6c8, #c4a484)',
  },
]

const recommendedProducts = [
  {
    id: 1,
    name: 'Soft Wool Cardigan',
    price: 69000,
    badge: '추천',
    tone: 'linear-gradient(135deg, #ddd6d3, #8b7d77)',
  },
  {
    id: 2,
    name: 'Wide Tapered Slacks',
    price: 54000,
    badge: '인기',
    tone: 'linear-gradient(135deg, #d6d3d1, #6b7280)',
  },
  {
    id: 3,
    name: 'Classic Leather Belt',
    price: 32000,
    badge: 'NEW',
    tone: 'linear-gradient(135deg, #44403c, #0f172a)',
  },
  {
    id: 4,
    name: 'Daily Knit Tee',
    price: 39000,
    badge: 'MD',
    tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)',
  },
  {
    id: 5,
    name: 'Signature Denim Shirt',
    price: 52000,
    badge: '추천',
    tone: 'linear-gradient(135deg, #bfdbfe, #1d4ed8)',
  },
  {
    id: 6,
    name: 'Daily Runner Sneakers',
    price: 74000,
    badge: '인기',
    tone: 'linear-gradient(135deg, #d1d5db, #4b5563)',
  },
  {
    id: 7,
    name: 'Standard Ball Cap',
    price: 25000,
    badge: 'NEW',
    tone: 'linear-gradient(135deg, #fde68a, #d97706)',
  },
  {
    id: 8,
    name: 'Layered Long Sleeve Tee',
    price: 41000,
    badge: 'MD',
    tone: 'linear-gradient(135deg, #e9d5ff, #7c3aed)',
  },
  {
    id: 9,
    name: 'Classic Chino Pants',
    price: 57000,
    badge: '추천',
    tone: 'linear-gradient(135deg, #f5e6c8, #b08968)',
  },
  {
    id: 10,
    name: 'Half Zip Sweatshirt',
    price: 63000,
    badge: '인기',
    tone: 'linear-gradient(135deg, #c7d2fe, #4338ca)',
  },
  {
    id: 11,
    name: 'Slim Card Wallet',
    price: 28000,
    badge: 'NEW',
    tone: 'linear-gradient(135deg, #d6d3d1, #44403c)',
  },
  {
    id: 12,
    name: 'Weekend Canvas Bag',
    price: 46000,
    badge: 'MD',
    tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)',
  },
  {
    id: 13,
    name: 'Waffle Knit Henley',
    price: 43000,
    badge: '추천',
    tone: 'linear-gradient(135deg, #fed7aa, #c2410c)',
  },
  {
    id: 14,
    name: 'Minimal Track Jacket',
    price: 71000,
    badge: '인기',
    tone: 'linear-gradient(135deg, #a7f3d0, #047857)',
  },
  {
    id: 15,
    name: 'Everyday Socks Set',
    price: 19000,
    badge: 'NEW',
    tone: 'linear-gradient(135deg, #f3f4f6, #6b7280)',
  },
  {
    id: 16,
    name: 'Soft Touch Hoodie',
    price: 66000,
    badge: 'MD',
    tone: 'linear-gradient(135deg, #fecaca, #b91c1c)',
  },
]

function formatPrice(value: number) {
  return `${value.toLocaleString('ko-KR')}원`
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(sampleCartItems)
  const [selectedIds, setSelectedIds] = useState<number[]>(sampleCartItems.map((item) => item.id))
  const [recommendPage, setRecommendPage] = useState(0)

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedIds.includes(item.id)),
    [cartItems, selectedIds]
  )

  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = selectedItems.length === 0 ? 0 : subtotal >= 100000 ? 0 : 3000
  const total = subtotal + shippingFee
  const isAllSelected = cartItems.length > 0 && selectedIds.length === cartItems.length
  const recommendPageSize = 4
  const recommendTotalPages = Math.ceil(recommendedProducts.length / recommendPageSize)
  const visibleRecommendedProducts = recommendedProducts.slice(
    recommendPage * recommendPageSize,
    (recommendPage + 1) * recommendPageSize
  )

  const handleToggleItem = (itemId: number) => {
    setSelectedIds((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleToggleAll = () => {
    setSelectedIds(isAllSelected ? [] : cartItems.map((item) => item.id))
  }

  const handleDecreaseQuantity = (itemId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item
      )
    )
  }

  const handleIncreaseQuantity = (itemId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  const handleRemoveItem = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedIds((prev) => prev.filter((id) => id !== itemId))
  }

  return (
    <PageShell>
      <HeroBand>
        <HeroInner>
          <Logo href="/">SM Mall</Logo>
          <BandTitle>장바구니</BandTitle>
        </HeroInner>
      </HeroBand>

        <ContentWrap>
          <CartArea>
            <Layout>
              <ItemSection>
                <SelectionBar>
                  <CheckboxLabel>
                    <Checkbox type="checkbox" checked={isAllSelected} onChange={handleToggleAll} />
                    전체 선택
                  </CheckboxLabel>
                  <SelectionMeta>{selectedIds.length}개 선택됨</SelectionMeta>
                </SelectionBar>

                {cartItems.length === 0 ? (
                  <EmptyState>장바구니에 담긴 상품이 없습니다.</EmptyState>
                ) : (
                  cartItems.map((item) => (
                    <CartCard key={item.id}>
                      <CheckboxColumn>
                        <Checkbox
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={() => handleToggleItem(item.id)}
                          aria-label={`${item.name} 선택`}
                        />
                      </CheckboxColumn>
                      <Thumbnail $tone={item.tone} />
                      <ItemContent>
                        <ItemTop>
                          <div>
                            <ItemName>{item.name}</ItemName>
                            <ItemOption>{item.option}</ItemOption>
                          </div>
                          <RemoveButton type="button" onClick={() => handleRemoveItem(item.id)}>
                            삭제
                          </RemoveButton>
                        </ItemTop>

                        <ItemBottom>
                          <QuantityBox>
                            <QuantityButton type="button" onClick={() => handleDecreaseQuantity(item.id)}>
                              -
                            </QuantityButton>
                            <QuantityValue>{item.quantity}</QuantityValue>
                            <QuantityButton type="button" onClick={() => handleIncreaseQuantity(item.id)}>
                              +
                            </QuantityButton>
                          </QuantityBox>
                          <ItemPrice>{formatPrice(item.price * item.quantity)}</ItemPrice>
                        </ItemBottom>
                      </ItemContent>
                    </CartCard>
                  ))
                )}
              </ItemSection>

              <SummaryColumn>
                <SummaryCard>
                  <SummaryTitle>주문 요약</SummaryTitle>

                  <SummaryRow>
                    <span>상품 금액</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </SummaryRow>
                  <SummaryRow>
                    <span>배송비</span>
                    <strong>{formatPrice(shippingFee)}</strong>
                  </SummaryRow>
                  <SummaryDivider />
                  <SummaryRow>
                    <SummaryLabel>총 결제 금액</SummaryLabel>
                    <SummaryAmount>{formatPrice(total)}</SummaryAmount>
                  </SummaryRow>

                  <PrimaryButton type="button">주문하기</PrimaryButton>
                </SummaryCard>
              </SummaryColumn>
            </Layout>
          </CartArea>

          <RecommendSection>
            <RecommendHeader>
              <RecommendTitle>추천상품</RecommendTitle>
              <RecommendControls>
                <PageIndicator>
                  {recommendPage + 1}/{recommendTotalPages}
                </PageIndicator>
                <ArrowButton
                  type="button"
                  onClick={() => setRecommendPage((prev) => Math.max(0, prev - 1))}
                  disabled={recommendPage === 0}
                  aria-label="이전 추천상품 보기"
                >
                  &lt;
                </ArrowButton>
                <ArrowButton
                  type="button"
                  onClick={() => setRecommendPage((prev) => Math.min(recommendTotalPages - 1, prev + 1))}
                  disabled={recommendPage === recommendTotalPages - 1}
                  aria-label="다음 추천상품 보기"
                >
                  &gt;
                </ArrowButton>
              </RecommendControls>
            </RecommendHeader>

            <RecommendGrid>
              {visibleRecommendedProducts.map((product) => (
                <RecommendCard key={product.id}>
                  <RecommendVisual $tone={product.tone}>
                    <RecommendBadge>{product.badge}</RecommendBadge>
                </RecommendVisual>
                <RecommendInfo>
                  <RecommendName>{product.name}</RecommendName>
                  <RecommendPrice>{formatPrice(product.price)}</RecommendPrice>
                </RecommendInfo>
              </RecommendCard>
            ))}
          </RecommendGrid>
        </RecommendSection>
      </ContentWrap>
    </PageShell>
  )
}

const PageShell = styled.main`
  min-height: 100vh;
  background: linear-gradient(180deg, #18181b 0%, #292524 140px, #f5f5f4 140px, #f5f5f4 100%);
`

const HeroBand = styled.header`
  height: 140px;
`

const HeroInner = styled.div`
  width: min(1280px, 100%);
  height: 100%;
  margin: 0 auto;
  padding: 0 2.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.9fr);
  align-items: center;
  gap: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  @media (max-width: 860px) {
    padding: 0 1rem;
  }
`

const Logo = styled.a`
  color: #fafaf9;
  text-decoration: none;
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
`

const BandTitle = styled.h1`
  margin: 0;
  color: #fafaf9;
  text-align: right;
  font-size: clamp(1.6rem, 3.2vw, 2.3rem);

  @media (max-width: 1100px) {
    text-align: center;
  }
`

const ContentWrap = styled.div`
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 1.5rem 2.5rem 4rem;

  @media (max-width: 860px) {
    padding: 1.25rem 1rem 3rem;
  }
`

const CartArea = styled.section`
  margin-bottom: 3rem;
`

const Layout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.9fr);
  gap: 1.25rem;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const ItemSection = styled.div`
  display: grid;
  gap: 1rem;
`

const SummaryColumn = styled.div`
  position: sticky;
  top: 1.5rem;
  align-self: start;

  @media (max-width: 1100px) {
    position: static;
  }
`

const EmptyState = styled.div`
  padding: 2.5rem 1.5rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  color: #6b7280;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
`

const SelectionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e7e5e4;
`

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  color: #111827;
  font-weight: 700;
`

const SelectionMeta = styled.span`
  color: #6b7280;
  font-size: 0.95rem;
  font-weight: 600;
`

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #18181b;
  cursor: pointer;
`

const CartCard = styled.article`
  display: grid;
  grid-template-columns: auto 180px minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const CheckboxColumn = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.35rem;
`

const Thumbnail = styled.div<{ $tone: string }>`
  min-height: 180px;
  border-radius: 22px;
  background: ${({ $tone }) => $tone};
`

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
`

const ItemName = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.2rem;
`

const ItemOption = styled.p`
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.95rem;
`

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #9a3412;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
`

const ItemBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const QuantityBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fafaf9;
`

const QuantityButton = styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 999px;
  background: #18181b;
  color: #fafaf9;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`

const QuantityValue = styled.span`
  min-width: 28px;
  text-align: center;
  color: #111827;
  font-weight: 700;
`

const ItemPrice = styled.strong`
  color: #111827;
  font-size: 1.15rem;
`

const SummaryCard = styled.aside`
  padding: 1.35rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
`

const SummaryTitle = styled.h3`
  margin: 0 0 1rem;
  color: #111827;
  font-size: 1.2rem;
`

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.85rem;
  color: #44403c;
`

const SummaryDivider = styled.hr`
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #e7e5e4;
`

const SummaryLabel = styled.span`
  color: #111827;
  font-weight: 800;
`

const SummaryAmount = styled.strong`
  color: #111827;
  font-size: 1.2rem;
`

const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #3f3f46, #18181b);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
`

const RecommendSection = styled.section`
  margin-top: 0;
`

const RecommendHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const RecommendTitle = styled.h2`
  margin: 0;
  color: #111827;
  font-size: 1.8rem;
`

const RecommendControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.55rem;
`

const PageIndicator = styled.span`
  min-width: 42px;
  color: #44403c;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
`

const ArrowButton = styled.button`
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

const RecommendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const RecommendCard = styled.article`
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e7e5e4;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.06);
`

const RecommendVisual = styled.div<{ $tone: string }>`
  position: relative;
  height: 220px;
  background: ${({ $tone }) => $tone};
`

const RecommendBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.88);
  color: white;
  font-size: 0.78rem;
  font-weight: 800;
`

const RecommendInfo = styled.div`
  padding: 1rem 1rem 1.2rem;
`

const RecommendName = styled.h3`
  margin: 0;
  color: #111827;
  font-size: 1.05rem;
`

const RecommendPrice = styled.p`
  margin: 0.55rem 0 0;
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
`
