import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  MapPin,
  Coffee,
  RotateCcw,
  Printer,
  ChevronRight,
  Flame,
} from 'lucide-react'
import type { OrderReceipt } from '../types'
import { trackEvent } from '../lib/analytics'

interface OrderReceiptTrackerProps {
  receipt: OrderReceipt
  onBackToMenu: () => void
}

const BARISTA_STEPS = [
  { step: 1, title: 'Order Received', desc: 'Ticket printed at Hot Bar counter' },
  { step: 2, title: 'Grinding & Pulling Shots', desc: '18.5g dosage, double espresso extraction' },
  { step: 3, title: 'Steaming & Texturing', desc: 'Velvet microfoam & artisan latte art' },
  { step: 4, title: 'Ready for Pickup', desc: 'Fresh on counter with your name tag' },
]

export const OrderReceiptTracker: React.FC<OrderReceiptTrackerProps> = ({
  receipt,
  onBackToMenu,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(receipt.statusStep || 2)
  const [secondsRemaining, setSecondsRemaining] = useState(
    receipt.estimatedMinutes ? receipt.estimatedMinutes * 60 : 480
  )

  // Simulate real-time barista progress over time
  useEffect(() => {
    trackEvent('view_receipt', { orderId: receipt.orderId })

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1))
    }, 1000)

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < 4 ? prev + 1 : 4))
    }, 15000)

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [receipt.orderId])

  const formatMinutes = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6 flex justify-between items-center">
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors py-2 px-3 rounded-lg bg-stone-900/60 border border-stone-800 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Back to Cafe Hot Bar</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors py-2 px-3 rounded-lg bg-stone-900 border border-stone-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Live Barista Tracker Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-micro font-bold tracking-wider text-emerald-400 uppercase">
                  LIVE BARISTA DISPATCH
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Order #{receipt.orderId}
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Placed at {receipt.placedAt} &bull; Mode: <span className="text-amber-400 font-semibold uppercase">{receipt.orderMode}</span>
              </p>
            </div>

            <div className="bg-stone-950/80 border border-amber-500/30 rounded-2xl p-4 text-center sm:text-right shrink-0">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">
                ESTIMATED READY TIME
              </span>
              <div className="flex items-center justify-center sm:justify-end gap-1.5 text-amber-400 font-mono text-2xl font-bold mt-0.5">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>{formatMinutes(secondsRemaining)}</span>
              </div>
              <span className="text-[10px] text-stone-400">
                {currentStep === 4 ? 'Ready at Counter!' : 'Preparing fresh in cup'}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-8">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-stone-800 -z-0" />
              <motion.div
                className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 -z-0"
                style={{
                  width: `${((currentStep - 1) / (BARISTA_STEPS.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />

              {/* Step Circles */}
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {BARISTA_STEPS.map((s) => {
                  const isDone = currentStep > s.step
                  const isCurrent = currentStep === s.step

                  return (
                    <div key={s.step} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-amber-500 text-stone-950 ring-4 ring-stone-900 shadow-md'
                            : isCurrent
                            ? 'bg-stone-950 border-2 border-amber-400 text-amber-400 ring-4 ring-amber-500/20 shadow-lg'
                            : 'bg-stone-950 border border-stone-800 text-stone-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : isCurrent ? (
                          <Flame className="w-5 h-5 animate-pulse text-amber-400" />
                        ) : (
                          <span className="text-xs font-bold">{s.step}</span>
                        )}
                      </div>

                      <span
                        className={`text-xs font-bold mt-2.5 hidden sm:block ${
                          isCurrent ? 'text-amber-400' : isDone ? 'text-stone-200' : 'text-stone-400'
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-0.5 hidden md:block max-w-[120px] leading-tight">
                        {s.desc}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Current Barista Action Note */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="text-amber-300 font-bold block">
                Barista Ethan is crafting your order:
              </span>
              <p className="text-stone-300 mt-0.5">
                {BARISTA_STEPS[currentStep - 1]?.desc || 'Preparing drinks to perfection.'}
              </p>
            </div>
          </div>
        </div>

        {/* Itemized Order Receipt Details */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b border-stone-800 flex items-center justify-between">
            <span>Drinks in this Ticket</span>
            <span className="text-xs text-stone-400 font-normal">
              {receipt.items.length} item{receipt.items.length > 1 ? 's' : ''}
            </span>
          </h2>

          <div className="divide-y divide-stone-800/80 mb-6">
            {receipt.items.map((entry, idx) => (
              <div key={idx} className="py-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{entry.item.name}</span>
                    <span className="text-xs text-amber-400 font-mono">x{entry.quantity}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                      {entry.temp}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-stone-300">
                      {entry.size}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-950 border border-stone-800 text-amber-300/90">
                      {entry.milk}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">{entry.item.origin}</p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">
                    ₹{entry.item.price * entry.quantity}
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    ₹{entry.item.price} each
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Fulfillment details */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 mb-6 text-xs space-y-2">
            <div className="flex items-start gap-2 text-stone-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">
                  {receipt.orderMode === 'pickup' ? 'Pickup Location:' : 'Delivery Address:'}
                </span>
                <span className="text-stone-300">
                  {receipt.orderMode === 'pickup'
                    ? receipt.pickupDetails?.storeLocation || 'BrewHub 42 Arabica Lane Express Bar'
                    : `${receipt.deliveryDetails?.fullName}, ${receipt.deliveryDetails?.addressLine1}, Bengaluru - ${receipt.deliveryDetails?.pinCode}`}
                </span>
              </div>
            </div>
            {receipt.orderMode === 'pickup' && (
              <div className="flex items-center gap-2 text-stone-300 pt-1 border-t border-stone-900">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Scheduled slot: {receipt.pickupDetails?.timeSlot || 'ASAP (10-15 mins)'}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-4 border-t border-stone-800 text-xs">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal</span>
              <span className="text-stone-200 font-mono">₹{Math.round(receipt.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Tax (GST 5%)</span>
              <span className="text-stone-200 font-mono">₹{Math.round(receipt.tax)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-stone-800">
              <span>Total Paid</span>
              <span className="text-amber-400 font-mono">₹{Math.round(receipt.total)}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 pt-4 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onBackToMenu}
              className="btn-primary flex-1 py-3.5 text-center font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore More Cafe Drinks</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
