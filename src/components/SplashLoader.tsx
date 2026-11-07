import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface SplashLoaderProps {
  onComplete: () => void
}

const LOADING_CHARS = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.']

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(20)
  const [statusMessage, setStatusMessage] = useState('Heating brass espresso boilers & loading styles...')
  const completedRef = useRef(false)

  useEffect(() => {
    // If splash was already seen in this session (e.g. repeated reloads or audits), finish immediately
    const alreadyCompleted = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('brewhub-splash-seen')
    if (alreadyCompleted) {
      onComplete()
      return
    }

    const startTime = performance.now()

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true

      try {
        sessionStorage.setItem('brewhub-splash-seen', 'true')
      } catch {
        // Ignore storage exceptions
      }

      setProgress(100)
      setStatusMessage('Timber & Tare Hot Bar is Ready!')

      // Instant 0.35s fadeout as requested by user ("Fade out the instant the page is ready")
      setTimeout(() => {
        onComplete()
      }, 100)
    }

    // Dynamic Readiness Tracking
    let domReady = false
    let fontsReady = false

    const checkAllReady = () => {
      if (domReady && fontsReady) {
        // Enforce a small floor (~600ms) so bouncing text completes 1 wave, ceiling strictly under 1.2s
        const elapsed = performance.now() - startTime
        const delay = Math.max(0, 600 - elapsed)
        setTimeout(finish, delay)
      }
    }

    // 1. DOM Readiness
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      domReady = true
      setProgress((p) => Math.max(p, 50))
      setStatusMessage('Rendering Inter typography & UI layout...')
    } else {
      const handleDom = () => {
        domReady = true
        setProgress((p) => Math.max(p, 50))
        setStatusMessage('Rendering Inter typography & UI layout...')
        checkAllReady()
      }
      document.addEventListener('DOMContentLoaded', handleDom, { once: true })
    }

    // 2. Web Fonts Readiness
    if ('fonts' in document) {
      document.fonts.ready
        .then(() => {
          fontsReady = true
          setProgress((p) => Math.max(p, 85))
          setStatusMessage('Pouring microfoam latte art & signature roasts...')
          checkAllReady()
        })
        .catch(() => {
          fontsReady = true
          checkAllReady()
        })
    } else {
      fontsReady = true
      checkAllReady()
    }

    // 3. Hero image pre-decode (non-blocking)
    const hero = new Image()
    hero.src = '/latte_art_hero.jpg'
    if (hero.decode) {
      hero.decode().catch(() => {})
    }

    // 4. Safety Fallback (Strict 1.2s max ceiling)
    const safetyTimer = setTimeout(() => {
      finish()
    }, 1200)

    return () => {
      completedRef.current = true
      clearTimeout(safetyTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-stone-100 px-6 select-none"
    >
      {/* Background warm radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Animated Coffee Cup Illustration */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />

          {/* Steam vectors */}
          <div className="absolute -top-3 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 0.7, 0], y: [-4, -18, -26] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeOut',
                }}
                className="w-1.5 h-6 bg-gradient-to-t from-amber-400/40 via-amber-200/20 to-transparent rounded-full blur-[0.5px]"
              />
            ))}
          </div>

          {/* Modern Coffee Cup Icon */}
          <svg
            viewBox="0 0 120 100"
            className="w-28 h-24 drop-shadow-[0_8px_24px_rgba(245,158,11,0.2)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cup body outline */}
            <path
              d="M20 28H85C85 64 68 84 52.5 84C37 84 20 64 20 28Z"
              className="stroke-amber-400/90"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Cup rim */}
            <ellipse
              cx="52.5"
              cy="28"
              rx="32.5"
              ry="7"
              className="stroke-amber-400/90"
              strokeWidth="4"
            />
            {/* Liquid inside with warm fill */}
            <path
              d="M24 38C24 38 36 43 52.5 43C69 43 81 38 81 38C81 60 67 76 52.5 76C38 76 24 60 24 38Z"
              className="fill-amber-600/50"
            />
            <path
              d="M24 38C34 41 42 37 52.5 39C63 41 71 37 81 38"
              className="stroke-amber-300/80"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Handle */}
            <path
              d="M85 36C96 36 103 44 103 54C103 64 94 70 80 68"
              className="stroke-amber-400/90"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bouncing "Loading..." text characters */}
        <div className="flex items-center justify-center gap-[3px] mb-4 h-9" aria-live="polite">
          {LOADING_CHARS.map((char, index) => (
            <motion.span
              key={index}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.05,
                ease: 'easeInOut',
              }}
              className="text-lg font-bold tracking-wider text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Progress Bar Container */}
        <div className="w-full max-w-[260px] h-2 bg-stone-900/90 rounded-full border border-stone-800/80 p-0.5 overflow-hidden shadow-inner mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            initial={{ width: '20%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Percentage & Dynamic Asset Status Subtext */}
        <div className="flex items-center justify-between w-full max-w-[260px] text-[11px] text-stone-400 font-mono mb-2">
          <span className="truncate pr-2 text-stone-300">{statusMessage}</span>
          <span className="text-amber-400 font-bold shrink-0">{Math.round(progress)}%</span>
        </div>

        {/* Skip button for snappy development or immediate entry */}
        <button
          type="button"
          onClick={() => {
            completedRef.current = true
            try {
              sessionStorage.setItem('brewhub-splash-seen', 'true')
            } catch {}
            onComplete()
          }}
          className="mt-6 text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-stone-900/50 focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Skip to Cafe</span>
        </button>
      </div>
    </motion.div>
  )
}
