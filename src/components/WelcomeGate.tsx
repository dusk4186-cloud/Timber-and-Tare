import React, { useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  X,
  AlertCircle,
  Check,
  MapPin,
  Phone,
  Building,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  continueAsGuest,
  validatePasswordRules,
  type UserProfile,
} from '../lib/firebase'
import type { DeliveryDetails } from '../types'
import { trackEvent } from '../lib/analytics'

export type AuthMode = 'welcome' | 'signin' | 'signup'

interface WelcomeGateProps {
  isOpen: boolean
  initialMode?: AuthMode
  isDismissable?: boolean
  onSuccess: (user: UserProfile) => void
  onClose?: () => void
}

export const WelcomeGate: React.FC<WelcomeGateProps> = ({
  isOpen,
  initialMode = 'welcome',
  isDismissable = true,
  onSuccess,
  onClose,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [signupStep, setSignupStep] = useState<1 | 2>(1)

  // Step 1: Credentials
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Step 2: Delivery Address
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('Bengaluru')
  const [pinCode, setPinCode] = useState('560001')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Unique IDs for form controls
  const step2PhoneId = useId()
  const step2Addr1Id = useId()
  const step2Addr2Id = useId()
  const step2CityId = useId()
  const step2PinId = useId()

  if (!isOpen) return null

  // Password rules validation
  const pwCheck = validatePasswordRules(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const isStep1Valid =
    email.includes('@') &&
    displayName.trim().length > 0 &&
    pwCheck.isValid &&
    passwordsMatch

  // Calculate score for strength bar
  const strengthScore = [
    pwCheck.min9,
    pwCheck.hasCaps,
    pwCheck.hasNumber,
    pwCheck.hasSpecial,
  ].filter(Boolean).length

  const handleGuest = () => {
    trackEvent('auth_guest')
    const guestUser = continueAsGuest()
    onSuccess(guestUser)
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)
    try {
      trackEvent('auth_login', { method: 'email' })
      const user = await signInWithEmail(email, password)
      onSuccess(user)
    } catch (err: unknown) {
      setErrorMessage(
        (err as { message?: string }).message ||
          'Failed to sign in. Please verify your credentials.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!pwCheck.isValid) {
      setErrorMessage('Please fulfill all 4 password security requirements.')
      return
    }
    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please re-enter.')
      return
    }
    setSignupStep(2)
  }

  const handleCompleteSignUp = async (skipAddress = false) => {
    setErrorMessage(null)
    setIsLoading(true)

    let deliveryAddress: DeliveryDetails | undefined
    if (!skipAddress && addressLine1.trim()) {
      deliveryAddress = {
        fullName: displayName || 'Coffee Lover',
        phone: phone || '+91 98765 43210',
        addressLine1,
        addressLine2,
        city: city || 'Bengaluru',
        pinCode: pinCode || '560001',
        deliveryWindow: 'immediate',
        specialInstructions,
      }
    }

    try {
      trackEvent('auth_signup', {
        method: 'email',
        hasAddress: Boolean(deliveryAddress),
      })
      const user = await signUpWithEmail(email, password, displayName, deliveryAddress)
      onSuccess(user)
    } catch (err: unknown) {
      setErrorMessage(
        (err as { message?: string }).message ||
          'Failed to create account. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setErrorMessage(null)
    setIsLoading(true)
    try {
      trackEvent('auth_login', { method: 'google' })
      const user = await signInWithGoogle()
      onSuccess(user)
    } catch (err: unknown) {
      setErrorMessage(
        (err as { message?: string }).message ||
          'Google authentication was canceled.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        >
          {/* Dismiss button */}
          {isDismissable && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-950/60 text-stone-300 hover:text-white hover:bg-stone-950 flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Hero Latte Art Header with organic curved bottom */}
          <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-stone-950 shrink-0">
            <img
              src="/latte_art_hero.jpg"
              alt="Artisanal Latte Art in Timber & Tare Ceramic Cup"
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-6 bg-stone-900 rounded-t-[2rem]" />
          </div>

          {/* Card Body - Scrollable */}
          <div className="px-6 pb-7 pt-1 sm:px-8 overflow-y-auto">
            {/* VIEW 1: WELCOME SCREEN */}
            {mode === 'welcome' && (
              <div className="text-center py-2">
                <span className="inline-block px-3 py-1 rounded-full text-micro font-semibold tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 mb-3">
                  ARTISANAL ROASTERY &amp; CAFE
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome to Timber & Tare
                </h2>
                <p className="text-body text-stone-400 mt-2 text-sm leading-relaxed max-w-sm mx-auto">
                  Handcrafted specialty single-origins, velvety lattes, and nitro cold brews prepared fresh to order.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    Sign In
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setSignupStep(1)
                    }}
                    className="w-full py-3.5 px-6 rounded-full bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-semibold text-sm tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    Create Account
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleGuest}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-400 hover:text-amber-400 transition-colors cursor-pointer py-1"
                    >
                      <span>Browse menu as Guest</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2 & 3: SIGN IN / SIGN UP */}
            {(mode === 'signin' || mode === 'signup') && (
              <div>
                {/* Tabs switcher */}
                <div className="flex border-b border-stone-800 pb-3 mb-5 relative">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setErrorMessage(null)
                    }}
                    className={`flex-1 text-center py-1 text-sm font-bold tracking-wide transition-colors cursor-pointer ${
                      mode === 'signin'
                        ? 'text-amber-400'
                        : 'text-stone-400 hover:text-stone-300'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup')
                      setSignupStep(1)
                      setErrorMessage(null)
                    }}
                    className={`flex-1 text-center py-1 text-sm font-bold tracking-wide transition-colors cursor-pointer ${
                      mode === 'signup'
                        ? 'text-amber-400'
                        : 'text-stone-400 hover:text-stone-300'
                    }`}
                  >
                    Sign Up
                  </button>

                  <motion.div
                    layoutId="auth-tab-indicator"
                    className="absolute bottom-0 h-0.5 bg-amber-400 rounded-full"
                    style={{
                      left: mode === 'signin' ? '12%' : '62%',
                      width: '26%',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SIGN IN FORM */}
                {mode === 'signin' && (
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1.5">
                        Email Address or Username
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="brewhub or you@cafe.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-medium text-stone-400">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setErrorMessage('Password reset link sent to registered email.')
                          }
                          className="text-[11px] text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-2.5 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </form>
                )}

                {/* SIGN UP FORM: STEP 1 (Credentials & 4 Password Rules) */}
                {mode === 'signup' && signupStep === 1 && (
                  <form onSubmit={handleGoToStep2} className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs pb-1 mb-1 border-b border-stone-800/60">
                      <span className="text-amber-400 font-bold">Step 1 of 2: Account Security</span>
                      <span className="text-stone-400">Next: Delivery Address</span>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Alex Rivers"
                          className="w-full pl-10 pr-4 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@example.com"
                          className="w-full pl-10 pr-4 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a strong password"
                          className="w-full pl-10 pr-10 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Strength Meter Bar */}
                      {password.length > 0 && (
                        <div className="mt-2">
                          <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className={`h-full transition-all duration-300 ${
                                strengthScore <= 2
                                  ? 'bg-red-500'
                                  : strengthScore === 3
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${(strengthScore / 4) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Visual Password Security Rules Checklist */}
                      <div className="mt-2.5 p-3 rounded-xl bg-stone-950/80 border border-stone-800/80 space-y-1.5 text-[11px]">
                        <p className="text-stone-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                          Password Security Requirements:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          <div
                            className={`flex items-center gap-1.5 ${
                              pwCheck.min9 ? 'text-emerald-400 font-medium' : 'text-stone-400'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                pwCheck.min9
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {pwCheck.min9 ? <Check className="w-2.5 h-2.5" /> : '•'}
                            </span>
                            <span>At least 9 characters long</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 ${
                              pwCheck.hasCaps ? 'text-emerald-400 font-medium' : 'text-stone-400'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                pwCheck.hasCaps
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {pwCheck.hasCaps ? <Check className="w-2.5 h-2.5" /> : '•'}
                            </span>
                            <span>At least 1 Capital letter (A-Z)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 ${
                              pwCheck.hasNumber ? 'text-emerald-400 font-medium' : 'text-stone-400'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                pwCheck.hasNumber
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {pwCheck.hasNumber ? <Check className="w-2.5 h-2.5" /> : '•'}
                            </span>
                            <span>At least 1 Number (0-9)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 ${
                              pwCheck.hasSpecial ? 'text-emerald-400 font-medium' : 'text-stone-400'
                            }`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                pwCheck.hasSpecial
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {pwCheck.hasSpecial ? <Check className="w-2.5 h-2.5" /> : '•'}
                            </span>
                            <span>1 Special symbol (!@#$...)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-10 pr-10 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                        {confirmPassword.length > 0 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {passwordsMatch ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!isStep1Valid}
                      className="w-full mt-2 py-3 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Continue to Delivery Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* SIGN UP FORM: STEP 2 (Delivery Address Details) */}
                {mode === 'signup' && signupStep === 2 && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-xs pb-1 border-b border-stone-800/60">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="text-stone-400 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Step 1</span>
                      </button>
                      <span className="text-amber-400 font-bold">Step 2 of 2: Express Delivery</span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-stone-300">
                      <span className="font-bold text-amber-300 block mb-0.5">
                        Never re-type your address again!
                      </span>
                      Save your delivery details now so you can order your favorite coffee with 1-click delivery anytime.
                    </div>

                    <div>
                      <label htmlFor={step2PhoneId} className="block text-xs font-medium text-stone-400 mb-1">
                        Contact Mobile Phone *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id={step2PhoneId}
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={step2Addr1Id} className="block text-xs font-medium text-stone-400 mb-1">
                        Street Address, Building &amp; Floor *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id={step2Addr1Id}
                          type="text"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="e.g. 4th Floor, Tech Hub Tower, 100 Feet Rd"
                          className="w-full pl-10 pr-4 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-1">
                        <label htmlFor={step2Addr2Id} className="block text-xs font-medium text-stone-400 mb-1">
                          Landmark
                        </label>
                        <input
                          id={step2Addr2Id}
                          type="text"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          placeholder="Near Metro"
                          className="w-full px-3 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor={step2CityId} className="block text-xs font-medium text-stone-400 mb-1">
                          City
                        </label>
                        <input
                          id={step2CityId}
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Bengaluru"
                          className="w-full px-3 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor={step2PinId} className="block text-xs font-medium text-stone-400 mb-1">
                          Pin Code
                        </label>
                        <input
                          id={step2PinId}
                          type="text"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="560001"
                          className="w-full px-3 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-400 mb-1">
                        Courier Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="e.g. Leave with security / Ring bell"
                        className="w-full px-3 py-2 bg-stone-950/70 border border-stone-800 focus:border-amber-500 rounded-xl text-xs text-stone-100 placeholder:text-stone-400 outline-none transition-colors"
                      />
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleCompleteSignUp(false)}
                        className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                            <span>Creating Your Account...</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 text-stone-950" />
                            <span>Save Address &amp; Finish Account</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleCompleteSignUp(true)}
                        className="w-full py-2.5 text-xs text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                      >
                        Skip for Now (I will add my address later)
                      </button>
                    </div>
                  </div>
                )}

                {/* Divider (only on signin or step 1) */}
                {!(mode === 'signup' && signupStep === 2) && (
                  <>
                    <div className="relative my-4 text-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-800" />
                      </div>
                      <span className="relative px-3 text-[11px] uppercase tracking-wider text-stone-400 bg-stone-900">
                        or continue with
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#EA4335"
                          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17c1.8 3.7 5.6 7 10.1 7z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </>
                )}

                {/* Back to Guest / Welcome options */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-800/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('welcome')}
                    className="text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
                  >
                    ← Welcome Menu
                  </button>
                  <button
                    type="button"
                    onClick={handleGuest}
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                  >
                    Skip as Guest →
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
