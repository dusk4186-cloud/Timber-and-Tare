import React, { useState } from 'react'
import type { OrderModalityProps, OrderMode } from '../types'
import {
  Coffee,
  Truck,
  Clock,
  MapPin,
  Check,
  Edit2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const OrderModality: React.FC<OrderModalityProps> = ({
  mode,
  pickup,
  delivery,
  availableSlots,
  availableDates,
  currentUser,
  onModeChange,
  onPickupChange,
  onDeliveryChange,
  onUpdateDeliveryAddress,
}) => {
  const [isEditingSavedAddress, setIsEditingSavedAddress] = useState(false)

  const isUserLoggedIn = Boolean(currentUser && !currentUser.isAnonymous)
  const hasSavedAddress = Boolean(
    isUserLoggedIn && (currentUser?.deliveryAddress?.addressLine1 || delivery.addressLine1)
  )

  const handleSaveUpdatedAddress = () => {
    setIsEditingSavedAddress(false)
    if (onUpdateDeliveryAddress) {
      onUpdateDeliveryAddress(delivery)
    }
  }

  return (
    <section id="modality" className="py-12 bg-stone-950 border-b border-stone-800/80">
      <div className="max-w-5xl mx-auto px-6">
        {/* Toggle Mode: Pickup vs Courier Delivery */}
        <div className="flex justify-center mb-8">
          <div
            role="tablist"
            aria-label="Order fulfillment method"
            className="p-1.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-1.5 shadow-xl max-w-md w-full"
          >
            {(['pickup', 'delivery'] as OrderMode[]).map((m) => {
              const isSelected = mode === m
              return (
                <button
                  key={m}
                  id={`tab-${m}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${m}`}
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                  onClick={() => onModeChange(m)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40 font-extrabold'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  {m === 'pickup' ? (
                    <>
                      <Coffee className="w-4 h-4 shrink-0" />
                      <span>Counter Pickup</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 shrink-0" />
                      <span>Courier Delivery</span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="card-surface p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-stone-800 shadow-xl">
          <AnimatePresence mode="wait">
            {mode === 'pickup' ? (
              <motion.div
                key="pickup"
                id="panel-pickup"
                role="tabpanel"
                aria-labelledby="tab-pickup"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Store Location Notice */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-200 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                        EXPRESS BAR PICKUP
                      </span>
                      <p className="text-sm font-semibold text-white">
                        BrewHub Roastery &amp; Express Bar, 42 Arabica Lane, Bengaluru
                      </p>
                    </div>
                  </div>
                  <span className="text-micro px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                    10-15 MINS READY
                  </span>
                </div>

                {/* Date Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-micro text-stone-400 font-semibold tracking-wider">
                    PICKUP DATE
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {availableDates.map((date) => {
                      const isSelected = pickup.date === date
                      return (
                        <button
                          key={date}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => onPickupChange('date', date)}
                          className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                          }`}
                        >
                          {date}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="flex flex-col gap-2">
                  <label className="text-micro text-stone-400 font-semibold tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>WHEN SHOULD WE PULL YOUR SHOTS?</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = pickup.timeSlot === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => onPickupChange('timeSlot', slot)}
                          className={`py-2 px-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center truncate ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-bold'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Order Note */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pickup-note" className="text-micro text-stone-400 font-semibold tracking-wider">
                    SPECIAL BARISTA REQUESTS (OPTIONAL)
                  </label>
                  <textarea
                    id="pickup-note"
                    value={pickup.orderNote}
                    onChange={(e) => onPickupChange('orderNote', e.target.value)}
                    placeholder="e.g. Extra hot flat white, light ice for cold brew, cinnamon dust on top"
                    className="input-field resize-y min-h-[70px] text-xs"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="delivery"
                id="panel-delivery"
                role="tabpanel"
                aria-labelledby="tab-delivery"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                {/* Delivery Guarantee Banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium">
                      Dispatched in spill-proof thermal cup-carriers to maintain ideal temperature.
                    </span>
                  </div>
                  <span className="text-micro text-amber-400 font-bold hidden sm:inline">
                    25-35 MINS ARRIVAL
                  </span>
                </div>

                {/* CASE 1: LOGGED IN USER WITH SAVED ADDRESS (Compact Card) */}
                {hasSavedAddress && !isEditingSavedAddress ? (
                  <div className="p-5 rounded-2xl bg-stone-950/80 border border-stone-800 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800/80">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>DELIVERING TO YOUR SAVED ADDRESS</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditingSavedAddress(true)}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Change / Edit Address</span>
                      </button>
                    </div>

                    <div className="pt-3 text-xs space-y-1">
                      <p className="font-bold text-white text-sm">
                        {delivery.fullName || currentUser?.displayName || 'Coffee Friend'} &bull;{' '}
                        <span className="text-stone-300 font-normal">
                          {delivery.phone || '+91 98765 43210'}
                        </span>
                      </p>
                      <p className="text-stone-300 flex items-start gap-1.5 pt-1">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          {delivery.addressLine1}
                          {delivery.addressLine2 ? `, ${delivery.addressLine2}` : ''}, {delivery.city} - {delivery.pinCode}
                        </span>
                      </p>
                      {delivery.specialInstructions && (
                        <p className="text-stone-400 text-[11px] pt-1 italic">
                          Note: &ldquo;{delivery.specialInstructions}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  /* CASE 2: GUEST MODE OR EDITING SAVED ADDRESS (Full Form) */
                  <div className="space-y-4">
                    {!isUserLoggedIn && (
                      <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>
                            Ordering in <strong>Guest Mode</strong>. Enter your delivery address below:
                          </span>
                        </div>
                      </div>
                    )}

                    {isEditingSavedAddress && (
                      <div className="flex justify-between items-center pb-2 border-b border-stone-800 text-xs">
                        <span className="font-bold text-amber-400">Update Delivery Destination:</span>
                        <button
                          type="button"
                          onClick={() => setIsEditingSavedAddress(false)}
                          className="text-stone-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="d-fullname" className="text-micro text-stone-400 font-semibold">
                          RECIPIENT NAME *
                        </label>
                        <input
                          id="d-fullname"
                          type="text"
                          required
                          placeholder="e.g. Alex Doe"
                          value={delivery.fullName}
                          onChange={(e) => onDeliveryChange('fullName', e.target.value)}
                          className="input-field text-xs py-2"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="d-phone" className="text-micro text-stone-400 font-semibold">
                          CONTACT PHONE *
                        </label>
                        <input
                          id="d-phone"
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={delivery.phone}
                          onChange={(e) => onDeliveryChange('phone', e.target.value)}
                          className="input-field text-xs py-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="d-addr1" className="text-micro text-stone-400 font-semibold">
                        STREET ADDRESS, BUILDING &amp; FLOOR *
                      </label>
                      <input
                        id="d-addr1"
                        type="text"
                        required
                        placeholder="e.g. 4th Floor, Tech Hub Tower, 100 Feet Rd"
                        value={delivery.addressLine1}
                        onChange={(e) => onDeliveryChange('addressLine1', e.target.value)}
                        className="input-field text-xs py-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="d-addr2" className="text-micro text-stone-400 font-semibold">
                          LANDMARK (OPTIONAL)
                        </label>
                        <input
                          id="d-addr2"
                          type="text"
                          placeholder="Opposite City Park"
                          value={delivery.addressLine2}
                          onChange={(e) => onDeliveryChange('addressLine2', e.target.value)}
                          className="input-field text-xs py-2"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="d-city" className="text-micro text-stone-400 font-semibold">
                          CITY *
                        </label>
                        <input
                          id="d-city"
                          type="text"
                          required
                          placeholder="Bengaluru"
                          value={delivery.city}
                          onChange={(e) => onDeliveryChange('city', e.target.value)}
                          className="input-field text-xs py-2"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label htmlFor="d-pin" className="text-micro text-stone-400 font-semibold">
                          PIN CODE *
                        </label>
                        <input
                          id="d-pin"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          placeholder="560001"
                          value={delivery.pinCode}
                          onChange={(e) => onDeliveryChange('pinCode', e.target.value)}
                          className="input-field text-xs py-2"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="d-instructions" className="text-micro text-stone-400 font-semibold">
                        COURIER DELIVERY INSTRUCTIONS (OPTIONAL)
                      </label>
                      <input
                        id="d-instructions"
                        type="text"
                        value={delivery.specialInstructions}
                        onChange={(e) => onDeliveryChange('specialInstructions', e.target.value)}
                        placeholder="e.g. Ring doorbell, leave at reception desk"
                        className="input-field text-xs py-2"
                      />
                    </div>

                    {isEditingSavedAddress && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveUpdatedAddress}
                          className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-stone-950 font-bold" />
                          <span>Save Address</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
