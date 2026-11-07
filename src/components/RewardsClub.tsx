import React from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  Gift,
  Coffee,
  CheckCircle2,
  Crown,
  ArrowRight,
  Star,
  Check,
} from 'lucide-react'
import type { RewardItem, RewardsClubProps, LoyaltyTier } from '../types'
import { REWARD_ITEMS } from '../data/rewards'
import { trackEvent } from '../lib/analytics'

export const RewardsClub: React.FC<RewardsClubProps> = ({
  rewardPoints,
  stampsCount,
  appliedReward,
  onApplyReward,
  onRemoveReward,
}) => {
  // Calculate Loyalty Tier dynamically
  const getTier = (points: number): { name: LoyaltyTier; nextTier: string; needed: number; progress: number; badgeColor: string } => {
    if (points >= 500) {
      return {
        name: 'Master Tare',
        nextTier: 'Max Tier Achieved',
        needed: 0,
        progress: 100,
        badgeColor: 'tier-badge-master',
      }
    }
    if (points >= 250) {
      return {
        name: "Roaster's Circle",
        nextTier: 'Master Tare (500 Beans)',
        needed: 500 - points,
        progress: Math.round(((points - 250) / 250) * 100),
        badgeColor: 'tier-badge-roaster',
      }
    }
    return {
      name: 'Green Bean',
      nextTier: "Roaster's Circle (250 Beans)",
      needed: 250 - points,
      progress: Math.round((points / 250) * 100),
      badgeColor: 'tier-badge-green',
    }
  }

  const tierInfo = getTier(rewardPoints)

  const handleRedeem = (reward: RewardItem) => {
    if (appliedReward?.id === reward.id) {
      onRemoveReward()
      return
    }

    if (rewardPoints < reward.beansCost) return

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
    })

    onApplyReward(reward)
    trackEvent('redeem_reward', { rewardId: reward.id, cost: reward.beansCost })

    // Smoothly scroll down to cart or show confirmation
    const cartEl = document.getElementById('menu')
    if (cartEl) {
      cartEl.scrollIntoView({ behavior: 'smooth' })
    }
  }



  return (
    <section id="rewards" className="scroll-mt-20 py-20 bg-stone-950 relative border-t border-stone-800/80" aria-label="Tare Rewards & Loyalty Program">
      {/* Background Amber Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
              <Gift className="w-3.5 h-3.5" />
              <span className="text-micro font-semibold uppercase tracking-wider">TARE REWARDS &amp; BEAN BANK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Precision Coffee. Generously Rewarded.
            </h2>
            <p className="text-body text-stone-300 mt-3 leading-relaxed text-sm sm:text-base">
              Every handcrafted cortado, sourdough bite, and micro-lot bag earns you Beans.
              Collect digital cup stamps, ascend membership tiers, and redeem complimentary reserve roasts.
            </p>
          </div>

          {/* Points & Stamp Summary Header Pill */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 shadow-xl flex items-center gap-4 shrink-0">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-micro font-bold text-stone-400 uppercase tracking-wider block">YOUR BEAN BALANCE</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-amber-400 font-mono">{rewardPoints}</span>
                <span className="text-xs font-bold text-white">Beans</span>
              </div>
              <span className="text-[11px] text-stone-400 block mt-0.5">Tier: <strong className="text-amber-300">{tierInfo.name}</strong></span>
            </div>
          </div>
        </div>

        {/* 2 Interactive Cards Grid: Digital Punchcard + Live Bean Bank */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          {/* Card 1: 10-Cup Digital Punchcard (7 Cols) */}
          <div className="lg:col-span-7 card-surface p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Coffee className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">The Tare 10-Cup Punchcard</h3>
                </div>
                <span className="text-micro px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider">
                  {stampsCount} / 10 STAMPED
                </span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Order any 9 barista coffees or specialty beverages. Your 10th handcrafted cup is entirely on the house!
              </p>

              {/* 10 Visual Stamp Circles Grid */}
              <div className="grid grid-cols-5 gap-2.5 sm:gap-3 mb-6" aria-label="10 cup loyalty stamp card">
                {Array.from({ length: 10 }).map((_, index) => {
                  const stampNumber = index + 1
                  const isStamped = stampNumber <= stampsCount
                  const is10th = stampNumber === 10

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border transition-all ${
                        isStamped
                          ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : is10th
                          ? 'bg-stone-950/80 border-amber-500/50 border-dashed text-amber-400/80'
                          : 'bg-stone-950/50 border-stone-800 text-stone-400'
                      }`}
                    >
                      {isStamped ? (
                        <>
                          <Coffee className="w-5 h-5 text-amber-400 fill-amber-400/30" />
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 absolute top-1.5 right-1.5" />
                          <span className="text-[10px] font-bold text-amber-300 mt-1">#{stampNumber}</span>
                        </>
                      ) : is10th ? (
                        <>
                          <Star className="w-5 h-5 text-amber-400 animate-pulse fill-amber-400" />
                          <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-tight text-center mt-0.5">
                            FREE
                          </span>
                        </>
                      ) : (
                        <>
                          <Coffee className="w-4 h-4 text-stone-400" />
                          <span className="text-[10px] font-semibold text-stone-400 mt-1">#{stampNumber}</span>
                        </>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Punchcard Action & Milestone */}
            <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <span className="text-stone-300 font-medium">
                {stampsCount >= 10 ? (
                  <strong className="text-amber-400">🎉 Congratulations! You have a Free Drink ready to claim!</strong>
                ) : (
                  <>Only <strong>{10 - stampsCount} more drinks</strong> until your complimentary 10th cup!</>
                )}
              </span>


            </div>
          </div>

          {/* Card 2: Live Bean Bank & Tier Status (5 Cols) */}
          <div className="lg:col-span-5 card-surface p-6 sm:p-8 flex flex-col justify-between bg-stone-900 border border-stone-800">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-micro font-bold text-amber-400 uppercase tracking-wider">MEMBERSHIP PROGRESS</span>
                <span className={`text-micro px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${tierInfo.badgeColor}`}>
                  {tierInfo.name}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-white">Tier Progress</span>
                  <span className="text-xs text-amber-400 font-mono font-bold">{tierInfo.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${tierInfo.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[11px] text-stone-400 block mt-1.5">
                  {tierInfo.needed > 0
                    ? `Earn ${tierInfo.needed} more Beans to reach ${tierInfo.nextTier}`
                    : 'Highest Tier reached! Enjoy VIP privileges.'}
                </span>
              </div>

              {/* Active Tier Perks List */}
              <div className="space-y-2.5 pt-4 border-t border-stone-800/80">
                <span className="text-micro font-bold text-stone-400 uppercase tracking-wider block mb-2">ACTIVE PERKS</span>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>10 Beans / ₹100</strong> base reward rate on all purchases</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free birthday handcrafted beverage of your choice</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complimentary oat, almond &amp; soy milk upgrades</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Early access notifications on rare micro-lot roasts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-800/80 mt-6">
              <a
                href="#menu"
                className="w-full btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>Order Drinks &amp; Earn Beans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Redeemable Rewards Catalog */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Redeem Your Tare Beans</h3>
              <p className="text-xs text-stone-400 mt-1">
                Select any reward below to apply an instant discount to your current active cafe order.
              </p>
            </div>

            {appliedReward && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <Check className="w-3.5 h-3.5" />
                <span>Active: <strong>{appliedReward.title}</strong> (-₹{appliedReward.discountAmount})</span>
                <button
                  type="button"
                  onClick={onRemoveReward}
                  className="ml-2 text-stone-400 hover:text-white underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REWARD_ITEMS.map((reward) => {
              const canAfford = rewardPoints >= reward.beansCost
              const isApplied = appliedReward?.id === reward.id

              return (
                <motion.article
                  key={reward.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`card-surface p-6 flex flex-col justify-between transition-all rounded-3xl ${
                    isApplied
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/20'
                      : canAfford
                      ? 'hover:border-amber-500/50 bg-stone-900'
                      : 'bg-stone-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-2xl flex items-center justify-center">
                        {reward.icon}
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-amber-400 font-mono">
                          {reward.beansCost}
                        </span>
                        <span className="text-[10px] text-stone-300 font-bold uppercase block -mt-1">BEANS</span>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{reward.title}</h4>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4">{reward.subtitle}</p>
                    <span className="text-micro font-bold text-amber-400 block mb-4">
                      Worth ₹{reward.discountAmount}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-stone-800">
                    {isApplied ? (
                      <button
                        type="button"
                        onClick={onRemoveReward}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Applied to Order</span>
                      </button>
                    ) : canAfford ? (
                      <button
                        type="button"
                        onClick={() => handleRedeem(reward)}
                        className="w-full btn-primary py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-950/40"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Redeem Reward</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 px-3 rounded-xl bg-stone-800/80 border border-stone-700 text-stone-400 text-xs font-semibold cursor-not-allowed text-center"
                      >
                        Need {reward.beansCost - rewardPoints} more Beans
                      </button>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
