// ============================================================
// BrewHub Artisanal Cafe Ambience Synthesizer
// Generates soothing cafe background ambience using Web Audio API
// (Soft rain against cafe glass + warm espresso machine hum & percolation)
// Zero external audio files, 100% offline-ready, 0ms latency.
// ============================================================

class CafeAmbienceEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private isPlaying: boolean = false
  private dripTimer: number | null = null

  public init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new AudioCtx()
  }

  public toggle(): boolean {
    if (!this.isPlaying) {
      this.play()
      return true
    } else {
      this.pause()
      return false
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }

  public play() {
    this.init()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // Master Gain for smooth crossfade
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime)
    this.masterGain.gain.exponentialRampToValueAtTime(0.22, this.ctx.currentTime + 1.2)
    this.masterGain.connect(this.ctx.destination)

    // 1. Soft Rain on Glass (Pink Noise Generator)
    const bufferSize = this.ctx.sampleRate * 2
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04
      b6 = white * 0.115926
    }

    const whiteNoise = this.ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer
    whiteNoise.loop = true

    // Lowpass filter for cozy muffled rain ambience
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(420, this.ctx.currentTime)
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime)

    whiteNoise.connect(filter)
    filter.connect(this.masterGain)
    whiteNoise.start()

    // 2. Warm Espresso Baritone Hum (60Hz / 120Hz subtle cafe body)
    const osc1 = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(64, this.ctx.currentTime)
    oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime)
    osc1.connect(oscGain)
    oscGain.connect(this.masterGain)
    osc1.start()

    // 3. Gentle Warm Coffee Drops (random delicate drips every 4-8s)
    const scheduleDrip = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return
      const dripOsc = this.ctx.createOscillator()
      const dripGain = this.ctx.createGain()
      dripOsc.type = 'sine'
      dripOsc.frequency.setValueAtTime(620 + Math.random() * 180, this.ctx.currentTime)
      dripOsc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.12)

      dripGain.gain.setValueAtTime(0.02, this.ctx.currentTime)
      dripGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15)

      dripOsc.connect(dripGain)
      dripGain.connect(this.masterGain)
      dripOsc.start()
      dripOsc.stop(this.ctx.currentTime + 0.16)

      const nextDelay = 3500 + Math.random() * 4500
      this.dripTimer = window.setTimeout(scheduleDrip, nextDelay)
    }

    this.isPlaying = true
    scheduleDrip()
  }

  public pause() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return
    this.isPlaying = false

    if (this.dripTimer) {
      clearTimeout(this.dripTimer)
      this.dripTimer = null
    }

    // Smooth fade out over 600ms
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.6)

    setTimeout(() => {
      if (this.ctx && !this.isPlaying) {
        this.ctx.suspend()
      }
    }, 650)
  }
}

export const cafeAmbience = new CafeAmbienceEngine()
