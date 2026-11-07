import { useState } from 'react'
import type { HeaderProps, NavSection } from '../types'
import { ShoppingBag, Menu, X, User, LogOut, Sun, Moon, Gift } from 'lucide-react'
import { CustomLogo } from './CustomLogo'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS: Array<{ id: NavSection; label: string }> = [
  { id: 'origins', label: 'Origins & Sourcing' },
  { id: 'brew-guides', label: 'Brew Guides' },
  { id: 'rewards', label: 'Tare Rewards' },
  { id: 'subscription', label: 'Coffee Pass' },
]

export function Header({
  cartCount,
  onCartOpen,
  onNavClick,
  activeSection,
  currentUser,
  onOpenAuth,
  onSignOut,
  theme = 'dark',
  onToggleTheme,
  rewardPoints = 0,
}: HeaderProps & { rewardPoints?: number }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleNavClick = (section: NavSection) => {
    onNavClick(section)
    setMobileOpen(false)
  }

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(' ')
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase()
      return name.slice(0, 2).toUpperCase()
    }
    if (email) return email.slice(0, 2).toUpperCase()
    return 'BH'
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-stone-950/90 border-b border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand with Custom Artisanal Logo */}
        <a 
          href="#" 
          className="shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
         
        >
          <CustomLogo />
        </a>

        {/* Desktop Nav - Ample Breathing Room with Gliding Active & Hover Underlines */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id

            return (
              <div key={item.id} className="relative py-2">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative px-1 py-1.5 text-sm font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md ${
                    isActive
                      ? 'text-amber-400 font-semibold'
                      : 'text-stone-300 hover:text-amber-300'
                  }`}
                >
                  {item.label}

                  {/* Active Section Underline: Gliding Amber Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.7)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover Underline: Instant scale-x expansion */}
                  {!isActive && (
                    <span 
                      aria-hidden="true" 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400/85 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    />
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Right Actions: Bean Bank Pill, Theme Toggle, Auth, Cart, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Tare Rewards Bean Bank Pill */}
          <button
            type="button"
            onClick={() => handleNavClick('rewards')}
            title="View Tare Rewards & Bean Bank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-all text-xs font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 shadow-sm"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-white font-black">{rewardPoints}</span>
            <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Beans</span>
          </button>

          {/* Theme Toggle (Dark Espresso / Light Oat Cream) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? 'Switch to Dark Espresso Theme' : 'Switch to Light Oat Cream Theme'}
              title={theme === 'light' ? 'Switch to Dark Espresso Theme' : 'Switch to Light Oat Cream Theme'}
              className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-amber-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* User Profile / Auth Button */}
          <div className="relative">
            {currentUser && !currentUser.isAnonymous ? (
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/50 text-stone-200 transition-colors cursor-pointer"
                aria-label="User Account Menu"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center">
                    {getInitials(currentUser.displayName, currentUser.email)}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'Friend'}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="hidden sm:inline px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/60 text-stone-300 hover:text-amber-400 text-xs font-semibold transition-colors cursor-pointer"
                aria-label="Sign In or Create Account"
              >
                <User className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* User Dropdown */}
            <AnimatePresence>
              {userDropdownOpen && currentUser && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-2 w-48 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl py-2 z-50 text-xs"
                >
                  <div className="px-4 py-2 border-b border-stone-800">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white truncate">{currentUser.displayName || 'Coffee Friend'}</p>
                      {currentUser.role === 'admin' && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold uppercase tracking-wider">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 truncate">{currentUser.email || 'Member'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      onOpenAuth?.()
                    }}
                    className="w-full text-left px-4 py-2 text-stone-300 hover:text-white hover:bg-stone-800/60 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      onSignOut?.()
                    }}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-stone-800/60 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            aria-label={`View Cart, ${cartCount} drinks`}
            onClick={onCartOpen}
            className="relative p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 hover:text-white hover:border-stone-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-amber-500 text-stone-950 text-micro font-bold flex items-center justify-center shadow-lg"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-stone-950 border-t border-stone-800 px-6 py-6 flex flex-col gap-3 overflow-hidden shadow-2xl"
          >
            {/* Mobile Theme Toggle */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800/80">
              <span className="text-xs font-semibold text-stone-400">Appearance</span>
              <div className="flex items-center gap-2">
                {onToggleTheme && (
                  <button
                    type="button"
                    onClick={onToggleTheme}
                    className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  </button>
                )}
              </div>
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`text-left py-2.5 px-3 rounded-lg border-l-2 transition-all font-medium flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'border-amber-400 bg-amber-500/10 text-amber-400 font-semibold'
                      : 'border-transparent text-stone-200 hover:text-amber-400 hover:border-amber-400/50'
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  )}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
