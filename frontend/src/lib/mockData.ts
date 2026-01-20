// src/lib/mockData.ts

export type Review = {
  productId: string
  userName: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

export type Product = {
  id: string
  name: string
  price: number
  discountPrice?: number
  description: string
  category: string
  images: string[]
  colorImages?: Record<string, string[]>
  sizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL'>
  colors: string[]
  isNew: boolean
  materials?: string
  care?: string
  unavailableSizes?: Array<'XS' | 'S' | 'M' | 'L' | 'XL'>
}

export type Category = {
  id: string
  name: string
  slug: string
  imageUrl: string
}

const SIZES: Array<'XS' | 'S' | 'M' | 'L' | 'XL'> = ['XS', 'S', 'M', 'L', 'XL']

// --- IMAGENS REAIS E CURADAS (UNSPLASH IDS) ---
// Usamos IDs fixos para garantir que a imagem sempre carregue e seja sempre a mesma.
const IMG = {
  hero: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
  
  // Vestidos
  dress1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', // Preto elegante
  dress2: 'https://images.unsplash.com/photo-1550614000-4b9519e090e2?auto=format&fit=crop&w=800&q=80', // Detalhe tecido
  dress3: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80', // Veludo/Seda
  
  // Blazers
  blazer1: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', // Bege/Linho
  blazer2: 'https://images.unsplash.com/photo-1578587017763-9d32388998a1?auto=format&fit=crop&w=800&q=80', // Detalhe Bege
  blazerBlack: 'https://images.unsplash.com/photo-1552874869-5c39e531f3dd?auto=format&fit=crop&w=800&q=80', // Preto
  
  // Calças
  pants1: 'https://images.unsplash.com/photo-1584370848010-d7cc637703ef?auto=format&fit=crop&w=800&q=80', // Pantalona Clara
  pants2: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80', // Alfaiataria Cinza
  
  // Saias
  skirt1: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', // Plissada Clara
  
  // Camisas
  shirt1: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', // Branca
  shirt2: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&w=800&q=80', // Detalhe Branca
  
  // Acessórios (CORRIGIDO: Agora são fotos reais de acessórios)
  bag1: 'https://images.unsplash.com/photo-1590874103328-1ab2393c1f71?auto=format&fit=crop&w=800&q=80', // Bolsa Bege
  bag2: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', // Bolsa Detalhe
  
  sneaker1: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80', // Tênis Branco
  sneaker2: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', // Tênis Sola
  
  watch1: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', // Relógio Minimal
  watch2: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80', // Relógio Pulso
}

export const heroSlides = [
  {
    id: 'hero-1',
    tag: 'SUMMER 2026',
    title: 'THE LINEN COLLECTION',
    subtitle: 'Peças atemporais com cortes precisos',
    imageUrl: IMG.hero,
    ctaLabel: 'Shop Collection',
    ctaHref: '/products',
  },
]

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Vestido Midi Minimalista',
    price: 299.9,
    discountPrice: 259.9,
    description: 'Vestido midi preto em corte reto, perfeito para composições minimalistas e noturnas.',
    category: 'Vestidos',
    images: [IMG.dress1, IMG.dress2, IMG.dress3],
    colorImages: {
      '#000000': [IMG.dress1, IMG.dress2],
      '#F5F5DC': [IMG.dress3, IMG.dress2],
    },
    sizes: SIZES,
    colors: ['#000000', '#F5F5DC'],
    isNew: true,
    materials: '55% Linho, 45% Viscose',
    care: 'Lavar à mão em água fria; secar na sombra.',
    unavailableSizes: ['XS'],
  },
  {
    id: 'p2',
    name: 'Blazer Estruturado',
    price: 459.0,
    description: 'Blazer em linho bege com ombros marcados e tecido encorpado para uma silhueta elegante.',
    category: 'Blusas',
    images: [IMG.blazer1, IMG.blazer2, IMG.blazerBlack],
    colorImages: {
      '#c8a882': [IMG.blazer1, IMG.blazer2],
      '#111111': [IMG.blazerBlack, IMG.blazer1],
    },
    sizes: SIZES,
    colors: ['#c8a882', '#111111'],
    isNew: false,
    materials: '100% Linho Natural',
    care: 'Lavagem a seco recomendada.',
    unavailableSizes: ['XL'],
  },
  {
    id: 'p3',
    name: 'Calça Alfaiataria Wide',
    price: 329.0,
    description: 'Calça off-white com caimento impecável e pernas amplas.',
    category: 'Calças',
    images: [IMG.pants1, IMG.pants2, IMG.blazer1],
    colorImages: {
      '#F5F5DC': [IMG.pants1, IMG.pants2],
      '#000000': [IMG.pants2, IMG.pants1], // Simulando cor escura com foto cinza
    },
    sizes: SIZES,
    colors: ['#F5F5DC', '#000000'],
    isNew: false,
    materials: '52% Algodão, 46% Poliéster, 2% Elastano',
    care: 'Lavar do avesso em água fria.',
    unavailableSizes: ['XS', 'XL'],
  },
  {
    id: 'p4',
    name: 'Saia Plissada',
    price: 249.9,
    description: 'Saia com plissado fino e movimento leve, perfeita para o dia a dia.',
    category: 'Saias',
    images: [IMG.skirt1, IMG.dress3, IMG.dress2], // Usando fotos de tecidos fluidos
    sizes: SIZES,
    colors: ['#F5F5DC'],
    isNew: true,
    materials: '100% Poliéster reciclado',
    care: 'Lavar à mão; não torcer.',
  },
  {
    id: 'p5',
    name: 'Camisa Algodão Premium',
    price: 389.0,
    description: 'Camisa branca clássica com toque acetinado e caimento sofisticado.',
    category: 'Blusas',
    images: [IMG.shirt1, IMG.shirt2, IMG.blazer1],
    colorImages: {
      '#ffffff': [IMG.shirt1, IMG.shirt2],
    },
    sizes: SIZES,
    colors: ['#ffffff'],
    isNew: false,
    materials: '100% Algodão Egípcio',
    care: 'Lavar a seco; armazenar em cabide.',
    unavailableSizes: ['XS', 'S'],
  },
  {
    id: 'p6',
    name: 'Bolsa Couro Minimalista',
    price: 599.0,
    description: 'Bolsa estruturada em couro legítimo com design arquitetônico.',
    category: 'Acessórios', // Mudado de 'Bolsas' para bater com o menu
    images: [IMG.bag1, IMG.bag2], // CORRIGIDO: Agora usa fotos de bolsa
    colorImages: {
      '#c8a882': [IMG.bag1, IMG.bag2],
    },
    sizes: ['M'] as any, // Bolsas geralmente tam único
    colors: ['#c8a882'],
    isNew: true,
    materials: 'Couro legítimo, Metais Dourados',
    care: 'Hidratar o couro com creme neutro.',
    unavailableSizes: [],
  },
  {
    id: 'p7',
    name: 'Tênis Urbano Clean',
    price: 449.0,
    description: 'Tênis branco em couro com linhas limpas e conforto premium.',
    category: 'Acessórios', // Mudado para Acessórios ou Calçados
    images: [IMG.sneaker1, IMG.sneaker2], // CORRIGIDO: Agora usa fotos de tênis
    colorImages: {
      '#ffffff': [IMG.sneaker1, IMG.sneaker2],
    },
    sizes: ['36', '37', '38', '39', '40'] as any,
    colors: ['#ffffff'],
    isNew: false,
    materials: 'Cabedal em couro; sola em borracha natural',
    care: 'Limpar com pano úmido.',
  },
  {
    id: 'p8',
    name: 'Relógio Minimal',
    price: 799.0,
    description: 'Relógio com visual minimalista e materiais de alta qualidade.',
    category: 'Acessórios',
    images: [IMG.watch1, IMG.watch2], // CORRIGIDO: Agora usa fotos de relógio
    colorImages: {
      '#000000': [IMG.watch1, IMG.watch2],
    },
    sizes: ['UN'] as any,
    colors: ['#000000'],
    isNew: true,
    materials: 'Aço Inoxidável, Couro',
    care: 'Evitar contato prolongado com água.',
  },
]

export const reviews: Review[] = [
  { productId: 'p1', userName: 'Ana', rating: 5, title: 'Perfeito', comment: 'Corte impecável e tecido excelente.', createdAt: '2026-01-01' },
  { productId: 'p2', userName: 'Bruno', rating: 4, title: 'Elegante', comment: 'Blazer com ótimo caimento.', createdAt: '2026-01-05' },
]

export const categories: Category[] = [
  { id: 'c1', name: 'Vestidos', slug: 'vestidos', imageUrl: IMG.dress1 },
  { id: 'c2', name: 'Blusas', slug: 'blusas', imageUrl: IMG.shirt1 },
  { id: 'c3', name: 'Calças', slug: 'calcas', imageUrl: IMG.pants1 },
  { id: 'c4', name: 'Acessórios', slug: 'acessorios', imageUrl: IMG.bag1 },
]