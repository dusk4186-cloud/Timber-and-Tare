import type { RewardItem } from '../types'

export const REWARD_ITEMS: RewardItem[] = [
  {
    id: 'reward-espresso-cortado',
    title: 'Free Artisan Espresso or Cortado',
    subtitle: 'Double ristretto or 1:1 textured milk cortado',
    beansCost: 120,
    discountAmount: 220,
    category: 'beverage',
    icon: '☕',
  },
  {
    id: 'reward-bakery-pastry',
    title: 'Free French Butter Bakery Treat',
    subtitle: 'Flaky Normandy croissant, cardamom scone or muffin',
    beansCost: 180,
    discountAmount: 180,
    category: 'bakery',
    icon: '🥐',
  },
  {
    id: 'reward-signature-drink',
    title: 'Free Barista Signature Beverage',
    subtitle: 'Pistachio Cloud Latte, Smoked Caramel Macchiato or Kyoto Cold Drip',
    beansCost: 280,
    discountAmount: 320,
    category: 'beverage',
    icon: '🧋',
  },
  {
    id: 'reward-whole-bean-bag',
    title: 'Free 250g Whole Bean Micro-Lot Bag',
    subtitle: 'Freshly roasted Ethiopian Kochere or Colombia Huila for home brewing',
    beansCost: 500,
    discountAmount: 580,
    category: 'beans',
    icon: '📦',
  },
]
