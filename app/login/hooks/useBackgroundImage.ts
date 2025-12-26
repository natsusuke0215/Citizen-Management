import { useState, useEffect, useMemo } from 'react'

export function useBackgroundImage() {
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [defaultBgImage, setDefaultBgImage] = useState<string | null>(null)

  useEffect(() => {
    // Load persisted background from localStorage if present (has highest priority)
    try {
      const stored = localStorage.getItem('loginBackground')
      if (stored) {
        setBgImage(stored)
        return // User custom image takes priority
      }
    } catch (e) {
      // ignore
    }

    // Try to load default background image from assets
    const checkDefaultImage = () => {
      // Try different image formats in order
      const formats = ['jpg', 'jpeg', 'png', 'webp']
      let formatIndex = 0
      
      const tryNextFormat = () => {
        if (formatIndex >= formats.length) return
        
        const img = new Image()
        const format = formats[formatIndex]
        img.src = `/assets/images/backgrounds/login.${format}`
        
        img.onload = () => {
          setDefaultBgImage(img.src)
        }
        
        img.onerror = () => {
          formatIndex++
          tryNextFormat()
        }
      }
      
      tryNextFormat()
    }
    
    checkDefaultImage()
  }, [])

  const backgroundStyle = useMemo(() => {
    const imageUrl = bgImage || defaultBgImage
    return {
      backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
      backgroundSize: 'cover' as const,
      backgroundPosition: 'center' as const,
      backgroundRepeat: 'no-repeat' as const
    }
  }, [bgImage, defaultBgImage])

  const hasCustomImage = !!bgImage
  const hasAnyImage = !!(bgImage || defaultBgImage)

  return {
    backgroundStyle,
    hasCustomImage,
    hasAnyImage,
    setBgImage
  }
}

