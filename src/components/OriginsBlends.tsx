import { MapPin, Globe2, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function OriginsBlends() {
  const originCards = [
    {
      region: 'Ethiopia',
      subregions: 'YIRGACHEFFE · SIDAMA',
      elevation: '1,800–2,200m ASL',
      affinity: 'Light Roasts',
      notes: ['Bergamot', 'Jasmine', 'Wild Honey'],
      desc: 'The ancestral birthplace of Arabica coffee. Heirloom cultivars grown at extreme elevation yield explosive floral aromas, peach sweetness, and an ethereal tea-like body.',
    },
    {
      region: 'Colombia',
      subregions: 'HUILA · NARIÑO',
      elevation: '1,600–1,950m ASL',
      affinity: 'Medium Roasts',
      notes: ['Cane Sugar', 'Hazelnut', 'Mandarin'],
      desc: 'Steep Andean microclimates and volcanic slopes create unmatched harmony. Yellow honey fermentations accentuate delicate stone-fruit acidity balanced by velvety panela sugar.',
    },
    {
      region: 'Sumatra',
      subregions: 'LAKE TOBA · MANDHELING',
      elevation: '1,400–1,650m ASL',
      affinity: 'Dark Roasts',
      notes: ['Cedar Wood', 'Dark Cacao', 'Black Cardamom'],
      desc: 'Processed via traditional wet-hulling (Giling Basah). Imparts iconic syrupy body, heavy dark cocoa tones, and exotic cedar resin that cuts effortlessly through steamed milk.',
    },
    {
      region: 'Guatemala',
      subregions: 'ANTIGUA · HUEHUETENANGO',
      elevation: '1,500–1,800m ASL',
      affinity: 'Medium Roasts',
      notes: ['Red Apple', 'Milk Chocolate', 'Pecan'],
      desc: 'Cradled between three volcanoes, Antigua valley soil is enriched by mineral ash. Bourbon and Typica varieties produce crisp apple malic acidity and rich baker’s chocolate.',
    },
  ]

  return (
    <section id="origins" className="scroll-mt-20 py-20 bg-stone-900/30 border-t border-stone-800/80" aria-label="Origins & Roasting Philosophy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story Section */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span className="text-micro font-semibold">ETHICAL TRANSPARENCY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Where Great Coffee Begins
          </h2>
          <p className="text-body text-stone-300 mt-4 leading-relaxed text-base">
            Timber & Tare was founded with a non-negotiable principle: <em>exceptional coffee demands uncompromised ethics</em>.
            We bypass industrial broker networks, paying our smallholder farming partners <strong>35% to 60% above Fair Trade minimums</strong>.
            Every harvest lot is cupped on-site, transported in temperature-controlled grainpro liners, and roasted to order.
          </p>
        </div>

        {/* 4 Origin Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {originCards.map((card, i) => (
            <motion.article
              key={card.region}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="card-surface p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white">{card.region}</h3>
                <span className="text-micro text-amber-400 font-semibold block mt-0.5">{card.subregions}</span>
                <span className="text-xs text-stone-400 block mt-1">{card.elevation}</span>
                
                <p className="text-xs text-stone-300 leading-relaxed mt-4">
                  {card.desc}
                </p>

                <div className="flex flex-wrap gap-1 mt-4">
                  {card.notes.map((note) => (
                    <span key={note} className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800/80 mt-6">
                <span className="text-micro text-stone-400 block">IDEAL PROFILING:</span>
                <span className="text-sm font-bold text-amber-400">{card.affinity}</span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Clean Roastery Summary & Transition to Brew Guides */}
        <div className="mt-8 pt-8 border-t border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Roasted weekly in sub-12kg micro-batches. Dialed in daily on our Synesso bar.</span>
          </div>
          <a
            href="#brew-guides"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors py-2 px-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40"
          >
            <span>Explore Precision Brew Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}