import React, { useState, useEffect } from 'react'
import { Cookie, Check } from 'lucide-react'
import { trackEvent } from '../lib/analytics'

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('brewhub_cookie_consent')
      if (!consent) {
        // Show after 1.5s
        const timer = setTimeout(() => setIsVisible(true), 1500)
        return () => clearTimeout(timer)
      }
    } catch {
      // LocalStorage access fail
    }
  }, [])

  const handleAccept = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem('brewhub_cookie_consent', choice)
    } catch {
      // Ignore
    }
    trackEvent('cookie_consent', { choice })
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:max-w-md sm:right-auto z-40 bg-stone-900/95 border border-stone-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-white block mb-0.5">Coffee &amp; Cookies</span>
          <p className="text-stone-300 leading-relaxed text-[11px]">
            We use essential local storage to remember your customized drink choices and cafe cart.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3.5 pt-3 border-t border-stone-800/80 justify-end">
        <button
          type="button"
          onClick={() => handleAccept('essential')}
          className="text-[11px] font-semibold text-stone-400 hover:text-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => handleAccept('all')}
          className="btn-primary text-[11px] font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5 text-stone-950 font-bold" />
          <span>Accept</span>
        </button>
      </div>
    </div>
  )
}
