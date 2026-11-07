import { useReducer, useCallback } from 'react'
import type {
  OrderMode, PickupDetails, DeliveryDetails,
  BrewItem, CartEntry, DrinkTemp, DrinkSize, MilkChoice,
  DrinkCategory, SubscriptionTier, BillingCycle, RewardItem
} from '../types'

// ─── State Shape ─────────────────────────────────────────────

interface BrewState {
  cartEntries: CartEntry[]
  cartOpen: boolean

  orderMode: OrderMode
  pickup: PickupDetails
  delivery: DeliveryDetails

  catalogFilter: DrinkCategory

  selectedTier: SubscriptionTier | null
  preferredDrinkStyle: string
  billingCycle: BillingCycle
  subscriptionEmail: string

  toastMessage: string | null
  checkoutError: string | null
  checkoutSuccess: boolean

  rewardPoints: number
  stampsCount: number
  appliedReward: RewardItem | null
}

// ─── Actions ─────────────────────────────────────────────────

type Action =
  | { type: 'CART_OPEN' }
  | { type: 'CART_CLOSE' }
  | { type: 'ADD_TO_CART'; item: BrewItem; temp?: DrinkTemp; size?: DrinkSize; milk?: MilkChoice }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CHANGE_QUANTITY'; id: string; delta: number }
  | { type: 'CHANGE_TEMP'; id: string; temp: DrinkTemp }
  | { type: 'CHANGE_SIZE'; id: string; size: DrinkSize }
  | { type: 'CHANGE_MILK'; id: string; milk: MilkChoice }
  | { type: 'SET_ORDER_MODE'; mode: OrderMode }
  | { type: 'SET_PICKUP_FIELD'; field: keyof PickupDetails; value: string }
  | { type: 'SET_DELIVERY_FIELD'; field: keyof DeliveryDetails; value: string }
  | { type: 'SET_CATALOG_FILTER'; filter: DrinkCategory }
  | { type: 'SET_TIER'; tier: SubscriptionTier }
  | { type: 'SET_DRINK_STYLE'; style: string }
  | { type: 'SET_BILLING_CYCLE'; cycle: BillingCycle }
  | { type: 'SET_SUBSCRIPTION_EMAIL'; email: string }
  | { type: 'SET_TOAST'; message: string | null }
  | { type: 'CHECKOUT_SUCCESS' }
  | { type: 'CHECKOUT_ERROR'; message: string }
  | { type: 'CHECKOUT_RESET' }
  | { type: 'APPLY_REWARD'; reward: RewardItem }
  | { type: 'REMOVE_REWARD' }
  | { type: 'ADD_STAMP' }

// ─── Initial State ───────────────────────────────────────────

const initialPickup: PickupDetails = {
  date: 'Today, Oct 21',
  timeSlot: 'ASAP (Ready in 10–15 mins)',
  storeLocation: 'BrewHub Roastery & Cafe, 42 Arabica Lane, Bengaluru',
  orderNote: '',
}

const initialDelivery: DeliveryDetails = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Bengaluru',
  pinCode: '',
  deliveryWindow: 'immediate',
  specialInstructions: '',
}

const initialState: BrewState = {
  cartEntries: [],
  cartOpen: false,
  orderMode: 'pickup',
  pickup: initialPickup,
  delivery: initialDelivery,
  catalogFilter: 'All',
  selectedTier: 'Weekday Pass',
  preferredDrinkStyle: 'Flat White & Lattes',
  billingCycle: 'monthly',
  subscriptionEmail: '',
  toastMessage: null,
  checkoutError: null,
  checkoutSuccess: false,
  rewardPoints: typeof window !== 'undefined' ? (Number(localStorage.getItem('timber-tare-beans')) || 0) : 0,
  stampsCount: typeof window !== 'undefined' ? (Number(localStorage.getItem('timber-tare-stamps')) || 0) : 0,
  appliedReward: null,
}

// ─── Reducer ─────────────────────────────────────────────────

function brewReducer(state: BrewState, action: Action): BrewState {
  switch (action.type) {
    case 'CART_OPEN':
      return { ...state, cartOpen: true }
    case 'CART_CLOSE':
      return { ...state, cartOpen: false }

    case 'ADD_TO_CART': {
      const existing = state.cartEntries.find(e => e.item.id === action.item.id)
      if (existing) {
        return {
          ...state,
          cartEntries: state.cartEntries.map(e =>
            e.item.id === action.item.id
              ? { ...e, quantity: e.quantity + 1 }
              : e
          ),
        }
      }
      const isFood = action.item.itemType === 'food'
      const newEntry: CartEntry = {
        item: action.item,
        quantity: 1,
        temp: action.temp || action.item.defaultTemp || (isFood ? 'Warm / Toasted' : 'Hot'),
        size: action.size || (isFood ? 'Single Portion' : 'Regular (12oz)'),
        milk: action.milk || (isFood ? 'Standard (No Dairy Option)' : action.item.category === 'Pour Over' ? 'Black (No Milk)' : 'Oat Milk'),
      }
      return { ...state, cartEntries: [...state.cartEntries, newEntry] }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cartEntries: state.cartEntries.filter(e => e.item.id !== action.id),
      }

    case 'CHANGE_QUANTITY':
      return {
        ...state,
        cartEntries: state.cartEntries.map(e =>
          e.item.id === action.id
            ? { ...e, quantity: Math.max(1, e.quantity + action.delta) }
            : e
        ),
      }

    case 'CHANGE_TEMP':
      return {
        ...state,
        cartEntries: state.cartEntries.map(e =>
          e.item.id === action.id ? { ...e, temp: action.temp } : e
        ),
      }

    case 'CHANGE_SIZE':
      return {
        ...state,
        cartEntries: state.cartEntries.map(e =>
          e.item.id === action.id ? { ...e, size: action.size } : e
        ),
      }

    case 'CHANGE_MILK':
      return {
        ...state,
        cartEntries: state.cartEntries.map(e =>
          e.item.id === action.id ? { ...e, milk: action.milk } : e
        ),
      }

    case 'SET_ORDER_MODE':
      return { ...state, orderMode: action.mode }

    case 'SET_PICKUP_FIELD':
      return { ...state, pickup: { ...state.pickup, [action.field]: action.value } }

    case 'SET_DELIVERY_FIELD':
      return { ...state, delivery: { ...state.delivery, [action.field]: action.value } }

    case 'SET_CATALOG_FILTER':
      return { ...state, catalogFilter: action.filter }

    case 'SET_TIER':
      return { ...state, selectedTier: action.tier }

    case 'SET_DRINK_STYLE':
      return { ...state, preferredDrinkStyle: action.style }

    case 'SET_BILLING_CYCLE':
      return { ...state, billingCycle: action.cycle }

    case 'SET_SUBSCRIPTION_EMAIL':
      return { ...state, subscriptionEmail: action.email }

    case 'SET_TOAST':
      return { ...state, toastMessage: action.message }

    case 'CHECKOUT_SUCCESS': {
      const earned = Math.floor(
        state.cartEntries.reduce((sum, e) => sum + e.item.price * e.quantity, 0) / 10
      )
      const bevCount = state.cartEntries.filter(e => e.item.itemType === 'beverage').reduce((sum, e) => sum + e.quantity, 0)
      const costDeducted = state.appliedReward ? state.appliedReward.beansCost : 0
      const nextPoints = Math.max(0, state.rewardPoints - costDeducted) + earned
      const nextStamps = (state.stampsCount + bevCount) % 10
      try {
        localStorage.setItem('timber-tare-beans', String(nextPoints))
        localStorage.setItem('timber-tare-stamps', String(nextStamps))
      } catch {}
      return {
        ...state,
        checkoutSuccess: true,
        checkoutError: null,
        cartEntries: [],
        appliedReward: null,
        rewardPoints: nextPoints,
        stampsCount: nextStamps,
      }
    }

    case 'APPLY_REWARD':
      return { ...state, appliedReward: action.reward }

    case 'REMOVE_REWARD':
      return { ...state, appliedReward: null }

    case 'ADD_STAMP': {
      const updated = state.stampsCount >= 10 ? 1 : state.stampsCount + 1
      const bonus = updated === 10 ? 120 : 0
      const updatedPoints = state.rewardPoints + bonus
      try {
        localStorage.setItem('timber-tare-stamps', String(updated))
        localStorage.setItem('timber-tare-beans', String(updatedPoints))
      } catch {}
      return { ...state, stampsCount: updated, rewardPoints: updatedPoints }
    }

    case 'CHECKOUT_ERROR':
      return { ...state, checkoutError: action.message, checkoutSuccess: false }

    case 'CHECKOUT_RESET':
      return { ...state, checkoutError: null, checkoutSuccess: false }

    default:
      return state
  }
}

// ─── Hook ────────────────────────────────────────────────────

export function useBrewStore() {
  const [state, dispatch] = useReducer(brewReducer, initialState)

  const cartCount = state.cartEntries.reduce((sum, e) => sum + e.quantity, 0)
  const cartSubtotal = state.cartEntries.reduce(
    (sum, e) => sum + e.item.price * e.quantity,
    0
  )
  const rewardDiscount = state.appliedReward
    ? Math.min(state.appliedReward.discountAmount, cartSubtotal)
    : 0
  const finalSubtotal = Math.max(0, cartSubtotal - rewardDiscount)

  const openCart = useCallback(() => dispatch({ type: 'CART_OPEN' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CART_CLOSE' }), [])
  const addToCart = useCallback((item: BrewItem, temp?: DrinkTemp, size?: DrinkSize, milk?: MilkChoice) =>
    dispatch({ type: 'ADD_TO_CART', item, temp, size, milk }), [])
  const removeFromCart = useCallback((id: string) => dispatch({ type: 'REMOVE_FROM_CART', id }), [])
  const changeQuantity = useCallback((id: string, delta: number) => dispatch({ type: 'CHANGE_QUANTITY', id, delta }), [])
  const changeTemp = useCallback((id: string, temp: DrinkTemp) => dispatch({ type: 'CHANGE_TEMP', id, temp }), [])
  const changeSize = useCallback((id: string, size: DrinkSize) => dispatch({ type: 'CHANGE_SIZE', id, size }), [])
  const changeMilk = useCallback((id: string, milk: MilkChoice) => dispatch({ type: 'CHANGE_MILK', id, milk }), [])
  const setOrderMode = useCallback((mode: OrderMode) => dispatch({ type: 'SET_ORDER_MODE', mode }), [])
  const setPickupField = useCallback((field: keyof PickupDetails, value: string) => dispatch({ type: 'SET_PICKUP_FIELD', field, value }), [])
  const setDeliveryField = useCallback((field: keyof DeliveryDetails, value: string) => dispatch({ type: 'SET_DELIVERY_FIELD', field, value }), [])
  const setCatalogFilter = useCallback((filter: DrinkCategory) => dispatch({ type: 'SET_CATALOG_FILTER', filter }), [])
  const selectTier = useCallback((tier: SubscriptionTier) => dispatch({ type: 'SET_TIER', tier }), [])
  const setPreferredDrinkStyle = useCallback((style: string) => dispatch({ type: 'SET_DRINK_STYLE', style }), [])
  const setBillingCycle = useCallback((cycle: BillingCycle) => dispatch({ type: 'SET_BILLING_CYCLE', cycle }), [])
  const setSubscriptionEmail = useCallback((email: string) => dispatch({ type: 'SET_SUBSCRIPTION_EMAIL', email }), [])
  const showToast = useCallback((message: string) => {
    dispatch({ type: 'SET_TOAST', message })
    setTimeout(() => dispatch({ type: 'SET_TOAST', message: null }), 3000)
  }, [])
  const checkoutSuccess = useCallback(() => dispatch({ type: 'CHECKOUT_SUCCESS' }), [])
  const checkoutError = useCallback((message: string) => dispatch({ type: 'CHECKOUT_ERROR', message }), [])
  const checkoutReset = useCallback(() => dispatch({ type: 'CHECKOUT_RESET' }), [])
  const applyReward = useCallback((reward: RewardItem) => dispatch({ type: 'APPLY_REWARD', reward }), [])
  const removeReward = useCallback(() => dispatch({ type: 'REMOVE_REWARD' }), [])
  const addStamp = useCallback(() => dispatch({ type: 'ADD_STAMP' }), [])

  return {
    state,
    cartCount,
    cartSubtotal,
    rewardDiscount,
    finalSubtotal,
    applyReward,
    removeReward,
    addStamp,
    openCart, closeCart,
    addToCart, removeFromCart, changeQuantity,
    changeTemp, changeSize, changeMilk,
    setOrderMode, setPickupField, setDeliveryField,
    setCatalogFilter,
    selectTier, setPreferredDrinkStyle, setBillingCycle, setSubscriptionEmail,
    showToast,
    checkoutSuccess, checkoutError, checkoutReset,
  }
}