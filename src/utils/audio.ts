/**
 * Devotional Audio Engine
 * Plays the OM Gan Ganpataye Namah track as background music.
 * Uses Web Audio API for interactive sound effects (temple bells, chimes).
 */

class DevotionalAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private isMuted = false;
  private reverbNode: ConvolverNode | null = null;
  
  private bgAudio: HTMLAudioElement | null = null;
  private bgAudioSource: MediaElementAudioSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.6, this.ctx.currentTime); // Base volume for background music
      this.masterGain.connect(this.ctx.destination);

      this.createReverb();
      this.initBackgroundMusic();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initBackgroundMusic() {
    if (!this.ctx || !this.masterGain) return;
    
    this.bgAudio = new Audio('/om_gan.mp3');
    this.bgAudio.loop = true;
    this.bgAudio.crossOrigin = 'anonymous';
    
    this.bgAudioSource = this.ctx.createMediaElementSource(this.bgAudio);
    
    // Connect background audio through a slight gain reduction so sound effects stand out
    const bgGain = this.ctx.createGain();
    bgGain.gain.value = 0.8;
    this.bgAudioSource.connect(bgGain);
    bgGain.connect(this.masterGain);
  }

  private createReverb() {
    if (!this.ctx || !this.masterGain) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 2.8; // 2.8 sec lush impulse
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const decay = Math.exp(-i / (sampleRate * 0.9));
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }

    this.reverbNode = this.ctx.createConvolver();
    this.reverbNode.buffer = impulse;

    const reverbGain = this.ctx.createGain();
    reverbGain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    this.reverbNode.connect(reverbGain);
    reverbGain.connect(this.masterGain);
  }

  public async startMusic() {
    this.initContext();
    if (!this.ctx || !this.masterGain || !this.bgAudio) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isMuted = false;

    // Smooth cinematic fade-in
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.6, now + 2.5);

    try {
      await this.bgAudio.play();
    } catch (err) {
      console.warn("Background audio play failed, likely due to browser autoplay policy:", err);
    }
  }

  // Authentic synthesized Temple Bell (Ghantha) on interactions
  public playTempleBell() {
    // Disabled as requested: Only om_gan background track should play.
  }

  public playChime() {
    // Disabled as requested: Only om_gan background track should play.
  }

  public toggleMute(): boolean {
    if (!this.ctx || !this.masterGain) return false;
    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    if (this.isMuted) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    } else {
      this.masterGain.gain.exponentialRampToValueAtTime(0.6, now + 0.4);
    }
    return !this.isMuted;
  }

  public fadeOut() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
  }

  public stop() {
    this.isPlaying = false;
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio.currentTime = 0;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const devotionalAudio = new DevotionalAudioEngine();
