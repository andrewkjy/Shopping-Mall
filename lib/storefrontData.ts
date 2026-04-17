export const categoryMenu = [
  {
    key: 'SHOES',
    label: 'SHOES',
    subcategories: ['스니커즈', '운동화', '구두', '샌들', '슬리퍼'],
  },
  {
    key: 'TOP',
    label: 'TOP',
    subcategories: ['반팔', '셔츠', '니트', '후드', '맨투맨'],
  },
  {
    key: 'PANTS',
    label: 'PANTS',
    subcategories: ['청바지', '슬랙스', '조거팬츠', '반바지'],
  },
  {
    key: 'OUTER',
    label: 'OUTER',
    subcategories: ['후드집업', '가죽재킷', '블레이저', '가디건', '청재킷', '무스탕', '경량패딩', '숏패딩', '롱패딩'],
  },
  {
    key: 'BAG',
    label: 'BAG',
    subcategories: ['백팩', '크로스백', '토트백', '숄더백'],
  },
  {
    key: 'HAT',
    label: 'HAT',
    subcategories: ['볼캡', '비니', '버킷햇', '캡모자'],
  },
  {
    key: 'ACCESSORIES',
    label: 'ACCESSORIES',
    subcategories: ['벨트', '지갑', '목걸이', '양말'],
  },
] as const

export type CategoryKey = (typeof categoryMenu)[number]['key']

export type ShopProduct = {
  id: number
  name: string
  price: string
  tag: string
  tone: string
  category: CategoryKey
  subcategory: string
}

export const shopProducts: ShopProduct[] = [
  { id: 1, name: 'Street Balance 530', price: '89,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #e7e5e4, #78716c)', category: 'SHOES', subcategory: '스니커즈' },
  { id: 2, name: 'Motion Runner Pro', price: '94,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #dbeafe, #2563eb)', category: 'SHOES', subcategory: '운동화' },
  { id: 3, name: 'Classic Derby Edge', price: '128,000원', tag: 'MD', tone: 'linear-gradient(135deg, #57534e, #111827)', category: 'SHOES', subcategory: '구두' },
  { id: 4, name: 'Coast Strap Sandal', price: '59,000원', tag: 'SUMMER', tone: 'linear-gradient(135deg, #fed7aa, #c2410c)', category: 'SHOES', subcategory: '샌들' },
  { id: 5, name: 'Soft Cloud Slide', price: '34,000원', tag: 'HOT', tone: 'linear-gradient(135deg, #f3f4f6, #6b7280)', category: 'SHOES', subcategory: '슬리퍼' },
  { id: 6, name: 'Box Logo Tee', price: '31,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)', category: 'TOP', subcategory: '반팔' },
  { id: 7, name: 'Relaxed Oxford Shirt', price: '57,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #e2e8f0, #64748b)', category: 'TOP', subcategory: '셔츠' },
  { id: 8, name: 'Soft Wool Knit', price: '63,000원', tag: '추천', tone: 'linear-gradient(135deg, #ddd6fe, #7c3aed)', category: 'TOP', subcategory: '니트' },
  { id: 9, name: 'Heavy Pullover Hoodie', price: '68,000원', tag: 'MD', tone: 'linear-gradient(135deg, #fecaca, #b91c1c)', category: 'TOP', subcategory: '후드' },
  { id: 10, name: 'Clean Sweatshirt', price: '49,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #e5e7eb, #6b7280)', category: 'TOP', subcategory: '맨투맨' },
  { id: 11, name: 'Vintage Wash Denim', price: '71,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #bfdbfe, #1d4ed8)', category: 'PANTS', subcategory: '청바지' },
  { id: 12, name: 'Wide Pleated Slacks', price: '66,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #d6d3d1, #57534e)', category: 'PANTS', subcategory: '슬랙스' },
  { id: 13, name: 'Utility Jogger Pants', price: '54,000원', tag: 'HOT', tone: 'linear-gradient(135deg, #d9f99d, #4d7c0f)', category: 'PANTS', subcategory: '조거팬츠' },
  { id: 14, name: 'Summer Nylon Shorts', price: '39,000원', tag: 'SUMMER', tone: 'linear-gradient(135deg, #fef3c7, #d97706)', category: 'PANTS', subcategory: '반바지' },
  { id: 15, name: 'Soft Hood Zip-Up', price: '64,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #d6d3d1, #44403c)', category: 'OUTER', subcategory: '후드집업' },
  { id: 16, name: 'Minimal Leather Jacket', price: '149,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #4b5563, #111827)', category: 'OUTER', subcategory: '가죽재킷' },
  { id: 17, name: 'Classic Blazer', price: '112,000원', tag: '추천', tone: 'linear-gradient(135deg, #e7e5e4, #78716c)', category: 'OUTER', subcategory: '블레이저' },
  { id: 18, name: 'Mohair Button Cardigan', price: '72,000원', tag: '추천', tone: 'linear-gradient(135deg, #e9d5ff, #7c3aed)', category: 'OUTER', subcategory: '가디건' },
  { id: 19, name: 'Blue Denim Jacket', price: '87,000원', tag: 'MD', tone: 'linear-gradient(135deg, #bfdbfe, #2563eb)', category: 'OUTER', subcategory: '청재킷' },
  { id: 20, name: 'Vintage Mustang Jacket', price: '138,000원', tag: 'HOT', tone: 'linear-gradient(135deg, #d6bfa4, #6b4f3f)', category: 'OUTER', subcategory: '무스탕' },
  { id: 21, name: 'Light Down Vest', price: '79,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #cbd5e1, #64748b)', category: 'OUTER', subcategory: '경량패딩' },
  { id: 22, name: 'Urban Short Padding', price: '119,000원', tag: 'WINTER', tone: 'linear-gradient(135deg, #94a3b8, #334155)', category: 'OUTER', subcategory: '숏패딩' },
  { id: 23, name: 'Signature Long Padding', price: '159,000원', tag: 'WINTER', tone: 'linear-gradient(135deg, #1f2937, #020617)', category: 'OUTER', subcategory: '롱패딩' },
  { id: 24, name: 'Daily Urban Backpack', price: '58,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #374151, #111827)', category: 'BAG', subcategory: '백팩' },
  { id: 25, name: 'Classic Cross Bag', price: '46,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #ddd6d3, #78716c)', category: 'BAG', subcategory: '크로스백' },
  { id: 26, name: 'Canvas Market Tote', price: '39,000원', tag: '추천', tone: 'linear-gradient(135deg, #f5f5f4, #a8a29e)', category: 'BAG', subcategory: '토트백' },
  { id: 27, name: 'Nylon Shoulder Pack', price: '43,000원', tag: 'MD', tone: 'linear-gradient(135deg, #dbeafe, #1d4ed8)', category: 'BAG', subcategory: '숄더백' },
  { id: 28, name: 'Standard Black Ball Cap', price: '25,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #fef3c7, #ca8a04)', category: 'HAT', subcategory: '볼캡' },
  { id: 29, name: 'Daily Knit Beanie', price: '22,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #cbd5e1, #475569)', category: 'HAT', subcategory: '비니' },
  { id: 30, name: 'Washed Bucket Hat', price: '28,000원', tag: '추천', tone: 'linear-gradient(135deg, #fed7aa, #c2410c)', category: 'HAT', subcategory: '버킷햇' },
  { id: 31, name: 'Side Logo Cap', price: '24,000원', tag: 'MD', tone: 'linear-gradient(135deg, #fecaca, #b91c1c)', category: 'HAT', subcategory: '캡모자' },
  { id: 32, name: 'Silver Buckle Belt', price: '29,000원', tag: 'BEST', tone: 'linear-gradient(135deg, #e5e7eb, #9ca3af)', category: 'ACCESSORIES', subcategory: '벨트' },
  { id: 33, name: 'Minimal Card Wallet', price: '24,000원', tag: 'NEW', tone: 'linear-gradient(135deg, #d6d3d1, #44403c)', category: 'ACCESSORIES', subcategory: '지갑' },
  { id: 34, name: 'Layered Chain Necklace', price: '33,000원', tag: '추천', tone: 'linear-gradient(135deg, #f3f4f6, #6b7280)', category: 'ACCESSORIES', subcategory: '목걸이' },
  { id: 35, name: 'Everyday Socks Pack', price: '18,000원', tag: 'MD', tone: 'linear-gradient(135deg, #f5f5f4, #94a3b8)', category: 'ACCESSORIES', subcategory: '양말' },
]

export const mainCategoryLabels = categoryMenu.map((item) => item.label)

export const getCategoryMenuItem = (category: string | null | undefined) =>
  categoryMenu.find((item) => item.key === category)
