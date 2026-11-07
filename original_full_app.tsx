import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coffee, 
  Sparkles, 
  Flame, 
  Compass, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import confetti from 'canvas-confetti'

interface BrewItem {
  id: string
  name: string
  origin: string
  notes: string[]
  price: string
  roast: 'Light' | 'Medium' | 'Dark'
  rating: number
}

const FEATURED_BREWS: BrewItem[] = [
  {
    id: 'ethiopian-yirgacheffe',
    name: 'Ethiopian Yirgacheffe G1',
    origin: 'Kochere, 2100m',
    notes: ['Bergamot', 'Jasmine', 'Wild Honey'],
    price: '$18.50',
    roast: 'Light',
    rating: 4.9,
  },
  {
    id: 'colombian-geisha',
    name: 'Huila Micro-Lot Geisha',
    origin: 'Pitalito, 1850m',
    notes: ['Peach Blossom', 'Lemongrass', 'Cane Sugar'],
    price: '$24.00',
    roast: 'Light',
    rating: 5.0,
  },
  {
    id: 'sumatra-mandheling',
    name: 'Sumatra Blue Batak',
    origin: 'Lake Toba, 1600m',
    notes: ['Cedar Wood', 'Dark Chocolate', 'Earth'],
    price: '$16.50',
    roast: 'Dark',
    rating: 4.8,
  },
]

export default function App() {
  const [selectedBrew, setSelectedBrew] = useState<string | null>(null)
  const [cartCount, setCartCount] = useState<number>(0)
  const [showToast, setShowToast] = useState<string | null>(null)

  const handleOrder = (name: string) => {
    setCartCount(prev => prev + 1)
    setShowToast(`Added ${name} to your tasting box`)
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#f59e0b', '#d97706', '#fbbf24', '#78350f']
    })
    setTimeout(() => setShowToast(null), 3000)
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-stone-900 border border-amber-500/40 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-body font-medium text-stone-200">{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Navigation */}
      <header className="border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-title tracking-tight text-white font-bold block leading-none">BrewHub</span>
              <span className="text-micro text-amber-400 tracking-wider font-semibold block mt-1">SPECIALTY ROASTERS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#roasts" className="text-body text-stone-300 hover:text-amber-400 transition-colors">Origins & Blends</a>
            <a href="#methods" className="text-body text-stone-300 hover:text-amber-400 transition-colors">Brew Guides</a>
            <a href="#subscription" className="text-body text-stone-300 hover:text-amber-400 transition-colors">Club Subscription</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              className="relative p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-micro font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="btn-primary">
              <Sparkles className="w-4 h-4" />
              <span>Explore Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6">
              <Flame className="w-4 h-4" />
              <span className="text-micro font-semibold tracking-wider">FRESH SMALL-BATCH ROASTS</span>
            </div>
            
            <h1 className="text-title text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Exceptional single-origin coffee, crafted for the curious.
            </h1>
            
            <p className="text-body text-stone-400 text-base leading-relaxed mb-8 max-w-lg">
              Direct-trade beans roasted in micro-batches with meticulous vertical profiling. Experience nuanced acidity, vibrant florality, and velvety richness.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#featured" className="btn-primary py-3 px-6 text-base font-semibold">
                Taste Micro-Lots
                <ArrowRight className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 transition-all font-medium text-sm">
                <Compass className="w-4 h-4 text-amber-400" />
                Find Your Profile
              </button>
            </div>
          </motion.div>

          {/* Hero Feature Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-900/40 border border-stone-800 relative shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between pb-6 border-b border-stone-800">
              <div>
                <span className="text-micro text-amber-400 font-semibold tracking-wider block">CURRENT HARVEST SPOTLIGHT</span>
                <h3 className="text-heading text-white font-bold mt-1">Geisha Floral Symphony</h3>
              </div>
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-micro font-bold">5.0</span>
              </div>
            </div>

            <div className="py-6 space-y-4">
              <div className="flex justify-between items-center text-body">
                <span className="text-stone-400">Elevation:</span>
                <span className="text-stone-200 font-medium">1,850m ASL</span>
              </div>
              <div className="flex justify-between items-center text-body">
                <span className="text-stone-400">Processing:</span>
                <span className="text-stone-200 font-medium">Anaerobic Natural (72h)</span>
              </div>
              <div className="flex justify-between items-center text-body">
                <span className="text-stone-400">Flavor Profile:</span>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-micro text-stone-300">Bergamot</span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-micro text-stone-300">Peach</span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-micro text-stone-300">Honey</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleOrder('Geisha Floral Symphony')}
              className="w-full btn-primary py-3 justify-center"
            >
              Order Sample Bag — $24.00
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Micro-lots */}
      <section id="featured" className="py-16 bg-stone-900/40 border-t border-stone-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-micro text-amber-400 font-semibold tracking-wider block mb-2">CURATED ROASTER SELECTION</span>
              <h2 className="text-title text-3xl font-bold text-white tracking-tight">Direct Origin Offerings</h2>
            </div>
            <p className="text-body text-stone-400 mt-2 sm:mt-0 max-w-sm">
              Each lot is cupped weekly and roasted within 48 hours of dispatch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_BREWS.map((item) => (
              <div 
                key={item.id}
                className="group p-6 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-micro px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700/60 font-semibold">
                      {item.roast} Roast
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-micro font-bold">{item.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-subheading text-white font-semibold group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-micro text-stone-400 mt-1 mb-4">{item.origin}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.notes.map((note) => (
                      <span key={note} className="text-micro px-2 py-1 rounded bg-stone-800/80 text-stone-300">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-heading text-white font-bold">{item.price}</span>
                  <button 
                    onClick={() => handleOrder(item.name)}
                    className="btn-primary py-2 px-3.5 text-xs font-semibold"
                  >
                    Add to Box
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span className="text-label text-stone-400 text-sm">© 2026 BrewHub Roasters. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-stone-400">
            <span className="text-micro text-stone-500">POWERED BY VITE + REACT + TAILWIND CSS</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
