// ============================================================
// BrewHub - Specialty Cafe & Coffee Drink Shop Type Contracts
// ============================================================

// — User Authentication & Profile —

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL?: string | null
  isAnonymous: boolean
  role?: 'admin' | 'customer' | 'barista'
  deliveryAddress?: DeliveryDetails
}

// — Application Routing & Views —

export type AppView = 'cafe' | 'receipt' | 'privacy' | 'terms' | '404'

// — Order Fulfillment —

export type OrderMode = 'pickup' | 'delivery'

export interface PickupDetails {
  date: string           // "Today, Oct 24"
  timeSlot: string       // "10:00 AM" or "ASAP (15 mins)"
  storeLocation: string
  orderNote: string
}

export interface DeliveryDetails {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  pinCode: string
  deliveryWindow: 'immediate' | 'afternoon' | 'evening'
  specialInstructions: string
}

// — Coffee Drinks & Food Cafe Menu —

export type MenuSection = 'all' | 'beverages' | 'food' | 'beans'

export type ItemCategory =
  | 'All'
  | 'Coffee'
  | 'Non-Coffee'
  | 'Pastries'
  | 'Light Bites'
  | 'Hearty Meals'
  | 'Whole Beans'
  // Backwards compatibility for drink subcategories
  | 'Espresso'
  | 'Cold Brew'
  | 'Pour Over'
  | 'Signature'

export type DrinkCategory = ItemCategory

export type DrinkTemp = 'Hot' | 'Iced' | 'Warm / Toasted' | 'Fresh'
export type DrinkSize = 'Piccolo (8oz)' | 'Regular (12oz)' | 'Large (16oz)' | 'Single Portion' | 'Shareable'
export type MilkChoice =
  | 'Oat Milk'
  | 'Almond Milk'
  | 'Soy Milk'
  | 'Hemp Milk'
  | 'Whole Milk'
  | 'Coconut Milk'
  | 'Black (No Milk)'
  | 'Standard (No Dairy Option)'

export interface BrewItem {
  id: string
  name: string
  category: ItemCategory
  itemType: 'beverage' | 'food' | 'beans'
  origin: string          // e.g. "French Normandy Butter" or "Ethiopian Kochere"
  notes: string[]         // e.g. ["Flaky Layers", "Sea Salt"]
  description: string
  price: number           // e.g. 5.50
  rating: number
  prepTime: string        // e.g. "3-5 mins"
  defaultTemp?: DrinkTemp
  inStock: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  isDecafAvailable?: boolean
  image: string           // Visual photo reference
  calories?: string
  brewMethods?: BrewMethod[]
}

// — Cart Entry for Prepared Drinks & Food —

export interface CartEntry {
  item: BrewItem
  quantity: number
  temp: DrinkTemp
  size: DrinkSize
  milk: MilkChoice
}

// — Order Receipt & Live Tracker —

export interface OrderReceipt {
  orderId: string
  orderMode: OrderMode
  items: CartEntry[]
  subtotal: number
  tax: number
  total: number
  placedAt: string
  estimatedMinutes: number
  statusStep: 1 | 2 | 3 | 4 // 1: Order Queued, 2: Grinding/Pulling/Baking, 3: Plating/Latte Art, 4: Ready
  pickupDetails?: PickupDetails
  deliveryDetails?: DeliveryDetails
}

// — Coffee Club / Drink Pass —

export type SubscriptionTier = 'Weekday Pass' | 'Daily Ritual' | 'VIP Unlimited'
export type BillingCycle = 'monthly' | 'bimonthly'

export interface SubscriptionPlan {
  tier: SubscriptionTier
  drinkAllowance: string  // e.g. "20 Handcrafted Drinks / month"
  pricePerMonth: number
  perks: string[]
}

// — Barista Brew Methods —

export type BrewMethod =
  | 'Pour Over'
  | 'AeroPress'
  | 'French Press'
  | 'Espresso'
  | 'Cold Drip'

export interface BrewGuideEntry {
  method: BrewMethod
  grind: string
  tempCelsius: number
  ratio: string
  brewTime: string
  bestFor: string[]
  steps: string[]
}

// — Tare Rewards & Loyalty Program —

export type LoyaltyTier = 'Green Bean' | "Roaster's Circle" | 'Master Tare'

export interface RewardItem {
  id: string
  title: string
  subtitle: string
  beansCost: number
  discountAmount: number
  category: 'beverage' | 'bakery' | 'beans'
  icon: string
}

export interface RewardsClubProps {
  rewardPoints: number
  stampsCount: number
  appliedReward: RewardItem | null
  onApplyReward: (reward: RewardItem) => void
  onRemoveReward: () => void
}

// — Component Props —

export type NavSection = 'origins' | 'brew-guides' | 'rewards' | 'subscription'

export interface HeaderProps {
  cartCount: number
  onCartOpen: () => void
  onNavClick: (section: NavSection) => void
  activeSection?: NavSection | null
  currentUser?: UserProfile | null
  onOpenAuth?: () => void
  onSignOut?: () => void
  theme?: 'dark' | 'light'
  onToggleTheme?: () => void
}

export interface OrderModalityProps {
  mode: OrderMode
  pickup: PickupDetails
  delivery: DeliveryDetails
  availableSlots: string[]
  availableDates: string[]
  currentUser?: UserProfile | null
  onModeChange: (mode: OrderMode) => void
  onPickupChange: (field: keyof PickupDetails, value: string) => void
  onDeliveryChange: (field: keyof DeliveryDetails, value: string) => void
  onUpdateDeliveryAddress?: (address: DeliveryDetails) => void
}

export interface CatalogProps {
  items: BrewItem[]
  activeFilter: DrinkCategory
  selectedBrewMethod?: BrewMethod | null
  onFilterChange: (cat: DrinkCategory) => void
  onSelectBrewMethod?: (method: BrewMethod | null) => void
  onClearBrewMethod?: () => void
  onAddToCart: (item: BrewItem) => void
}

export interface CartDrawerProps {
  isOpen: boolean
  entries: CartEntry[]
  orderMode?: OrderMode
  deliveryDetails?: DeliveryDetails
  currentUser?: UserProfile | null
  rewardPoints?: number
  appliedReward?: RewardItem | null
  onApplyReward?: (reward: RewardItem) => void
  onRemoveReward?: () => void
  onModeChange?: (mode: OrderMode) => void
  onDeliveryChange?: (field: keyof DeliveryDetails, value: string) => void
  onClose: () => void
  onQuantityChange: (id: string, delta: number) => void
  onTempChange: (id: string, temp: DrinkTemp) => void
  onSizeChange: (id: string, size: DrinkSize) => void
  onMilkChange: (id: string, milk: MilkChoice) => void
  onRemove: (id: string) => void
  onCheckout: () => void
  checkoutError?: string | null
}

export interface BrewGuidesProps {
  guides: BrewGuideEntry[]
  recommendedMethod?: BrewMethod
  selectedMethod?: BrewMethod | null
  onSelectMethodFilter?: (method: BrewMethod) => void
}

export interface ClubSubscriptionProps {
  plans: SubscriptionPlan[]
  selectedTier: SubscriptionTier | null
  preferredDrinkStyle: string
  billingCycle: BillingCycle
  email: string
  onTierSelect: (tier: SubscriptionTier) => void
  onStyleChange: (style: string) => void
  onCycleChange: (cycle: BillingCycle) => void
  onEmailChange: (email: string) => void
  onSubscribe: () => void
}
