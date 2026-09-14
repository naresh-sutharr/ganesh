/**
 * Devotional Audio Engine
 * Plays the OM Gan Ganpataye Namah track as background music.
 */

class DevotionalAudioEngine {
  private isPlaying = false;
  private isMuted = false;
  private bgAudio: HTMLAudioElement | null = null;

  public async startMusic() {
    if (this.isPlaying) return;
    
    if (!this.bgAudio) {
      this.bgAudio = new Audio('/om_gan.mp3');
      // Set to play continuously but we'll manually loop it 1 second early
      
      this.bgAudio.addEventListener('timeupdate', () => {
        if (this.bgAudio && this.bgAudio.duration) {
          // Loop 1.0 second before the actual end of the audio track
          if (this.bgAudio.currentTime >= this.bgAudio.duration - 1.0) {
            this.bgAudio.currentTime = 0;
            this.bgAudio.play().catch(() => {});
          }
        }
      });
    }

    this.isPlaying = true;
    this.isMuted = false;
    this.bgAudio.muted = false;
    this.bgAudio.volume = 1.0;

    try {
      await this.bgAudio.play();
    } catch (err) {
      console.warn("Background audio play failed:", err);
    }
  }

  public playTempleBell() {
    // Disabled
  }

  public playChime() {
    // Disabled
  }

  public toggleMute(): boolean {
    if (!this.bgAudio) return false;
    this.isMuted = !this.isMuted;
    this.bgAudio.muted = this.isMuted;
    return !this.isMuted;
  }

  public fadeOut() {
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
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
