import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'

interface NotFoundViewProps {
  onBackToHome: () => void
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onBackToHome }) => {
  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-6 py-20 text-stone-100 select-none">
      <div className="max-w-lg w-full text-center">
        {/* Animated Sad Mascot: "Brewie" with Tears & Spilled Brew */}
        <div className="relative w-40 h-40 mx-auto mb-6 flex items-center justify-center">
          {/* Ambient Warm Floor Glow */}
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Sad Brewie Mascot */}
          <motion.div
            animate={{
              y: [0, -3, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative z-10 w-36 h-36 flex items-center justify-center"
          >
            <svg viewBox="0 0 120 120" className="w-32 h-32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Spilled amber coffee puddle on floor */}
              <ellipse cx="60" cy="106" rx="42" ry="9" className="fill-amber-950/80 stroke-amber-600/40" strokeWidth="1.5" />
              <ellipse cx="56" cy="106" rx="24" ry="5" className="fill-amber-600/60" />
              <circle cx="28" cy="104" r="3" className="fill-amber-500/60" />
              <circle cx="94" cy="105" r="2" className="fill-amber-500/60" />

              {/* Tilted Cup Body */}
              <g transform="rotate(-12 60 60)">
                {/* Steam Swirl (Weak/Faded) */}
                <path d="M50 16C48 11 54 8 52 4" className="stroke-stone-600" strokeWidth="2" strokeLinecap="round" />
                <path d="M62 18C60 13 66 10 64 6" className="stroke-stone-600" strokeWidth="2" strokeLinecap="round" />

                {/* Cup Body */}
                <path
                  d="M30 36H90C90 68 76 88 60 88C44 88 30 68 30 36Z"
                  className="fill-amber-500 stroke-amber-300"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Cup Rim with Cream */}
                <ellipse cx="60" cy="36" rx="30" ry="8" className="fill-amber-100 stroke-amber-300" strokeWidth="3" />

                {/* Handle */}
                <path
                  d="M90 44C101 44 106 52 106 60C106 68 99 73 86 72"
                  className="stroke-amber-300 fill-transparent"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Sad Glossy Eyes (Watery Puppy Eyes) */}
                <ellipse cx="48" cy="56" rx="4.5" ry="5.5" className="fill-stone-950" />
                <ellipse cx="72" cy="56" rx="4.5" ry="5.5" className="fill-stone-950" />
                
                {/* Big glossy eye reflections */}
                <circle cx="49.5" cy="54" r="2" className="fill-white" />
                <circle cx="47" cy="58" r="1" className="fill-white" />
                <circle cx="73.5" cy="54" r="2" className="fill-white" />
                <circle cx="71" cy="58" r="1" className="fill-white" />

                {/* Sad Eyebrows slanted upwards */}
                <path d="M43 47C46 49 51 50 54 50" className="stroke-stone-900" strokeWidth="2" strokeLinecap="round" />
                <path d="M77 47C74 49 69 50 66 50" className="stroke-stone-900" strokeWidth="2" strokeLinecap="round" />

                {/* Sad Quivering Mouth */}
                <path d="M54 69C57 66 63 66 66 69" className="stroke-stone-950" strokeWidth="2.5" strokeLinecap="round" />

                {/* Sad Drooping Barista Bowtie */}
                <path d="M54 84L60 86L54 88Z" className="fill-stone-900" />
                <path d="M66 84L60 86L66 88Z" className="fill-stone-900" />
                <circle cx="60" cy="86" r="2" className="fill-stone-900" />
              </g>

              {/* Animated Falling Teardrops */}
              <motion.g
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, 16, 26] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeIn' }}
              >
                <path d="M42 62C40 65 44 68 44 68C44 68 48 65 46 62C44 59 44 59 42 62Z" className="fill-cyan-400" />
              </motion.g>

              <motion.g
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, 16, 26] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.9, ease: 'easeIn' }}
              >
                <path d="M76 64C74 67 78 70 78 70C78 70 82 67 80 64C78 61 78 61 76 64Z" className="fill-cyan-400" />
              </motion.g>
            </svg>
          </motion.div>
        </div>

        {/* Minimalist Editorial Status (No clunky enclosed capsule!) */}
        <p className="text-micro font-bold tracking-[0.2em] text-amber-400/90 uppercase mb-2">
          404 &bull; PAGE NOT FOUND
        </p>

        {/* Punchy Witty Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Oh Crema! We Spilled This Page.
        </h1>

        {/* Barista-Themed Subtitle */}
        <p className="text-body text-stone-400 mt-3 text-sm leading-relaxed max-w-md mx-auto">
          Even our master barista couldn&apos;t extract this recipe. The link might have moved or the grounds have settled, but fresh single-origin coffees and warm pastries are brewing right at our hot bar.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onBackToHome}
            className="btn-primary py-3 px-6 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-950/40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cafe Hot Bar</span>
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="py-3 px-5 rounded-full bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore Today&apos;s Menu</span>
          </button>
        </div>
      </div>
    </div>
  )
}
