import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Flame,
  Award,
  MapPin,
  FileText,
  Shield,
} from 'lucide-react'

// Core BrewHub Store & Data
import { useBrewStore } from './hooks/useBrewStore'
import { BREW_ITEMS, BREW_GUIDES, SUBSCRIPTION_PLANS } from './data/brews'
import type { BrewItem, NavSection, AppView, OrderReceipt, BrewMethod } from './types'

// Core Components
import { Header } from './components/Header'
import { CustomLogo } from './components/CustomLogo'
import { CoffeeCatalog } from './components/CoffeeCatalog'
import { CartDrawer } from './components/CartDrawer'
import { SplashLoader } from './components/SplashLoader'
import { OfflineAlert } from './components/OfflineAlert'
import { MobileOrderBar } from './components/MobileOrderBar'
import { CookieConsent } from './components/CookieConsent'
import type { AuthMode } from './components/WelcomeGate'
import type { LegalDocType } from './components/LegalModal'

// Dynamic lazy imports for non-critical below-the-fold & modal components
const OriginsBlends = lazy(() => import('./components/OriginsBlends').then((m) => ({ default: m.OriginsBlends })))
const BrewGuides = lazy(() => import('./components/BrewGuides').then((m) => ({ default: m.BrewGuides })))
const RewardsClub = lazy(() => import('./components/RewardsClub').then((m) => ({ default: m.RewardsClub })))
const ClubSubscription = lazy(() => import('./components/ClubSubscription').then((m) => ({ default: m.ClubSubscription })))
const OrderReceiptTracker = lazy(() => import('./components/OrderReceiptTracker').then((m) => ({ default: m.OrderReceiptTracker })))
const WelcomeGate = lazy(() => import('./components/WelcomeGate').then((m) => ({ default: m.WelcomeGate })))
const NotFoundView = lazy(() => import('./components/NotFoundView').then((m) => ({ default: m.NotFoundView })))
const LegalModal = lazy(() => import('./components/LegalModal').then((m) => ({ default: m.LegalModal })))
const CoffeeMascotPopup = lazy(() => import('./components/CoffeeMascotPopup').then((m) => ({ default: m.CoffeeMascotPopup })))

// Firebase Auth & Analytics
import {
  subscribeToAuth,
  signOutUser,
  getCurrentUser,
  type UserProfile,
} from './lib/firebase'
import { trackEvent } from './lib/analytics'

export default function App() {
  const {
    state,
    cartCount,
    cartSubtotal,
    finalSubtotal,
    applyReward,
    removeReward,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    changeQuantity,
    changeTemp,
    changeSize,
    changeMilk,
    setOrderMode,
    setDeliveryField,
    setCatalogFilter,
    selectTier,
    setPreferredDrinkStyle,
    setBillingCycle,
    setSubscriptionEmail,
    showToast,
    checkoutSuccess,
    checkoutError,
    checkoutReset,
  } = useBrewStore()

  // App Level State
  const [currentView, setCurrentView] = useState<AppView>('cafe')
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [isSplashActive, setIsSplashActive] = useState(() => {
    if (typeof window === 'undefined') return false
    return !sessionStorage.getItem('brewhub-splash-seen')
  })
  const [showAuthGate, setShowAuthGate] = useState(false)
  const [authGateMode, setAuthGateMode] = useState<AuthMode>('welcome')
  const [authGateDismissable, setAuthGateDismissable] = useState(true)
  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>('privacy')
  const [activeSection, setActiveSection] = useState<NavSection | null>(null)
  const [currentReceipt, setCurrentReceipt] = useState<OrderReceipt | null>(null)
  const [showGuestOrderPrompt, setShowGuestOrderPrompt] = useState(false)
  const [hasPromptedGuestOrder, setHasPromptedGuestOrder] = useState(false)
  const [selectedBrewMethod, setSelectedBrewMethod] = useState<BrewMethod | null>(null)

  const handleSelectBrewMethod = (method: BrewMethod) => {
    setSelectedBrewMethod(method)
    setCatalogFilter('Coffee')
    const menuEl = document.getElementById('menu')
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClearBrewMethod = () => {
    setSelectedBrewMethod(null)
  }

  // Theme State: Dark Espresso vs Light Oat Cream
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('brewhub-theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
    localStorage.setItem('brewhub-theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    trackEvent('page_view', { view: currentView })
    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user)
      if (user) {
        trackEvent('auth_state_change', { isAnonymous: user.isAnonymous })
      }
    })
    return () => unsubscribe()
  }, [])

  // Auto-sync user saved delivery address into order store
  useEffect(() => {
    if (currentUser?.deliveryAddress) {
      const addr = currentUser.deliveryAddress
      if (addr.fullName) setDeliveryField('fullName', addr.fullName)
      if (addr.phone) setDeliveryField('phone', addr.phone)
      if (addr.addressLine1) setDeliveryField('addressLine1', addr.addressLine1)
      if (addr.addressLine2) setDeliveryField('addressLine2', addr.addressLine2)
      if (addr.city) setDeliveryField('city', addr.city)
      if (addr.pinCode) setDeliveryField('pinCode', addr.pinCode)
      if (addr.specialInstructions) setDeliveryField('specialInstructions', addr.specialInstructions)
    }
  }, [currentUser, setDeliveryField])


  // Handle Splash Screen Completion (Recommendation 1 & 2 flow)
  const handleSplashComplete = () => {
    setIsSplashActive(false)
    trackEvent('splash_completed')

    // If someone has already logged in, they NEVER need to surf in guest mode!
    const activeUser = getCurrentUser()
    if (activeUser && !activeUser.isAnonymous) {
      setCurrentUser(activeUser)
      return
    }

    // Only prompt Welcome Gate for brand new visitors
    const hasVisited = localStorage.getItem('brewhub_has_visited')
    if (!hasVisited) {
      setAuthGateMode('welcome')
      setAuthGateDismissable(true)
      setShowAuthGate(true)
      localStorage.setItem('brewhub_has_visited', 'true')
    }
  }

  // Auth Gate Success handler
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user)
    setShowAuthGate(false)
    if (!user.isAnonymous) {
      showToast(`Welcome back, ${user.displayName || 'Coffee Friend'}!`)
    } else {
      showToast('Browsing as guest. Enjoy your coffee experience!')
    }
  }

  const handleOpenAuth = (mode: AuthMode = 'signin') => {
    setAuthGateMode(mode)
    setAuthGateDismissable(true)
    setShowAuthGate(true)
  }

  const handleSignOut = async () => {
    await signOutUser()
    setCurrentUser(null)
    showToast('Signed out successfully.')
    trackEvent('auth_logout')
  }

  // Scrollspy & Nav Handling
  const handleNavClick = (section: NavSection) => {
    if (currentView !== 'cafe') {
      setCurrentView('cafe')
      setTimeout(() => scrollToSection(section), 150)
    } else {
      scrollToSection(section)
    }
  }

  const scrollToSection = (section: NavSection) => {
    const el = document.getElementById(section)
    if (el) {
      const offset = 85
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setActiveSection(section)
    }
  }

  // Scrollspy observer
  useEffect(() => {
    if (currentView !== 'cafe') return

    const handleScroll = () => {
      const sections: NavSection[] = ['origins', 'brew-guides', 'rewards', 'subscription']
      const scrollPosition = window.scrollY + 120

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId)
            return
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveSection(null)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentView])

  // Add to cart with celebratory feedback & guest sign-in prompt
  const handleAddToCart = (item: BrewItem) => {
    addToCart(item)
    showToast(`Added ${item.name} to your cup!`)
    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#78350f'],
    })

    // When browsing in guest mode, prompt user to sign in or create an account on adding an order
    const isGuest = !currentUser || currentUser.isAnonymous
    if (isGuest && !hasPromptedGuestOrder) {
      setShowGuestOrderPrompt(true)
      setHasPromptedGuestOrder(true)
    }
  }

  // Order Checkout & Live Barista Tracker Activation
  const handleCheckout = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      checkoutError('Steam pressure dropped (Network Offline). Please reconnect your internet to send your order ticket to the bar.')
      return
    }

    if (state.cartEntries.length === 0) {
      checkoutError('Your drink order is empty. Please select a beverage before checking out.')
      return
    }

    if (state.orderMode === 'delivery') {
      if (!state.delivery.fullName.trim()) {
        checkoutError('Please enter your recipient name for delivery.')
        return
      }
      if (!state.delivery.phone.trim() || state.delivery.phone.length < 8) {
        checkoutError('Please provide a valid 10-digit contact phone number.')
        return
      }
      if (!state.delivery.addressLine1.trim() || !state.delivery.city.trim()) {
        checkoutError('Please enter your delivery street address.')
        return
      }
      if (!state.delivery.pinCode.trim() || state.delivery.pinCode.length < 4) {
        checkoutError('Please enter a valid postal pin code.')
        return
      }
    }

    const orderId = `${Math.floor(1000 + Math.random() * 9000)}`
    const subtotal = finalSubtotal
    const tax = subtotal * 0.05
    const deliveryFee = state.orderMode === 'delivery' ? 40 : 0
    const total = subtotal + tax + deliveryFee

    const receipt: OrderReceipt = {
      orderId,
      orderMode: state.orderMode,
      items: [...state.cartEntries],
      subtotal,
      tax,
      total,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: state.orderMode === 'pickup' ? 10 : 25,
      statusStep: 2,
      pickupDetails: state.orderMode === 'pickup' ? { ...state.pickup } : undefined,
      deliveryDetails: state.orderMode === 'delivery' ? { ...state.delivery } : undefined,
    }

    setCurrentReceipt(receipt)
    checkoutSuccess()
    closeCart()
    setCurrentView('receipt')

    trackEvent('order_placed', {
      orderId,
      mode: state.orderMode,
      itemCount: state.cartEntries.length,
      total,
    })

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#fbbf24', '#ffffff'],
    })
  }

  const handleSubscriptionSubmit = () => {
    if (!state.subscriptionEmail.trim() || !state.subscriptionEmail.includes('@')) {
      showToast('Please enter a valid email for your Daily Coffee Pass.')
      return
    }
    showToast(`Welcome to the Coffee Pass! Check ${state.subscriptionEmail} for your digital barista member card.`)
    confetti({
      particleCount: 50,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff'],
    })
    setSubscriptionEmail('')
  }

  const getRecommendedMethod = (): BrewMethod => {
    return 'Pour Over'
  }



  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Recommendation 1: Splash Loader with Bouncing "Loading..." & Progress */}
      <AnimatePresence>
        {isSplashActive && <SplashLoader onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* 2. Recommendation 2: Welcome / Sign-In / Sign-Up Gate */}
      <OfflineAlert />

      <WelcomeGate
        isOpen={showAuthGate}
        initialMode={authGateMode}
        isDismissable={authGateDismissable}
        onSuccess={handleAuthSuccess}
        onClose={() => setShowAuthGate(false)}
      />

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {state.toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border border-amber-500/40 text-stone-100 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 backdrop-blur-md text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{state.toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Header
        cartCount={cartCount}
        onCartOpen={openCart}
        onNavClick={handleNavClick}
        activeSection={activeSection}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('signin')}
        onSignOut={handleSignOut}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        rewardPoints={state.rewardPoints}
      />

      {/* VIEW ROUTING */}
      {currentView === 'receipt' && currentReceipt ? (
        /* DEDICATED VIEW: Live Barista Order Receipt Tracker */
        <OrderReceiptTracker
          receipt={currentReceipt}
          onBackToMenu={() => {
            checkoutReset()
            setCurrentView('cafe')
          }}
        />
      ) : currentView === '404' ? (
        /* DEDICATED VIEW: Custom 404 Spilled Coffee Page */
        <NotFoundView onBackToHome={() => setCurrentView('cafe')} />
      ) : (
        /* PRIMARY CAFE MAIN EXPERIENCE */
        <main className="flex-1">
          {/* Phase 1: Hero Section */}
          <section className="relative overflow-hidden py-24 lg:py-32 border-b border-stone-800/80">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.12)_0%,transparent_65%)] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-micro font-bold tracking-wider">
                    SPECIALTY CAFE &amp; BREW BAR &bull; BENGALURU
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Coffee, Teas &amp; Artisanal Kitchen.
                </h1>

                <p className="text-body text-stone-300 mt-6 leading-relaxed max-w-xl text-base sm:text-lg">
                  Handcrafted double espressos, ceremonial matcha, flaky French pastries, sourdough avocado tartines, and warm brunch meals. Ready in 10 minutes for express pickup or direct courier delivery.
                </p>

                <div className="mt-8 flex flex-wrap gap-4 items-center">
                  <a href="#menu" className="btn-primary py-3.5 px-6 font-bold text-sm">
                    <span>Explore Cafe &amp; Food Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleNavClick('subscription')}
                    className="md:hidden py-3.5 px-6 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Daily Coffee Pass
                  </button>
                </div>

                {/* Micro Badges */}
                <div className="mt-10 pt-8 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-stone-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs">10-Min Express Pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs">Single-Origin Roasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs">SCA 86+ Score</span>
                  </div>
                </div>
              </div>

              {/* Hero Image Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden border border-stone-800/80 shadow-2xl bg-stone-900 group">
                  <img
                    src="/latte_art_hero.jpg"
                    alt="Artisan Latte Art in Timber & Tare Ceramic Cup"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-[400px] sm:h-[480px] object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-micro font-bold text-amber-400">BARISTA SIGNATURE DRINK</span>
                      <span className="text-micro font-bold text-stone-400">₹320</span>
                    </div>
                    <p className="text-sm font-extrabold text-white">
                      Pistachio Cloud Double Cortado
                    </p>
                    <p className="text-xs text-stone-300 mt-1">
                      House roasted Ethiopian Kochere, steamed pistachio oat milk &amp; sea salt foam.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Modality is now streamlined directly inside the Cart Drawer when ordering */}

          {/* Phase 3: Coffee Cafe Drinks Menu with Search, Skeletons & Spinner Button */}
          <CoffeeCatalog
            items={BREW_ITEMS}
            activeFilter={state.catalogFilter}
            selectedBrewMethod={selectedBrewMethod}
            onFilterChange={(cat) => {
              setCatalogFilter(cat)
              if (cat !== 'Coffee' && cat !== 'All') {
                setSelectedBrewMethod(null)
              }
            }}
            onSelectBrewMethod={setSelectedBrewMethod}
            onClearBrewMethod={handleClearBrewMethod}
            onAddToCart={handleAddToCart}
          />

          {/* Phase 5: Origins & Blends */}
          <Suspense fallback={null}>
            <OriginsBlends />
          </Suspense>

          {/* Phase 6: Brew Guides */}
          <BrewGuides
            guides={BREW_GUIDES}
            recommendedMethod={getRecommendedMethod()}
            onSelectMethodFilter={handleSelectBrewMethod}
          />

          {/* Phase 6B: Tare Rewards & Bean Bank Loyalty */}
          <RewardsClub
            rewardPoints={state.rewardPoints}
            stampsCount={state.stampsCount}
            appliedReward={state.appliedReward}
            onApplyReward={applyReward}
            onRemoveReward={removeReward}
          />

          {/* Phase 7: Club Subscription / Daily Coffee Pass */}
          <ClubSubscription
            plans={SUBSCRIPTION_PLANS}
            selectedTier={state.selectedTier}
            preferredDrinkStyle={state.preferredDrinkStyle}
            billingCycle={state.billingCycle}
            email={state.subscriptionEmail}
            onTierSelect={selectTier}
            onStyleChange={setPreferredDrinkStyle}
            onCycleChange={setBillingCycle}
            onEmailChange={setSubscriptionEmail}
            onSubscribe={handleSubscriptionSubmit}
          />
        </main>
      )}

      {/* Sticky Mobile Bottom Order CTA Bar */}
      <MobileOrderBar
        cartCount={cartCount}
        cartSubtotal={cartSubtotal}
        orderMode={state.orderMode}
        onOpenCart={openCart}
      />

      {/* Cart Drawer with Streamlined Modality & Delivery Address */}
      <CartDrawer
        isOpen={state.cartOpen}
        entries={state.cartEntries}
        orderMode={state.orderMode}
        deliveryDetails={state.delivery}
        currentUser={currentUser}
        rewardPoints={state.rewardPoints}
        appliedReward={state.appliedReward}
        onApplyReward={applyReward}
        onRemoveReward={removeReward}
        onModeChange={setOrderMode}
        onDeliveryChange={setDeliveryField}
        onClose={closeCart}
        onQuantityChange={changeQuantity}
        onTempChange={changeTemp}
        onSizeChange={changeSize}
        onMilkChange={changeMilk}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        checkoutError={state.checkoutError}
      />

      {/* Legal Modal (Privacy Policy & Terms) */}
      <LegalModal
        isOpen={legalModalOpen}
        activeDoc={activeLegalDoc}
        onClose={() => setLegalModalOpen(false)}
        onSwitchDoc={(doc) => setActiveLegalDoc(doc)}
      />

      {/* Coffee Mascot Guest Popup & Floating Companion Widget */}
      <CoffeeMascotPopup
        isGuest={!currentUser || currentUser.isAnonymous}
        isOpen={showGuestOrderPrompt}
        onClose={() => setShowGuestOrderPrompt(false)}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-950 py-16 text-stone-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="mb-4">
              <CustomLogo />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Specialty coffee cafe &amp; brew bar. Handcrafted espressos, slow-drip cold coffee, and pour-overs prepared fresh to order.
            </p>
          </div>

          <div>
            <h4 className="text-micro text-white font-bold tracking-wider mb-4">DRINK MENU</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Espresso Classics
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Nitro &amp; Cold Brews
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-400 transition-colors">
                  Manual V60 Pour-Overs
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('subscription')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Daily Coffee Pass
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-micro text-white font-bold tracking-wider mb-4">CAFE LOCATION</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Timber &amp; Tare Roastery &amp; Bar, 42 Arabica Lane, Bengaluru 560001</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon-Sun: 7:30 AM - 7:00 PM</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-micro text-white font-bold tracking-wider mb-4">HOURS &amp; ORDERS</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="leading-relaxed">
                Order ahead for 10-min counter express pickup or direct courier delivery.
              </p>
              <p className="text-amber-400 font-medium pt-1">
                hello@timberandtare.cafe &bull; +91 (80) 4567-8900
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveLegalDoc('privacy')
                    setLegalModalOpen(true)
                  }}
                  className="hover:text-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-amber-400" />
                  <span>Privacy Policy</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveLegalDoc('terms')
                    setLegalModalOpen(true)
                  }}
                  className="hover:text-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>Terms</span>
                </button>

              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; 2026 Timber &amp; Tare Roastery. All rights reserved.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Specialty Arabica</span>
            <span>&bull;</span>
            <span>Freshly Brewed To Order</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
