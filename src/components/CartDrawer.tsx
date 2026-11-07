import { useEffect } from 'react'
import type { CartDrawerProps, DrinkTemp, DrinkSize, MilkChoice } from '../types'
import { X, Trash2, Minus, Plus, AlertCircle, ShoppingBag, ArrowRight, Clock, Bike, MapPin, Check, Gift, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CartDrawer({
  isOpen,
  entries,
  orderMode = 'pickup',
  deliveryDetails,
  currentUser,
  appliedReward,
  onRemoveReward,
  onModeChange,
  onDeliveryChange,
  onClose,
  onQuantityChange,
  onTempChange,
  onSizeChange,
  onMilkChange,
  onRemove,
  onCheckout,
  checkoutError,
}: CartDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const subtotal = entries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0
  )
  const discount = appliedReward ? Math.min(appliedReward.discountAmount, subtotal) : 0
  const finalSubtotal = Math.max(0, subtotal - discount)
  const tax = finalSubtotal * 0.05
  const deliveryFee = orderMode === 'delivery' ? 40 : 0
  const total = finalSubtotal + tax + deliveryFee

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-heading"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 id="cart-heading" className="text-lg font-bold text-white">
                Your Cafe Order ({entries.reduce((acc, curr) => acc + curr.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutError && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{checkoutError}</span>
              </div>
            )}

            {entries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400">
                <div className="w-16 h-16 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center mb-4 text-3xl">
                  ☕
                </div>
                <h3 className="text-base font-bold text-white">Your order is empty</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-[200px]">
                  Explore our specialty coffee, ceremonial teas, and artisan bakery treats.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary mt-6 py-2 px-5 text-xs font-bold cursor-pointer"
                >
                  Explore Cafe Menu
                </button>
              </div>
            ) : (
              <AnimatePresence>
                {entries.map((entry) => {
                  const isFood = entry.item.itemType === 'food'

                  return (
                    <motion.div
                      key={entry.item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 flex flex-col gap-3 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Thumbnail image */}
                        <img
                          src={entry.item.image}
                          alt={entry.item.name}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-800"
                        />

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block truncate">
                            {entry.item.category}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">
                            {entry.item.name}
                          </h4>
                          <span className="text-xs text-stone-400 font-mono">
                            ₹{entry.item.price} each
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(entry.item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-400 transition-colors cursor-pointer"
                          aria-label={`Remove ${entry.item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Customization Selectors */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-stone-800/80">
                        {/* Temp / Prep Selector */}
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={`temp-${entry.item.id}`}
                            className="text-[10px] font-semibold text-stone-400 uppercase"
                          >
                            {isFood ? 'PREP' : 'TEMP'}
                          </label>
                          <select
                            id={`temp-${entry.item.id}`}
                            value={entry.temp}
                            onChange={(e) => onTempChange(entry.item.id, e.target.value as DrinkTemp)}
                            className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg p-1.5 outline-none focus:border-amber-500 cursor-pointer"
                          >
                            {isFood ? (
                              <>
                                <option value="Warm / Toasted">Warm / Toasted</option>
                                <option value="Fresh">Room Temp / Fresh</option>
                              </>
                            ) : (
                              <>
                                <option value="Hot">Hot</option>
                                <option value="Iced">Iced</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Size Selector */}
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor={`size-${entry.item.id}`}
                            className="text-[10px] font-semibold text-stone-400 uppercase"
                          >
                            PORTION
                          </label>
                          <select
                            id={`size-${entry.item.id}`}
                            value={entry.size}
                            onChange={(e) => onSizeChange(entry.item.id, e.target.value as DrinkSize)}
                            className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg p-1.5 outline-none focus:border-amber-500 cursor-pointer"
                          >
                            {isFood ? (
                              <>
                                <option value="Single Portion">Single Portion</option>
                                <option value="Shareable">Shareable Plate</option>
                              </>
                            ) : (
                              <>
                                <option value="Piccolo (8oz)">8oz</option>
                                <option value="Regular (12oz)">12oz</option>
                                <option value="Large (16oz)">16oz</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* Milk Alternative Selector (For Drinks) */}
                        {!isFood && (
                          <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                            <label
                              htmlFor={`milk-${entry.item.id}`}
                              className="text-[10px] font-semibold text-stone-400 uppercase"
                            >
                              MILK
                            </label>
                            <select
                              id={`milk-${entry.item.id}`}
                              value={entry.milk}
                              onChange={(e) => onMilkChange(entry.item.id, e.target.value as MilkChoice)}
                              className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-lg p-1.5 outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="Oat Milk">Oat Milk</option>
                              <option value="Almond Milk">Almond Milk</option>
                              <option value="Soy Milk">Soy Milk</option>
                              <option value="Hemp Milk">Hemp Milk</option>
                              <option value="Whole Milk">Whole Dairy</option>
                              <option value="Coconut Milk">Coconut Milk</option>
                              <option value="Black (No Milk)">Black</option>
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Stepper + Total Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                        <div className="flex items-center gap-1.5 bg-stone-900 rounded-xl p-1 border border-stone-800">
                          <button
                            type="button"
                            onClick={() => onQuantityChange(entry.item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white font-mono">
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onQuantityChange(entry.item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-extrabold text-white font-mono">
                          ₹{entry.item.price * entry.quantity}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Footer with Modality Toggle, Subtotal & Checkout */}
          {entries.length > 0 && (
            <div className="p-6 border-t border-stone-800 bg-stone-950/90 space-y-4">
              {/* Order Modality Selector: Counter Pickup vs Courier Delivery */}
              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-200">How would you like your order?</span>
                  <span className="text-[11px] font-bold text-amber-400">
                    {orderMode === 'pickup' ? 'Free (10 min)' : '+₹40 Courier'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onModeChange?.('pickup')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      orderMode === 'pickup'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Counter Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onModeChange?.('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      orderMode === 'delivery'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5 text-amber-400" />
                    <span>Courier Delivery</span>
                  </button>
                </div>

                {orderMode === 'delivery' && (
                  <div className="pt-2 border-t border-stone-800/80 space-y-2">
                    {currentUser?.deliveryAddress ? (
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white truncate">{currentUser.deliveryAddress.fullName}</p>
                          <p className="text-[11px] text-stone-400 leading-tight truncate">
                            {currentUser.deliveryAddress.addressLine1}, {currentUser.deliveryAddress.pinCode}
                          </p>
                        </div>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 shrink-0 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          <Check className="w-2.5 h-2.5" /> Saved
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-xs">
                        <input
                          type="text"
                          placeholder="Delivery address / apartment"
                          value={deliveryDetails?.addressLine1 || ''}
                          onChange={(e) => onDeliveryChange?.('addressLine1', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-400 text-xs outline-none focus:border-amber-500"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={deliveryDetails?.phone || ''}
                            onChange={(e) => onDeliveryChange?.('phone', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-400 text-xs outline-none focus:border-amber-500"
                          />
                          <input
                            type="text"
                            placeholder="PIN code (560001)"
                            value={deliveryDetails?.pinCode || ''}
                            onChange={(e) => onDeliveryChange?.('pinCode', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-400 text-xs outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-stone-200 font-mono">₹{Math.round(subtotal)}</span>
                </div>
                {appliedReward && (
                  <div className="flex justify-between items-center text-xs text-emerald-400 py-1.5 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <Gift className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{appliedReward.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold">-₹{Math.round(discount)}</span>
                      {onRemoveReward && (
                        <button
                          type="button"
                          onClick={onRemoveReward}
                          className="text-stone-400 hover:text-white text-[10px] underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-stone-400">
                  <span>Estimated Tax (5%)</span>
                  <span className="text-stone-200 font-mono">₹{Math.round(tax)}</span>
                </div>
                {orderMode === 'delivery' && (
                  <div className="flex justify-between text-stone-400">
                    <span>Express Courier Fee</span>
                    <span className="text-amber-400 font-mono">₹40</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-stone-800">
                  <span>Total</span>
                  <span className="text-amber-400 font-mono">₹{Math.round(total)}</span>
                </div>

                {/* Tare Rewards Bean Earn Preview */}
                <div className="flex items-center justify-between text-[11px] text-amber-300 py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Order Earning:</span>
                  </span>
                  <span className="font-bold font-mono text-amber-400">+{Math.floor(total / 10)} Tare Beans</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onCheckout}
                className="btn-primary w-full py-3.5 px-6 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-amber-950/50"
              >
                <span>Proceed to Order Confirmation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
