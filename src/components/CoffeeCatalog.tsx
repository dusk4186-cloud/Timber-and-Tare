import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Sparkles,
  Clock,
  Star,
  Plus,
  ArrowRight,
  Search,
  Check,
  Leaf,
  Flame,
  Utensils,
  Coffee,
  X,
  SlidersHorizontal,
  Package,
} from 'lucide-react'
import type { BrewItem, CatalogProps, DrinkCategory } from '../types'
import { trackEvent } from '../lib/analytics'

export const CoffeeCatalog: React.FC<CatalogProps> = ({
  items,
  activeFilter,
  selectedBrewMethod,
  onFilterChange,
  onClearBrewMethod,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [addingItemId, setAddingItemId] = useState<string | null>(null)
  const [justAddedItemId, setJustAddedItemId] = useState<string | null>(null)
  const [activeMenuType, setActiveMenuType] = useState<'all' | 'beverage' | 'food' | 'beans'>('all')

  // Dynamic Item Counts
  const beverageCount = useMemo(() => items.filter((i) => i.itemType === 'beverage').length, [items])
  const foodCount = useMemo(() => items.filter((i) => i.itemType === 'food').length, [items])
  const beansCount = useMemo(() => items.filter((i) => i.itemType === 'beans').length, [items])
  // Full Menu count only includes cafe & kitchen items (28), excluding whole bean packets
  const fullMenuCount = beverageCount + foodCount

  // Master Section Tabs
  const masterTabs = [
    { id: 'all' as const, label: 'Full Menu', count: fullMenuCount, icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'beverage' as const, label: 'Beverages', count: beverageCount, icon: <Coffee className="w-3.5 h-3.5" /> },
    { id: 'food' as const, label: 'Bakery & Food', count: foodCount, icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'beans' as const, label: 'Whole Bean Bags', count: beansCount, icon: <Package className="w-3.5 h-3.5" /> },
  ]

  // Subcategories tailored by activeMenuType
  const allSubcategories: { key: DrinkCategory; label: string; desc: string; icon: string; count: number }[] = [
    { key: 'All', label: 'All Items', desc: 'Full Cafe & Kitchen', icon: '✨', count: fullMenuCount },
    { key: 'Coffee', label: 'Coffee Bar', desc: 'Espresso, V60, Cold Brew', icon: '☕', count: items.filter((i) => i.itemType === 'beverage' && i.category === 'Coffee').length },
    { key: 'Non-Coffee', label: 'Teas & Drinks', desc: 'Matcha, Cacao, Smoothies', icon: '🍵', count: items.filter((i) => i.itemType === 'beverage' && i.category === 'Non-Coffee').length },
    { key: 'Pastries', label: 'Bakery', desc: 'Croissants, Muffins, Scones', icon: '🥐', count: items.filter((i) => i.itemType === 'food' && i.category === 'Pastries').length },
    { key: 'Light Bites', label: 'Light Bites', desc: 'Toasts, Bagels, Sandwiches', icon: '🥪', count: items.filter((i) => i.itemType === 'food' && i.category === 'Light Bites').length },
    { key: 'Hearty Meals', label: 'Brunch Meals', desc: 'Benedicts, Burritos, Paninis', icon: '🍳', count: items.filter((i) => i.itemType === 'food' && i.category === 'Hearty Meals').length },
  ]

  const beverageSubcategories = [
    { key: 'All' as DrinkCategory, label: 'All Drinks', desc: 'Full Beverage Menu', icon: '✨', count: beverageCount },
    { key: 'Coffee' as DrinkCategory, label: 'Coffee Bar', desc: 'Espresso, V60, Cold Brew', icon: '☕', count: items.filter((i) => i.itemType === 'beverage' && i.category === 'Coffee').length },
    { key: 'Non-Coffee' as DrinkCategory, label: 'Teas & Drinks', desc: 'Matcha, Cacao, Smoothies', icon: '🍵', count: items.filter((i) => i.itemType === 'beverage' && i.category === 'Non-Coffee').length },
  ]

  const foodSubcategories = [
    { key: 'All' as DrinkCategory, label: 'All Bakery & Food', desc: 'Complete Kitchen Menu', icon: '✨', count: foodCount },
    { key: 'Pastries' as DrinkCategory, label: 'Bakery', desc: 'Croissants, Muffins, Scones', icon: '🥐', count: items.filter((i) => i.itemType === 'food' && i.category === 'Pastries').length },
    { key: 'Light Bites' as DrinkCategory, label: 'Light Bites', desc: 'Toasts, Bagels, Sandwiches', icon: '🥪', count: items.filter((i) => i.itemType === 'food' && i.category === 'Light Bites').length },
    { key: 'Hearty Meals' as DrinkCategory, label: 'Brunch Meals', desc: 'Benedicts, Burritos, Paninis', icon: '🍳', count: items.filter((i) => i.itemType === 'food' && i.category === 'Hearty Meals').length },
  ]

  const activeSubcategoryList = useMemo(() => {
    if (activeMenuType === 'beverage') return beverageSubcategories
    if (activeMenuType === 'food') return foodSubcategories
    return allSubcategories
  }, [activeMenuType, beverageCount, foodCount, fullMenuCount, items])

  const handleMasterTabClick = (tabId: 'all' | 'beverage' | 'food' | 'beans') => {
    setActiveMenuType(tabId)
    onFilterChange('All')
    trackEvent('filter_category', { menuType: tabId })
  }

  const handleCategoryClick = (cat: DrinkCategory) => {
    onFilterChange(cat)
    trackEvent('filter_category', { category: cat })
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // 1. Menu Type filter
      if (selectedBrewMethod) {
        // When a specific brew method is chosen from Brew Guides, show all matching drinks & beans
      } else if (activeMenuType === 'all') {
        // Exclude whole bean retail bags from the "All Items" cafe menu
        if (item.itemType === 'beans') return false
      } else if (item.itemType !== activeMenuType) {
        return false
      }

      // 2. Category filter
      let matchesCategory = false
      if (selectedBrewMethod !== null || activeFilter === 'All') {
        matchesCategory = true
      } else if (activeFilter === 'Coffee') {
        matchesCategory =
          item.category === 'Coffee' ||
          item.category === 'Espresso' ||
          item.category === 'Cold Brew' ||
          item.category === 'Pour Over' ||
          item.category === 'Signature'
      } else {
        matchesCategory = item.category === activeFilter
      }

      // 3. Search query
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.origin.toLowerCase().includes(query) ||
        item.notes.some((n) => n.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)

      // 4. Brew method filter (e.g. from Brew Guides)
      const matchesBrewMethod =
        !selectedBrewMethod ||
        (item.brewMethods && item.brewMethods.includes(selectedBrewMethod))

      return matchesCategory && matchesSearch && matchesBrewMethod
    })
  }, [items, selectedBrewMethod, activeMenuType, activeFilter, searchQuery])

  const getCategoryBadgeColor = (cat: BrewItem['category']) => {
    switch (cat) {
      case 'Coffee':
      case 'Espresso':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
      case 'Non-Coffee':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      case 'Pastries':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
      case 'Light Bites':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
      case 'Hearty Meals':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30'
      case 'Whole Beans':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/40'
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700'
    }
  }

  const handleBaristaOrder = (item: BrewItem) => {
    if (addingItemId) return
    setAddingItemId(item.id)
    trackEvent('add_to_cart', { id: item.id, name: item.name, price: item.price })

    // Tactile barista feedback delay
    setTimeout(() => {
      onAddToCart(item)
      setAddingItemId(null)
      setJustAddedItemId(item.id)
      setTimeout(() => {
        setJustAddedItemId(null)
      }, 1500)
    }, 450)
  }

  return (
    <section id="menu" className="py-20 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-micro font-semibold uppercase tracking-wider">CAFE &amp; ROASTERY MENU</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Artisanal Coffee, Drinks, Bakery &amp; Beans
            </h2>
            <p className="text-body text-stone-300 mt-2 max-w-xl">
              Freshly pulled double espressos, ceremonial matcha, flaky French pastries, sourdough avocado tartines, and freshly roasted whole bean bags.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#brew-guides"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors py-2 px-3 rounded-xl bg-stone-900 border border-stone-800 group"
            >
              <span>Barista Methods</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Master Section Toggle with Smooth Spring Sliding Indicator */}
        <LayoutGroup id="master-menu-tabs">
          <div className="flex items-center justify-center mb-6">
            <div className="p-1.5 rounded-2xl bg-stone-900/90 border border-stone-800 flex items-center gap-1 shadow-inner relative flex-wrap sm:flex-nowrap justify-center">
              {masterTabs.map((tab) => {
                const isSelected = activeMenuType === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleMasterTabClick(tab.id)}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer select-none ${
                      isSelected ? 'text-stone-950 font-extrabold' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeMasterTabPill"
                        className="absolute inset-0 bg-amber-500 rounded-xl shadow-md z-0"
                        transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.8 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {tab.icon}
                      <span>
                        {tab.label} ({tab.count})
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </LayoutGroup>

        {/* Live Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto sm:mx-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                trackEvent('search_drinks', { query: e.target.value })
              }}
              placeholder={
                activeMenuType === 'beans'
                  ? 'Search roasted origins, washed, natural, altitude...'
                  : activeMenuType === 'food'
                  ? 'Search croissants, avocado toast, benedicts...'
                  : activeMenuType === 'beverage'
                  ? 'Search cortado, matcha, flat white, cold brew...'
                  : 'Search coffee, matcha, croissants, avocado toast...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-stone-900/90 border border-stone-800 focus:border-amber-500/70 rounded-xl text-xs sm:text-sm text-stone-100 placeholder:text-stone-400 outline-none transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Subcategory Chips Bar with Spring Sliding Indicator */}
          {activeMenuType !== 'beans' && (
            <LayoutGroup id="subcategory-menu-tabs">
              <div className="p-2 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md">
                <div
                  role="group"
                  aria-label="Filter menu items by category"
                  className={`grid gap-2 ${
                    activeSubcategoryList.length <= 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : activeSubcategoryList.length <= 4
                      ? 'grid-cols-2 sm:grid-cols-4'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                  }`}
                >
                  {activeSubcategoryList.map(({ key, label, desc, icon, count }) => {
                    const isSelected = activeFilter === key
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleCategoryClick(key)}
                        className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl transition-colors text-center cursor-pointer overflow-hidden border ${
                          isSelected
                            ? 'border-amber-400 text-stone-950 font-extrabold'
                            : 'bg-stone-950/60 text-stone-300 hover:text-white hover:bg-stone-800/80 border-stone-800/80'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeSubcategoryPill"
                            className="absolute inset-0 bg-amber-500 rounded-xl shadow-md z-0"
                            transition={{ type: 'spring', stiffness: 420, damping: 30, mass: 0.8 }}
                          />
                        )}
                        <span className="relative z-10 text-sm mb-0.5">{icon}</span>
                        <span
                          className={`relative z-10 text-xs font-bold tracking-wide ${
                            isSelected ? 'text-stone-950 font-extrabold' : 'text-stone-200'
                          }`}
                        >
                          {label} ({count})
                        </span>
                        <span
                          className={`relative z-10 text-[10px] mt-0.5 truncate max-w-full ${
                            isSelected ? 'text-stone-950/90 font-semibold' : 'text-stone-400'
                          }`}
                        >
                          {desc}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </LayoutGroup>
          )}

          {/* Whole Beans Roastery Info Banner (shown when Beans tab active) */}
          {activeMenuType === 'beans' && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Whole Bean Roastery Reserve</h3>
                  <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                    Micro-batch specialty lots roasted in Bengaluru. Shipped in one-way degassing valve bags with roast date stamped.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 font-bold shrink-0">
                5 Fresh Roasts Available
              </span>
            </div>
          )}
        </div>

        {/* Active Brew Method Filter Badge Bar */}
        {selectedBrewMethod && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-amber-950/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Tailored Method Filter
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-stone-950">
                    {selectedBrewMethod}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Showing coffees &amp; freshly roasted beans specifically tailored for {selectedBrewMethod} extraction.
                </p>
              </div>
            </div>
            {onClearBrewMethod && (
              <button
                type="button"
                onClick={onClearBrewMethod}
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 hover:border-amber-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <X className="w-3.5 h-3.5 text-stone-400" />
                <span>Show All Coffees</span>
              </button>
            )}
          </div>
        )}

        {/* Grid of Items */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-16 text-center card-surface p-12 max-w-md mx-auto"
            >
              <div className="w-14 h-14 rounded-2xl bg-stone-800 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-stone-700 text-2xl">
                🍽️
              </div>
              <h3 className="text-xl font-bold text-white">
                No items match &quot;{searchQuery}&quot;
              </h3>
              <p className="text-body text-stone-400 mt-2 text-xs">
                Try clearing your search query or switching categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  onFilterChange('All')
                  setActiveMenuType('all')
                }}
                className="btn-primary mt-6 py-2.5 px-6 font-semibold text-xs cursor-pointer"
              >
                Show Full Menu
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeFilter}-${searchQuery}-${activeMenuType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((item: BrewItem, index) => {
                const isAdding = addingItemId === item.id
                const isJustAdded = justAddedItemId === item.id
                const actionLabel =
                  item.itemType === 'food'
                    ? 'Add to Order'
                    : item.itemType === 'beans'
                    ? 'Order Beans'
                    : 'Order Drink'

                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
                    className="card-surface p-0 overflow-hidden flex flex-col justify-between relative group hover:border-amber-500/50 transition-all rounded-3xl bg-stone-900 border border-stone-800 shadow-xl"
                  >
                    {/* Photo Header with Visual Reference */}
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-950">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/spanish_honey_cortado.jpg'
                        }}
                        className="w-full h-full object-cover object-center filter brightness-[0.96] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-black/20 pointer-events-none" />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span
                          className={`text-micro px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider backdrop-blur-md ${getCategoryBadgeColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {item.isVegan && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                              <Leaf className="w-2.5 h-2.5" />
                              <span>VEGAN</span>
                            </span>
                          )}
                          {item.isGlutenFree && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-500/40 backdrop-blur-md">
                              <Flame className="w-2.5 h-2.5" />
                              <span>GF</span>
                            </span>
                          )}
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-950/80 border border-stone-800 text-amber-400 backdrop-blur-md">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-micro font-bold">{item.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Calories / Prep Time Tag */}
                      <div className="absolute bottom-2 left-3 flex items-center gap-2 text-[11px] text-stone-300 font-medium">
                        <span className="flex items-center gap-1 bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800 backdrop-blur-sm">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{item.prepTime}</span>
                        </span>
                        {item.calories && (
                          <span className="bg-stone-950/80 px-2 py-0.5 rounded-md border border-stone-800 backdrop-blur-sm text-stone-400">
                            {item.calories}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                          {item.origin}
                        </p>
                        <p className="text-xs text-stone-300 leading-relaxed mt-2 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Ingredient & Flavor Notes */}
                        <div className="flex flex-wrap gap-1.5 mt-3.5">
                          {item.notes.map((note) => (
                            <span
                              key={note}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        {/* Brew Methods Tailored Tag */}
                        {item.brewMethods && item.brewMethods.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2.5">
                            <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                              Tailored for:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {item.brewMethods.map((m) => (
                                <span
                                  key={m}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    selectedBrewMethod === m
                                      ? 'bg-amber-400 text-stone-950 shadow-sm'
                                      : 'bg-stone-800/90 text-amber-400/90 border border-amber-500/20'
                                  }`}
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Price & Tactile Action */}
                      <div className="pt-5 border-t border-stone-800/80 mt-5 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-micro text-stone-400">PRICE</span>
                          <span className="text-xl font-extrabold text-white">
                            ₹{item.price}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isAdding}
                          onClick={() => handleBaristaOrder(item)}
                          className={`btn-primary py-2.5 px-4 font-semibold text-xs group/btn cursor-pointer transition-all flex items-center gap-2 ${
                            isJustAdded
                              ? '!bg-emerald-500 !text-stone-950 !border-emerald-400 shadow-emerald-900/40'
                              : ''
                          }`}
                          aria-label={`${actionLabel}: ${item.name}`}
                        >
                          {isAdding ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                              <span>Adding...</span>
                            </>
                          ) : isJustAdded ? (
                            <>
                              <Check className="w-4 h-4 text-stone-950 font-bold" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-stone-950 group-hover/btn:rotate-90 transition-transform" />
                              <span>{actionLabel}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
