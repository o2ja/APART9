# Luxury Apartment Property Gallery

A modern, mobile-first property gallery website designed for real-estate showings and QR code access.

## Features
- **High-Definition Media**: 22 original apartment photos + 1 original video walkthrough tour.
- **Mobile-First & Touch-Optimized**: Smooth touch swipe gestures with finger tracking and momentum.
- **Dark Luxury Interface**: Frosted glassmorphism, ambient room lighting backdrops, and gold accents.
- **Video Walkthrough**: Featured on Slide 2 with native controls, fullscreen support, and auto-pause on slide change.
- **Interactive Scrubber**: Scrollable thumbnail strip and quick jump tabs (`All Media`, `Photos`, `Video Tour`).
- **Full Grid View**: Instant overview modal of all property media.
- **QR Lead Generation**: 1-tap WhatsApp inquiry modal and direct link sharing.
- **Deploy Anywhere**: Pure static files ready for direct deployment to Vercel or GitHub Pages.

## Project Structure
```
/
├── index.html       # HTML5 structure
├── style.css        # Luxury dark styling & responsive breakpoints
├── app.js           # Gallery engine & touch gesture handlers
├── vercel.json      # Vercel static deployment & caching configuration
└── assets/          # 22 property photos and walkthrough video
```

## Deployment
### Vercel
1. Import this repository into [Vercel](https://vercel.com/new).
2. Deploy without any additional build configuration.

### GitHub Pages
1. Go to **Settings** > **Pages** in this GitHub repository.
2. Select **Deploy from a branch** and choose `main` branch `/ (root)`.
