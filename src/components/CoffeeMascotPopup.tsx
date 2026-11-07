import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, LogIn, MessageCircle } from 'lucide-react'
import { trackEvent } from '../lib/analytics'

interface CoffeeMascotPopupProps {
  isGuest: boolean
  isOpen: boolean
  onClose: () => void
  onOpenAuth: (mode: 'signin' | 'signup') => void
}

export const CoffeeMascotPopup: React.FC<CoffeeMascotPopupProps> = ({
  isGuest,
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  // Track event when popup opens on adding order
  useEffect(() => {
    if (isOpen) {
      trackEvent('auth_welcome_viewed', { trigger: 'add_to_order_guest_prompt' })
    }
  }, [isOpen])

  const handleDismiss = () => {
    onClose()
  }

  const handleAuthAction = (mode: 'signin' | 'signup') => {
    onClose()
    onOpenAuth(mode)
  }

  return (
    <>
      {/* 1. Centered Mascot Dialog (Triggered ONLY when Guest Adds to Order) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative max-w-md w-full bg-stone-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
            >
              {/* Warm Ambient Glow */}
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Dismiss button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close popup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Mascot Animated Illustration */}
              <div className="relative w-28 h-28 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
                
                {/* Steam Wisps */}
                <div className="absolute -top-1 flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 0.7, 0], y: [-2, -14, -20] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: 'easeOut',
                      }}
                      className="w-1 h-5 bg-gradient-to-t from-amber-400/50 to-transparent rounded-full"
                    />
                  ))}
                </div>

                {/* Cute Mascot Coffee Cup Vector Character */}
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-[0_4px_16px_rgba(245,158,11,0.3)]">
                    {/* Cup Body */}
                    <path
                      d="M18 28H82C82 64 68 84 50 84C32 84 18 64 18 28Z"
                      className="fill-amber-500 stroke-amber-400"
                      strokeWidth="3.5"
                    />
                    {/* Cup Handle */}
                    <path
                      d="M82 38C94 38 100 46 100 56C100 66 90 72 78 70"
                      className="stroke-amber-400 fill-none"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Coffee Surface Cream */}
                    <ellipse cx="50" cy="28" rx="32" ry="7" className="fill-amber-100 stroke-amber-300" strokeWidth="2" />
                    {/* Latte Art Heart */}
                    <path
                      d="M50 29C46 25 41 28 44 32L50 35L56 32C59 28 54 25 50 29Z"
                      className="fill-amber-800"
                    />

                    {/* Happy Blinking Eyes */}
                    <circle cx="38" cy="50" r="3.5" className="fill-stone-950" />
                    <circle cx="62" cy="50" r="3.5" className="fill-stone-950" />
                    <circle cx="39.5" cy="48.5" r="1.2" className="fill-white" />
                    <circle cx="63.5" cy="48.5" r="1.2" className="fill-white" />

                    {/* Rosy Cheeks */}
                    <circle cx="33" cy="56" r="2.5" className="fill-amber-700/60" />
                    <circle cx="67" cy="56" r="2.5" className="fill-amber-700/60" />

                    {/* Happy Smile */}
                    <path
                      d="M45 56C47 60 53 60 55 56"
                      className="stroke-stone-950"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Little Barista Bowtie */}
                    <path
                      d="M44 77L50 80L44 83Z"
                      className="fill-stone-900"
                    />
                    <path
                      d="M56 77L50 80L56 83Z"
                      className="fill-stone-900"
                    />
                    <circle cx="50" cy="80" r="2" className="fill-stone-900" />
                  </svg>
                </motion.div>
              </div>

              {/* Mascot Name Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-micro font-bold tracking-wider">
                  BARISTA BREWIE SAYS HELLO!
                </span>
              </div>

              {/* Title & Speech Bubble */}
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                Skip the Waiting Line!
              </h3>

              {/* Enhanced message requested by user */}
              <div className="my-4 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-200 text-xs sm:text-sm leading-relaxed text-center shadow-inner relative">
                <p>
                  &ldquo;It would be delightful if you could sign in or create an account! That way, we can save your delivery address and craft your coffee without any waiting.&rdquo;
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleAuthAction('signup')}
                  className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-950/50 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Create Account with Saved Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAuthAction('signin')}
                  className="w-full py-3 px-6 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Already Have an Account? Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full py-2 text-xs text-stone-400 hover:text-stone-300 transition-colors cursor-pointer"
                >
                  Continue Adding as Guest
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Floating Companion Mascot Widget (Corner Bot ready for v2) */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <div className="relative">
          {/* Mascot Bubble Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-16 right-0 w-64 p-3 rounded-2xl bg-stone-900 border border-amber-500/40 text-stone-200 shadow-2xl text-xs z-50 backdrop-blur-md"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Barista Brewie</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(false)
                    }}
                    className="text-stone-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  {isGuest
                    ? 'Delighted to have you! Sign in to save your address for express 1-click orders.'
                    : 'Need drink recommendations or extraction tips? In-site AI Chatbot coming in v2!'}
                </p>
                {isGuest && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowTooltip(false)
                      onOpenAuth('signin')
                    }}
                    className="mt-2 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline block cursor-pointer"
                  >
                    Sign In or Create Account →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Mascot Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="Barista Brewie Chatbot Companion"
            className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 p-2 shadow-xl shadow-amber-950/60 border-2 border-amber-300/60 flex items-center justify-center relative cursor-pointer group"
          >
            {/* Cute Mini Mascot Face */}
            <svg viewBox="0 0 100 100" className="w-9 h-9" fill="none">
              <path
                d="M20 30H80C80 62 66 82 50 82C34 82 20 62 20 30Z"
                className="fill-stone-950 stroke-amber-200"
                strokeWidth="4"
              />
              <ellipse cx="50" cy="30" rx="30" ry="8" className="fill-amber-100" />
              {/* Eyes */}
              <circle cx="39" cy="50" r="4" className="fill-white" />
              <circle cx="61" cy="50" r="4" className="fill-white" />
              <circle cx="40" cy="50" r="2" className="fill-stone-950" />
              <circle cx="62" cy="50" r="2" className="fill-stone-950" />
              {/* Smile */}
              <path
                d="M45 60C47 64 53 64 55 60"
                className="stroke-amber-400"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            {/* Notification Badge / Speech Indicator */}
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-stone-950 flex items-center justify-center text-[10px] text-stone-950 font-bold">
              <MessageCircle className="w-3 h-3 text-stone-950" />
            </span>
          </motion.button>
        </div>
      </div>
    </>
  )
}
