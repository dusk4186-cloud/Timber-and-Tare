import { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Thermometer,
  Gauge,
  Scale,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Droplets,
  Flame,
  CheckCircle,
} from 'lucide-react'
import type { BrewGuidesProps, BrewMethod } from '../types'
import { motion, AnimatePresence } from 'framer-motion'

interface RatioPreset {
  method: BrewMethod
  ratio: number
  temp: number
  timeSeconds: number
  grind: string
  bloomMultiplier: number
}

const PRESETS: Record<string, RatioPreset> = {
  'Pour Over': {
    method: 'Pour Over',
    ratio: 16,
    temp: 93,
    timeSeconds: 180,
    grind: 'Medium-Fine',
    bloomMultiplier: 2,
  },
  'AeroPress': {
    method: 'AeroPress',
    ratio: 12,
    temp: 88,
    timeSeconds: 105,
    grind: 'Fine',
    bloomMultiplier: 2.5,
  },
  'French Press': {
    method: 'French Press',
    ratio: 15,
    temp: 95,
    timeSeconds: 240,
    grind: 'Coarse',
    bloomMultiplier: 2,
  },
  'Cold Drip': {
    method: 'Cold Drip',
    ratio: 8,
    temp: 18,
    timeSeconds: 720,
    grind: 'Extra Coarse',
    bloomMultiplier: 1.5,
  },
  'Espresso': {
    method: 'Espresso',
    ratio: 2,
    temp: 93,
    timeSeconds: 28,
    grind: 'Ultra Fine',
    bloomMultiplier: 0,
  },
}

export function BrewGuides({
  guides,
  recommendedMethod,
  selectedMethod,
  onSelectMethodFilter,
}: BrewGuidesProps) {
  const [activeMethod, setActiveMethod] = useState<BrewMethod>(
    selectedMethod || recommendedMethod || 'Pour Over'
  )
  const [openMethod, setOpenMethod] = useState<BrewMethod | null>(
    selectedMethod || recommendedMethod || 'Pour Over'
  )

  // Sync external method selection if changed from App
  useEffect(() => {
    if (selectedMethod) {
      setActiveMethod(selectedMethod)
      setOpenMethod(selectedMethod)
      setSelectedCalcMethod(selectedMethod)
    }
  }, [selectedMethod])

  // Calculator State
  const [selectedCalcMethod, setSelectedCalcMethod] = useState<string>(
    selectedMethod || recommendedMethod || 'Pour Over'
  )
  const [coffeeDose, setCoffeeDose] = useState<number>(15)

  // Timer State
  const currentPreset = PRESETS[selectedCalcMethod] || PRESETS['Pour Over']
  const [secondsRemaining, setSecondsRemaining] = useState<number>(currentPreset.timeSeconds)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)

  // Recalculate timer on method change
  useEffect(() => {
    setIsTimerRunning(false)
    setSecondsRemaining(currentPreset.timeSeconds)
  }, [selectedCalcMethod, currentPreset.timeSeconds])

  // Countdown effect
  useEffect(() => {
    let interval: number | undefined
    if (isTimerRunning && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, secondsRemaining])

  const waterWeight = Math.round(coffeeDose * currentPreset.ratio)
  const bloomWeight = Math.round(coffeeDose * currentPreset.bloomMultiplier)

  // Timer Formatter mm:ss
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Active Phase calculation
  const getPhaseMessage = () => {
    const elapsed = currentPreset.timeSeconds - secondsRemaining
    if (secondsRemaining === 0) return 'Extraction Complete. Pour and savor the clarity!'
    if (!isTimerRunning && elapsed === 0) return 'Ready to brew. Tap Start when pouring!'
    if (selectedCalcMethod === 'Espresso') return 'Extracting rich honey crema at 9 bars...'
    if (elapsed <= 45 && currentPreset.bloomMultiplier > 0) {
      return `Phase 1: Bloom (${bloomWeight}g water). Degas beans for 45s.`
    }
    if (elapsed <= currentPreset.timeSeconds * 0.7) {
      return 'Phase 2: Spiral Pour. Maintain gentle center-to-edge flow.'
    }
    return 'Phase 3: Final Drawdown. Let bed settle evenly.'
  }

  const handleSelectGuide = (method: BrewMethod, toggleAccordion = false) => {
    setActiveMethod(method)
    setSelectedCalcMethod(method)
    if (toggleAccordion) {
      setOpenMethod((prev) => (prev === method ? null : method))
    } else {
      setOpenMethod(method)
    }
  }

  return (
    <section
      id="brew-guides"
      className="scroll-mt-20 py-20 bg-stone-950/70 border-t border-stone-800/80"
      aria-label="Brewing Guides and Methods"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-micro font-semibold uppercase tracking-wider">PRECISION EXTRACTION</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Brew It With Precision
          </h2>
          <p className="text-body text-stone-300 mt-2 text-base">
            Every roast profile has an ideal extraction curve. Dial in water temperature, grind geometry, and contact time for unmatched clarity in your cup.
          </p>
        </div>

        {/* Interactive Precision Ratio Calculator & Live Timer Widget */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-stone-900 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls: Dose & Presets (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-micro text-amber-400 font-bold tracking-wider block mb-1 uppercase">
                  INTERACTIVE RATIO CALCULATOR
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Dial In Your Brew Ratio
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Adjust the ground coffee dose to automatically calculate precise water weight and target extraction.
                </p>
              </div>

              {/* Method Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Select Brewing Apparatus
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESETS).map((key) => {
                    const isSelected = selectedCalcMethod === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectGuide(key as BrewMethod)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-extrabold'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white hover:border-stone-700'
                        }`}
                      >
                        {key}
                        <span className="ml-1.5 text-[10px] font-mono font-medium">
                          (1:{PRESETS[key].ratio})
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Coffee Dose Slider */}
              <div className="space-y-2 bg-stone-950/70 p-4 rounded-2xl border border-stone-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300 font-semibold flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Coffee Grounds Dose</span>
                  </span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {coffeeDose}g
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedCalcMethod === 'Espresso' ? 14 : 10}
                  max={selectedCalcMethod === 'Cold Drip' ? 60 : 35}
                  step={1}
                  value={coffeeDose}
                  onChange={(e) => setCoffeeDose(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-800 rounded-lg"
                  aria-label="Coffee grounds dose in grams"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>Single Cup (~15g)</span>
                  <span>Double Cup (~24g)</span>
                  <span>Carafe (~30g+)</span>
                </div>
              </div>

              {/* Metric Result Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-semibold">WATER WEIGHT</span>
                  <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1 mt-0.5">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {waterWeight}g
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-semibold">WATER TEMP</span>
                  <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1 mt-0.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {currentPreset.temp}°C
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-semibold">GRIND SIZE</span>
                  <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {currentPreset.grind}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                  <span className="text-[10px] text-stone-400 block font-semibold">BLOOM DOSE</span>
                  <span className="text-sm font-extrabold text-white font-mono flex items-center gap-1 mt-0.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {bloomWeight}g
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive Extraction Stopwatch Timer (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-950 border border-amber-500/20 text-center relative">
              <span className="text-[10px] font-bold tracking-widest text-amber-400/90 uppercase mb-2">
                EXTRACTION TIMER &bull; {selectedCalcMethod}
              </span>

              {/* Glowing Clock Face */}
              <div className="relative w-44 h-44 my-2 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-stone-800"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="stroke-amber-400 transition-all duration-500"
                    strokeWidth="4.5"
                    strokeDasharray={276}
                    strokeDashoffset={
                      276 - (276 * (currentPreset.timeSeconds - secondsRemaining)) / currentPreset.timeSeconds
                    }
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                    {formatTimer(secondsRemaining)}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400 mt-1 uppercase">
                    {isTimerRunning ? 'EXTRACTING' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Live Brewing Guidance Phase */}
              <p className="text-xs text-stone-300 font-medium min-h-[36px] flex items-center justify-center px-4">
                {getPhaseMessage()}
              </p>

              {/* Timer Action Buttons */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="btn-primary py-2.5 px-6 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-950/50"
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Timer</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false)
                    setSecondsRemaining(currentPreset.timeSeconds)
                  }}
                  className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 transition-colors cursor-pointer"
                  title="Reset timer"
                  aria-label="Reset timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Method Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const isActive = guide.method === activeMethod
            const isRecommended = guide.method === recommendedMethod
            const isOpen = openMethod === guide.method

            return (
              <article
                key={guide.method}
                onClick={() => handleSelectGuide(guide.method)}
                className={`card-surface flex flex-col justify-between overflow-hidden transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-amber-400 border-amber-500/60 shadow-xl shadow-amber-950/40 bg-stone-900/90'
                    : 'border-stone-800/80 hover:border-stone-700 bg-stone-900/60'
                }`}
              >
                <div>
                  {/* Card Header & Trigger */}
                  <div className="w-full p-6 text-left flex items-start justify-between gap-4 rounded-t-xl">
                    <div>
                      {/* Active / Recommended Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-sm">
                            <CheckCircle className="w-3 h-3" />
                            <span>ACTIVE METHOD</span>
                          </span>
                        )}
                        {isRecommended && !isActive && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-800 text-amber-300/80 border border-stone-700">
                            RECOMMENDED
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white">{guide.method}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {guide.bestFor.map((roast) => (
                          <span
                            key={roast}
                            className="text-micro px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700 font-semibold"
                          >
                            Best for {roast}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectGuide(guide.method, true)
                      }}
                      className="p-2 rounded-lg bg-stone-800/80 text-stone-300 hover:text-white transition-colors cursor-pointer"
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${guide.method} instructions`}
                    >
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Extraction Metrics Matrix */}
                  <div className="px-6 py-4 grid grid-cols-2 gap-3 border-t border-b border-stone-800/80 bg-stone-950/40 text-xs">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">GRIND</span>
                        <span className="font-semibold text-stone-200">{guide.grind}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">TEMP</span>
                        <span className="font-semibold text-stone-200">{guide.tempCelsius}°C</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">RATIO</span>
                        <span className="font-semibold text-stone-200">{guide.ratio}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold block">BREW TIME</span>
                        <span className="font-semibold text-stone-200">{guide.brewTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accordion Steps */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <ol className="p-6 space-y-3 bg-stone-900/60" aria-label={`Steps for ${guide.method}`}>
                          {guide.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed">
                              <span className="w-5 h-5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="text-stone-300 font-medium">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Action */}
                <div className="p-4 bg-stone-950/30 text-center border-t border-stone-800/60">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectGuide(guide.method)
                      if (onSelectMethodFilter) {
                        onSelectMethodFilter(guide.method)
                      } else {
                        const el = document.getElementById('menu')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className={`text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 ${
                      isActive
                        ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                        : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    }`}
                  >
                    <span>Find beans tailored for {guide.method}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
