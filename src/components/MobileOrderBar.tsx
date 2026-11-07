import React from 'react'
import { ShoppingBag, ChevronRight, Clock } from 'lucide-react'
import type { OrderMode } from '../types'

interface MobileOrderBarProps {
  cartCount: number
  cartSubtotal: number
  orderMode: OrderMode
  onOpenCart: () => void
}

export const MobileOrderBar: React.FC<MobileOrderBarProps> = ({
  cartCount,
  cartSubtotal,
  orderMode,
  onOpenCart,
}) => {
  if (cartCount === 0) return null

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40 animate-in slide-in-from-bottom duration-300">
      <button
        type="button"
        onClick={onOpenCart}
        className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold rounded-2xl shadow-xl shadow-amber-950/60 border border-amber-300/40 flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer"
        aria-label="View current drink order"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-950/20 text-stone-950 flex items-center justify-center font-bold text-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight">
            <span className="text-xs uppercase tracking-wider font-extrabold block">
              {cartCount} {cartCount === 1 ? 'DRINK' : 'DRINKS'} IN ORDER
            </span>
            <span className="text-[11px] opacity-80 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" />
              {orderMode === 'pickup' ? '10-15m counter pickup' : 'Express courier delivery'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm font-extrabold font-mono bg-stone-950/15 py-1 px-3 rounded-lg">
          <span>₹{Math.round(cartSubtotal)}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </div>
  )
}
