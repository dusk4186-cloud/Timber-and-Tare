import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, RefreshCw, CheckCircle2, X } from 'lucide-react'

type ConnectionStatus = 'online' | 'offline' | 'restored'

export const OfflineAlert: React.FC = () => {
  const [status, setStatus] = useState<ConnectionStatus>(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online'
  })
  const [isDismissed, setIsDismissed] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const handleOffline = () => {
      setIsDismissed(false)
      setStatus('offline')
    }

    const handleOnline = () => {
      setIsDismissed(false)
      setStatus('restored')
      setTimeout(() => {
        setStatus((prev) => (prev === 'restored' ? 'online' : prev))
      }, 3500)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const handleRetry = async () => {
    setIsChecking(true)
    try {
      const response = await fetch('/favicon.png?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
      if (response.ok || response.status < 400) {
        setStatus('restored')
        setTimeout(() => {
          setStatus((prev) => (prev === 'restored' ? 'online' : prev))
        }, 3500)
      } else {
        setStatus(navigator.onLine ? 'online' : 'offline')
      }
    } catch {
      setStatus('offline')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <aside aria-label="Network connection status">
      <AnimatePresence>
        {/* 1. Offline Barista Banner */}
        {status === 'offline' && !isDismissed && (
          <motion.div
            key="barista-offline-banner"
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl shadow-2xl"
            role="alert"
          >
            <div className="error-banner flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/95 border border-amber-500/50 backdrop-blur-xl text-stone-100 shadow-[0_12px_36px_rgba(0,0,0,0.6)]">
              {/* Mascot & Notice Text */}
              <div className="flex items-start gap-3.5">
                {/* Mini Barista Mug Icon with Steam */}
                <div className="relative shrink-0 w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <div className="absolute -top-1.5 flex gap-0.5">
                    {[0, 1].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0, 0.8, 0], y: [-1, -6, -10] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                        className="w-1 h-3 bg-amber-400/60 rounded-full"
                      />
                    ))}
                  </div>
                  <WifiOff className="w-5 h-5 text-amber-400" />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-amber-300">
                      ☕ Barista Notice: Steam Pressure Dropped!
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    You have lost your internet connection. Don't worry — your cart and whole bean selections are safely saved in local storage.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isChecking}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isChecking ? 'Testing...' : 'Check Signal'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
                  aria-label="Dismiss offline banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. Connection Restored Toast */}
        {status === 'restored' && (
          <motion.div
            key="barista-restored-toast"
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md shadow-2xl"
            role="status"
          >
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/95 border border-emerald-500/40 backdrop-blur-xl text-emerald-100 shadow-xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-xs">
                <span className="font-bold text-emerald-300">Grinders Back Online!</span>
                <span className="text-emerald-200/80">Connection restored. Hot bar is ready for live orders.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}
