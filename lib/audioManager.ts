// Global audio manager to maintain audio continuity across page navigation

class AudioManager {
  private audioInstances: Map<string, HTMLAudioElement> = new Map()
  private currentPlayingKey: string | null = null

  getOrCreateAudio(src: string, key: string): HTMLAudioElement {
    // If we already have an audio instance for this key, return it
    if (this.audioInstances.has(key)) {
      return this.audioInstances.get(key)!
    }

    // Create new audio instance
    const audio = new Audio(src)
    this.audioInstances.set(key, audio)
    return audio
  }

  getAudio(key: string): HTMLAudioElement | undefined {
    return this.audioInstances.get(key)
  }

  stopAll() {
    this.audioInstances.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  stop(key: string) {
    const audio = this.audioInstances.get(key)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  setCurrentPlaying(key: string | null) {
    this.currentPlayingKey = key
  }

  getCurrentPlaying(): string | null {
    return this.currentPlayingKey
  }

  cleanup(key: string) {
    const audio = this.audioInstances.get(key)
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    this.audioInstances.delete(key)
    if (this.currentPlayingKey === key) {
      this.currentPlayingKey = null
    }
  }
}

// Singleton instance
export const audioManager = typeof window !== 'undefined' ? new AudioManager() : null

