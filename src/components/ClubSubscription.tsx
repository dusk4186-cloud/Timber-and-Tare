import { useState } from 'react'
import { Check, Sparkles, Shield, Gift, ArrowRight, AlertCircle } from 'lucide-react'
import type { ClubSubscriptionProps } from '../types'
import { motion } from 'framer-motion'

export function ClubSubscription({
  plans,
  selectedTier,
  preferredDrinkStyle,
  billingCycle,
  email,
  onTierSelect,
  onStyleChange,
  onCycleChange,
  onEmailChange,
  onSubscribe,
}: ClubSubscriptionProps) {
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleSubscribeClick = () => {
    if (!selectedTier) {
      setEmailError('Please select a Coffee Club pass first.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError(null)
    onSubscribe()
  }

  const drinkStyles = [
    'Velvety Flat Whites & Lattes',
    'Nitro & Kyoto Cold Brews',
    'Single-Origin V60 Drips',
    'Surprise Barista Picks',
  ]

  return (
    <section id="subscription" className="scroll-mt-20 py-20 bg-stone-900/40 border-t border-stone-800/80" aria-label="BrewHub Coffee Club Pass">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span className="text-micro font-semibold">DAILY COFFEE PASS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Never Wait In Line For Your Daily Brew
          </h2>
          <p className="text-body text-stone-300 mt-3 text-base">
            Subscribe to a monthly coffee pass. Walk in, grab your freshly pulled drink from the express counter, or get it delivered daily.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const isSelected = selectedTier === plan.tier
            const isPopular = plan.tier === 'Daily Ritual'

            return (
              <motion.article
                key={plan.tier}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onTierSelect(plan.tier)}
                className={`card-surface p-8 flex flex-col justify-between relative cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 transition-all ${
                  isSelected
                    ? 'ring-2 ring-amber-400 border-amber-500 shadow-2xl bg-stone-900'
                    : isPopular
                    ? 'border-amber-500/40'
                    : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-micro font-extrabold shadow-md tracking-wider">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-micro text-amber-400 font-bold tracking-widest">
                      {plan.tier.toUpperCase()}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {plan.drinkAllowance}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-white">₹{plan.pricePerMonth.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-stone-400 font-medium">/month</span>
                  </div>

                  {/* Perks list */}
                  <ul className="space-y-3 pb-6 border-b border-stone-800/80" aria-label={`Perks included in ${plan.tier}`}>
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2.5 text-xs text-stone-200 font-medium leading-relaxed">
                        <div className="p-0.5 rounded-full bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTierSelect(plan.tier)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Pass Selected' : 'Choose This Pass'}: ${plan.tier} (₹${plan.pricePerMonth.toLocaleString('en-IN')}/mo)`}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 shadow-lg'
                        : 'bg-stone-800 text-stone-200 hover:bg-stone-700 hover:text-white border border-stone-700'
                    }`}
                  >
                    <span>{isSelected ? '✓ Pass Selected' : 'Choose This Pass'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Customization & Checkout Form */}
        <div className="max-w-2xl mx-auto card-surface p-8 sm:p-10 shadow-2xl border border-stone-800 bg-stone-900/90">
          <div className="border-b border-stone-800 pb-6 mb-6">
            <span className="text-micro text-amber-400 font-semibold block">COFFEE PASS PREFERENCES</span>
            <h3 className="text-xl font-bold text-white mt-1">Set Up Your Daily Order</h3>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubscribeClick() }} className="space-y-6">
            {/* Preferred Drink Style */}
            <div>
              <label className="text-micro text-stone-300 font-semibold block mb-2">
                WHAT DO YOU USUALLY DRINK?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Preferred Drink Style">
                {drinkStyles.map((style) => {
                  const isSelected = preferredDrinkStyle === style
                  return (
                    <button
                      key={style}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onStyleChange(style)}
                      className={`py-3 px-3.5 rounded-lg border text-xs font-semibold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-bold'
                          : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Billing Cadence Toggle */}
            <div>
              <label className="text-micro text-stone-300 font-semibold block mb-2">
                BILLING CYCLE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={billingCycle === 'monthly'}
                  onClick={() => onCycleChange('monthly')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold block">Monthly Pass</span>
                  <span className={`text-[11px] ${billingCycle === 'monthly' ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                    Standard monthly renewal
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={billingCycle === 'bimonthly'}
                  onClick={() => onCycleChange('bimonthly')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    billingCycle === 'bimonthly'
                      ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                  }`}
                >
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-400 text-stone-950">
                    SAVE 5%
                  </span>
                  <span className="text-xs font-bold block">Every 2 Months</span>
                  <span className={`text-[11px] ${billingCycle === 'bimonthly' ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                    Billed every 60 days
                  </span>
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="sub-email" className="text-micro text-stone-300 font-semibold block">
                YOUR EMAIL FOR PASS CODE &amp; MOBILE QR *
              </label>
              <input
                id="sub-email"
                type="email"
                required
                placeholder="alex@coffeeclub.com"
                value={email}
                onChange={(e) => {
                  onEmailChange(e.target.value)
                  if (emailError) setEmailError(null)
                }}
                className="input-field"
              />
            </div>

            {/* Error Message */}
            {emailError && (
              <div className="error-banner" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{emailError}</span>
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              className="btn-primary w-full justify-center py-4 text-base font-bold shadow-xl cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>
                {selectedTier
                  ? `Activate ${selectedTier} (₹${plans.find(p => p.tier === selectedTier)?.pricePerMonth.toLocaleString('en-IN')}/mo)`
                  : 'Select a Pass to Activate'}
              </span>
            </button>

            {/* Trust Signals */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Pause or cancel anytime
              </span>
              <span>·</span>
              <span>No commitment</span>
              <span>·</span>
              <span>Scan QR at bar or order ahead</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}