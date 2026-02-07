'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { audioManager } from '@/lib/audioManager'

interface AudioPlayerProps {
  src: string
  storageKey: string
  loop?: boolean
  volume?: number
  hideUI?: boolean
}

export default function AudioPlayer({ 
  src, 
  storageKey, 
  loop = true, 
  volume: initialVolume = 0.3,
  hideUI = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true) // Default to playing
  const [currentVolume, setCurrentVolume] = useState(initialVolume)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInteractedRef = useRef(false)

  useEffect(() => {
    if (!audioManager) return

    // Stop other music if switching to different music (e.g., landing -> dashboard)
    const currentPlaying = audioManager.getCurrentPlaying()
    if (currentPlaying && currentPlaying !== storageKey) {
      audioManager.stop(currentPlaying)
    }

    // Load saved preferences from localStorage
    let savedPlaying = true // Default to playing
    let savedVolume = initialVolume
    
    try {
      const savedPlayingPref = localStorage.getItem(`${storageKey}_playing`)
      if (savedPlayingPref !== null) {
        savedPlaying = savedPlayingPref === 'true'
      }
      
      const savedVolumePref = localStorage.getItem(`${storageKey}_volume`)
      if (savedVolumePref !== null) {
        const vol = parseFloat(savedVolumePref)
        if (!isNaN(vol) && vol >= 0 && vol <= 1) {
          savedVolume = vol
        }
      }
    } catch (e) {
      // ignore
    }

    // Set initial state
    setIsPlaying(savedPlaying)
    setCurrentVolume(savedVolume)

    // Get or create audio element from manager
    const audio = audioManager.getOrCreateAudio(src, storageKey)
    audio.loop = loop
    audio.volume = savedVolume
    audioRef.current = audio

    // Handle audio events
    const handleEnded = () => {
      if (!loop) {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('ended', handleEnded)

    // Check if this audio is already playing (from previous page)
    const wasPlaying = !audio.paused && audio.currentTime > 0
    
    if (wasPlaying) {
      // Audio is already playing from previous page, sync state
      setIsPlaying(true)
      hasInteractedRef.current = true
      audioManager.setCurrentPlaying(storageKey)
    } else {
      // Auto-play by default
      if (savedPlaying) {
        // Try to play immediately
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              audioManager.setCurrentPlaying(storageKey)
              setIsPlaying(true)
              hasInteractedRef.current = true
            })
            .catch(() => {
              // Auto-play might be blocked by browser
              setIsPlaying(false)
              // Try again after user interaction
              const handleUserInteraction = () => {
                if (!hasInteractedRef.current && savedPlaying) {
                  audio.play()
                    .then(() => {
                      audioManager.setCurrentPlaying(storageKey)
                      setIsPlaying(true)
                      hasInteractedRef.current = true
                    })
                    .catch(() => {})
                }
              }
              // Try on any user interaction
              const events = ['click', 'touchstart', 'keydown']
              events.forEach(event => {
                document.addEventListener(event, handleUserInteraction, { once: true })
              })
            })
        }
      }
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
      // Don't cleanup audio on unmount if it's still playing - keep it for page transitions
    }
  }, [src, loop, storageKey, initialVolume])

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false)
      })
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = currentVolume
    try {
      localStorage.setItem(`${storageKey}_volume`, currentVolume.toString())
    } catch (e) {
      // ignore
    }
  }, [currentVolume, storageKey])

  const togglePlay = () => {
    if (!audioRef.current) return
    
    const newState = !isPlaying
    setIsPlaying(newState)
    hasInteractedRef.current = true
    
    if (newState) {
      audioRef.current.play()
        .then(() => {
          if (audioManager) {
            audioManager.setCurrentPlaying(storageKey)
          }
        })
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      audioRef.current.pause()
    }
    
    try {
      localStorage.setItem(`${storageKey}_playing`, newState.toString())
    } catch (e) {
      // ignore
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume)
    if (!audioRef.current) return
    
    if (newVolume === 0) {
      // If volume is 0, pause the audio
      setIsPlaying(false)
      audioRef.current.pause()
    } else if (!isPlaying && newVolume > 0) {
      // If volume is increased from 0, resume playing
      setIsPlaying(true)
      hasInteractedRef.current = true
      audioRef.current.play()
        .then(() => {
          if (audioManager) {
            audioManager.setCurrentPlaying(storageKey)
          }
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }

  const handleButtonClick = () => {
    if (currentVolume === 0) {
      // If muted, unmute and play
      handleVolumeChange(initialVolume)
      setIsPlaying(true)
    } else {
      // Toggle play/pause
      togglePlay()
    }
  }

  const handleMouseEnter = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    setShowVolumeSlider(true)
  }

  const handleMouseLeave = () => {
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolumeSlider(false)
    }, 500) // Increased delay to make it easier to interact with slider
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current)
      }
    }
  }, [])

  // Hide UI if hideUI prop is true
  if (hideUI) {
    return null
  }

  return (
    <div 
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Combined Play/Pause/Volume Button */}
      <div className="relative flex items-center">
        <button
          onClick={handleButtonClick}
          className={`p-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-drop hover:shadow-drop-lg focus:outline-none transition-all duration-200 ${
            currentVolume === 0 || !isPlaying 
              ? 'text-gray-400 hover:text-gray-600' 
              : 'text-navy-1 hover:bg-navy-1 hover:text-white'
          }`}
          title={
            currentVolume === 0 
              ? 'Bật âm thanh' 
              : isPlaying 
                ? 'Tắt nhạc nền' 
                : 'Bật nhạc nền'
          }
        >
          {currentVolume === 0 || !isPlaying ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>

        {/* Volume Slider - Shows on hover */}
        {showVolumeSlider && (
          <div 
            className="ml-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-[8px] shadow-drop-lg px-4 py-3 flex items-center gap-3 transition-all duration-200"
            onMouseEnter={() => {
              if (volumeTimeoutRef.current) {
                clearTimeout(volumeTimeoutRef.current)
              }
            }}
            onMouseLeave={handleMouseLeave}
          >
            <VolumeX className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="relative w-28">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer volume-slider"
                style={{
                  background: `linear-gradient(to right, #516089 0%, #516089 ${currentVolume * 100}%, #e5e7eb ${currentVolume * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>
            <Volume2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 w-10 text-right">
              {Math.round(currentVolume * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

