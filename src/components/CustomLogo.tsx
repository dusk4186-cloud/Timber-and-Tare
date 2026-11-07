export function CustomLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3 shrink-0 whitespace-nowrap group cursor-pointer">
      {/* Handcrafted Timber & Tare Artisanal Seal */}
      <div
        className={`${className} relative flex items-center justify-center shrink-0 rounded-full shadow-md shadow-amber-950/30 group-hover:scale-105 group-hover:shadow-amber-500/25 transition-all duration-300 overflow-hidden`}
      >
        <img
          src="/images/timber_tare_seal.png"
          alt=""
          role="presentation"
          className="w-full h-full object-contain filter drop-shadow-sm"
          loading="eager"
        />
      </div>

      {/* Typography: Stays on a single solid line with zero wrap */}
      <div className="flex flex-col select-none shrink-0 whitespace-nowrap">
        <div className="flex items-center gap-1.5 leading-none whitespace-nowrap">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#c5832b] brand-timber-text group-hover:text-amber-400 transition-colors font-serif whitespace-nowrap">
            TIMBER
          </span>
          <span className="text-xl sm:text-2xl font-black tracking-tight brand-tare-text text-stone-100 group-hover:text-amber-400 transition-colors font-serif whitespace-nowrap">
            &amp; TARE
          </span>
        </div>
        <span 
          aria-hidden="true"
          className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.22em] text-stone-400 font-mono font-medium mt-1 whitespace-nowrap"
        >
          SLOW CRAFT COFFEE &bull; BENGALURU
        </span>
      </div>
    </div>
  )
}
