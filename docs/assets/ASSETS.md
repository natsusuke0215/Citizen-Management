# Assets Directory

This directory contains static assets for the application.

## Structure

- `audio/` - Audio files for background music
  - `background-landing.mp3` - Background music for landing page, login, and register pages
  - `background-dashboard.mp3` - Background music for dashboard (after login)
- `images/` - Image files for backgrounds, logos, and icons
  - `backgrounds/` - Background images for pages
    - `login.jpg` - Login page background (optional)
    - `register.jpg` - Register page background (optional)
    - `landing.jpg` - Landing page background (optional)
  - `logos/` - Logo files
    - `logo.png` - Main system logo (optional)
  - `icons/` - Custom icons (optional)

## Usage

### Audio Files
Place your audio files in the respective directories. The files will be accessible at:
- `/assets/audio/background-landing.mp3`
- `/assets/audio/background-dashboard.mp3`

### Image Files
Place your image files in the respective directories. The system will automatically detect and use them:
- `/assets/images/backgrounds/login.jpg` - For login page background
- `/assets/images/backgrounds/register.jpg` - For register page background
- `/assets/images/backgrounds/landing.jpg` - For landing page background
- `/assets/images/logos/logo.png` - For system logo

## Supported Formats

### Audio
- MP3 (recommended)
- WAV
- OGG

### Images
- JPG/JPEG (recommended for photos)
- PNG (recommended for logos with transparency)
- WebP (best compression)
- SVG (for logos and icons)

## Notes

- MP3 is recommended for best browser compatibility
- Images will be automatically optimized by Next.js
- If images are not found, the system will use default gradient backgrounds
- Users can customize backgrounds through the UI (stored in localStorage)
- See `images/IMAGE_SETUP.md` for detailed image setup instructions

