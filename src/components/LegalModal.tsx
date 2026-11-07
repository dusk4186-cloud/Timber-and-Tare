import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, FileText, Check } from 'lucide-react'

export type LegalDocType = 'privacy' | 'terms'

interface LegalModalProps {
  isOpen: boolean
  activeDoc: LegalDocType
  onClose: () => void
  onSwitchDoc: (doc: LegalDocType) => void
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeDoc,
  onClose,
  onSwitchDoc,
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                {activeDoc === 'privacy' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {activeDoc === 'privacy' ? 'Privacy & Data Protection' : 'Terms of Cafe Service'}
                </h3>
                <span className="text-micro text-stone-400">Effective Date: October 2026 &bull; BrewHub Cafe</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close legal modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Doc Switcher Tabs */}
          <div className="flex border-b border-stone-800 bg-stone-900/90 px-6 pt-2">
            <button
              type="button"
              onClick={() => onSwitchDoc('privacy')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeDoc === 'privacy'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-300'
              }`}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => onSwitchDoc('terms')}
              className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeDoc === 'terms'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-300'
              }`}
            >
              Terms &amp; Fulfillment
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-300 leading-relaxed">
            {activeDoc === 'privacy' ? (
              <>
                <section>
                  <h4 className="text-sm font-bold text-white mb-2">1. Information We Collect</h4>
                  <p>
                    BrewHub respects your privacy. When you place a coffee pickup or delivery order, we collect only necessary fulfillment information: your name, contact phone number, delivery address (for couriers), and drink recipe preferences (temperature, size, and milk alternatives).
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">2. Payment Security</h4>
                  <p>
                    All payment transactions are encrypted using end-to-end 256-bit TLS encryption. BrewHub never stores complete credit card numbers on local servers. Tokenized payment gateways ensure complete PCI-DSS Level 1 compliance.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">3. Cookies &amp; Preferences</h4>
                  <p>
                    We use strictly essential local storage tokens to retain your cart items, selected pickup branch, and login session. We do not sell or monetize personal customer analytics to third-party advertisers.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">4. Contact Our Data Officer</h4>
                  <p>
                    For data deletion or questions regarding your drink history, email us at <span className="text-amber-400 font-mono">privacy@brewhub.cafe</span> or visit our roastery at 42 Arabica Lane, Bengaluru.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h4 className="text-sm font-bold text-white mb-2">1. Freshness &amp; Preparation Guarantee</h4>
                  <p>
                    All drinks are extracted and poured fresh according to specialty coffee standards. For espresso beverages, we recommend picking up within 15 minutes of your scheduled time slot to experience optimal crema and milk texture.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">2. Courier Delivery Radius</h4>
                  <p>
                    Delivery is available within a 6km radius of our Bengaluru Arabica Lane Roastery. Drinks are dispatched in thermal double-walled insulated carriers with spill-proof lids.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">3. Subscription Passes &amp; Cancellations</h4>
                  <p>
                    Daily Coffee Pass memberships may be paused, changed, or canceled at any time prior to the next billing cycle. Unused monthly drink credits do not expire for 60 days following the billing month.
                  </p>
                </section>

                <section>
                  <h4 className="text-sm font-bold text-white mb-2">4. Remakes &amp; Refunds</h4>
                  <p>
                    If your coffee is not prepared to your exact customization specifications, let our lead barista know at the bar or via support and we will gladly remake your drink immediately at no charge.
                  </p>
                </section>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-stone-950/80 border-t border-stone-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-primary py-2.5 px-6 font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-stone-950" />
              <span>Understood</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
