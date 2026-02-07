'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { audioManager } from '@/lib/audioManager'

interface VolumeControlProps {
  storageKey: string
  initialVolume?: number
}

export default function VolumeControl({ 
  storageKey,
  initialVolume = 0.3 
}: VolumeControlProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentVolume, setCurrentVolume] = useState(initialVolume)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load saved preferences from localStorage
    let savedPlaying = true
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

    setIsPlaying(savedPlaying)
    setCurrentVolume(savedVolume)
  }, [storageKey, initialVolume])

  const togglePlay = () => {
    if (!audioManager) return
    
    const audio = audioManager.getAudio(storageKey)
    if (!audio) return
    
    const newState = !isPlaying
    setIsPlaying(newState)
    
    if (newState) {
      audio.play()
        .then(() => {
          audioManager.setCurrentPlaying(storageKey)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    } else {
      audio.pause()
    }
    
    try {
      localStorage.setItem(`${storageKey}_playing`, newState.toString())
    } catch (e) {
      // ignore
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setCurrentVolume(newVolume)
    
    if (!audioManager) return
    const audio = audioManager.getAudio(storageKey)
    if (!audio) return
    
    audio.volume = newVolume
    
    if (newVolume === 0) {
      setIsPlaying(false)
      audio.pause()
    } else if (!isPlaying && newVolume > 0) {
      setIsPlaying(true)
      audio.play()
        .then(() => {
          audioManager.setCurrentPlaying(storageKey)
        })
        .catch(() => {
          setIsPlaying(false)
        })
    }
    
    try {
      localStorage.setItem(`${storageKey}_volume`, newVolume.toString())
    } catch (e) {
      // ignore
    }
  }

  const handleButtonClick = () => {
    if (currentVolume === 0) {
      handleVolumeChange(initialVolume)
      setIsPlaying(true)
    } else {
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
    }, 500)
  }

  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleButtonClick}
        className={`p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[8px] transition-all duration-200 ${
          currentVolume === 0 || !isPlaying 
            ? 'opacity-50' 
            : ''
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
          className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[8px] shadow-drop-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 z-50"
          onMouseEnter={() => {
            if (volumeTimeoutRef.current) {
              clearTimeout(volumeTimeoutRef.current)
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <VolumeX className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
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
          <Volume2 className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-10 text-right">
            {Math.round(currentVolume * 100)}%
          </span>
        </div>
      )}
    </div>
  )
}

