/**
 * Luxury Apartment Property Gallery
 * Mobile-First, Touch-Optimized Interactive Viewer
 */

(function () {
  'use strict';

  // Define Media Items: 22 Original Photos + 1 Original Video Tour
  // Video is featured prominently as Slide 2 for immediate walkthrough access
  const mediaItems = [
    { type: 'image', src: './assets/apartment-image-1.jpg', title: 'Main Living Room / Entrance', id: 1 },
    { type: 'video', src: './assets/apartment-video.mp4', title: 'Full Property Video Tour', id: 'video' },
    { type: 'image', src: './assets/apartment-image-2.jpg', title: 'Living Space & Dining', id: 2 },
    { type: 'image', src: './assets/apartment-image-3.jpg', title: 'Interior Architecture', id: 3 },
    { type: 'image', src: './assets/apartment-image-4.jpg', title: 'Interior View', id: 4 },
    { type: 'image', src: './assets/apartment-image-5.jpg', title: 'Primary Suite / Bedroom', id: 5 },
    { type: 'image', src: './assets/apartment-image-6.jpg', title: 'Bedroom Perspective', id: 6 },
    { type: 'image', src: './assets/apartment-image-7.jpg', title: 'Room Finishes', id: 7 },
    { type: 'image', src: './assets/apartment-image-8.jpg', title: 'Guest Bedroom', id: 8 },
    { type: 'image', src: './assets/apartment-image-9.jpg', title: 'Bedroom Lighting', id: 9 },
    { type: 'image', src: './assets/apartment-image-10.jpg', title: 'Kitchen & Cabinetry', id: 10 },
    { type: 'image', src: './assets/apartment-image-11.jpg', title: 'Modern Kitchen Countertops', id: 11 },
    { type: 'image', src: './assets/apartment-image-12.jpg', title: 'Kitchen Details', id: 12 },
    { type: 'image', src: './assets/apartment-image-13.jpg', title: 'Bathroom / Vanity', id: 13 },
    { type: 'image', src: './assets/apartment-image-14.jpg', title: 'Bathroom Fixtures', id: 14 },
    { type: 'image', src: './assets/apartment-image-15.jpg', title: 'Tile & Finishes', id: 15 },
    { type: 'image', src: './assets/apartment-image-16.jpg', title: 'Hallway & Circulation', id: 16 },
    { type: 'image', src: './assets/apartment-image-17.jpg', title: 'Storage & Built-ins', id: 17 },
    { type: 'image', src: './assets/apartment-image-18.jpg', title: 'Window View & Daylight', id: 18 },
    { type: 'image', src: './assets/apartment-image-19.jpg', title: 'Balcony / Outdoor Area', id: 19 },
    { type: 'image', src: './assets/apartment-image-20.jpg', title: 'Balcony Perspective', id: 20 },
    { type: 'image', src: './assets/apartment-image-21.jpg', title: 'Exterior / Building View', id: 21 },
    { type: 'image', src: './assets/apartment-image-22.jpg', title: 'Property Detail', id: 22 }
  ];

  // DOM Elements
  const appEl = document.getElementById('gallery-app');
  const slidesTrack = document.getElementById('slides-track');
  const ambientBackdrop = document.getElementById('ambient-backdrop');
  const currentSlideEl = document.getElementById('current-slide');
  const totalSlidesEl = document.getElementById('total-slides');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const thumbnailsStrip = document.getElementById('thumbnails-strip');
  const swipeHint = document.getElementById('swipe-hint');
  
  // Header Actions
  const btnFitToggle = document.getElementById('btn-fit-toggle');
  const btnGridView = document.getElementById('btn-grid-view');
  const btnShare = document.getElementById('btn-share');
  
  // Tabs & Filter Buttons
  const tabAll = document.getElementById('tab-all');
  const tabPhotos = document.getElementById('tab-photos');
  const tabVideo = document.getElementById('tab-video');
  const btnInquire = document.getElementById('btn-inquire');
  
  // Modals
  const gridModal = document.getElementById('grid-modal');
  const btnCloseGrid = document.getElementById('btn-close-grid');
  const gridGallery = document.getElementById('grid-gallery');
  
  const contactModal = document.getElementById('contact-modal');
  const btnCloseContact = document.getElementById('btn-close-contact');
  const btnCopyLink = document.getElementById('btn-copy-link');
  
  const toast = document.getElementById('toast');

  // State Variables
  let currentIndex = 0;
  const totalItems = mediaItems.length;
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;
  let dragDiffX = 0;
  let isInteracted = false;
  let videoElement = null;

  // Initialize Gallery
  function initGallery() {
    totalSlidesEl.textContent = totalItems;
    renderSlides();
    renderThumbnails();
    renderGridModal();
    updateSlide(0, false);
    setupTouchGestures();
    setupEventListeners();
    
    // Auto-dismiss swipe hint after 4 seconds
    setTimeout(() => {
      dismissSwipeHint();
    }, 4000);
  }

  // Render Slides into Track
  function renderSlides() {
    slidesTrack.innerHTML = '';
    
    mediaItems.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('data-index', index);
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${item.title} (${index + 1} of ${totalItems})`);

      const slideInner = document.createElement('div');
      slideInner.className = 'slide-inner';

      if (item.type === 'video') {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'slide-video-container';

        // Video Badge
        const videoBadge = document.createElement('div');
        videoBadge.className = 'video-tour-badge';
        videoBadge.innerHTML = `
          <div class="video-pulse-dot"></div>
          <span class="video-badge-text">VIDEO TOUR</span>
        `;
        videoContainer.appendChild(videoBadge);

        // Native HTML5 Video Element
        const video = document.createElement('video');
        video.className = 'slide-video';
        video.src = item.src;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', 'Apartment Walkthrough Video Tour');
        
        // Ensure not autoplaying with sound
        video.autoplay = false;
        video.muted = false;

        videoElement = video;
        videoContainer.appendChild(video);
        slideInner.appendChild(videoContainer);
      } else {
        const img = document.createElement('img');
        img.className = 'slide-img';
        img.src = item.src;
        img.alt = `Apartment Photo ${item.id} - ${item.title}`;
        img.loading = index < 3 ? 'eager' : 'lazy';
        slideInner.appendChild(img);
      }

      slide.appendChild(slideInner);
      slidesTrack.appendChild(slide);
    });
  }

  // Render Thumbnail Bar
  function renderThumbnails() {
    thumbnailsStrip.innerHTML = '';
    
    mediaItems.forEach((item, index) => {
      const thumb = document.createElement('button');
      thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
      thumb.setAttribute('data-index', index);
      thumb.setAttribute('aria-label', `Go to slide ${index + 1}: ${item.title}`);

      if (item.type === 'video') {
        thumb.innerHTML = `
          <img class="thumb-img" src="./assets/apartment-image-1.jpg" alt="Video thumbnail">
          <div class="thumb-video-badge">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        `;
      } else {
        thumb.innerHTML = `<img class="thumb-img" src="${item.src}" alt="Thumb ${index + 1}" loading="lazy">`;
      }

      thumb.addEventListener('click', () => {
        dismissSwipeHint();
        goToSlide(index);
      });

      thumbnailsStrip.appendChild(thumb);
    });
  }

  // Render Grid View Modal
  function renderGridModal() {
    gridGallery.innerHTML = '';

    mediaItems.forEach((item, index) => {
      const gridItem = document.createElement('div');
      gridItem.className = 'grid-item';
      gridItem.setAttribute('data-index', index);
      gridItem.setAttribute('role', 'button');
      gridItem.setAttribute('tabindex', '0');
      gridItem.setAttribute('aria-label', `View ${item.title}`);

      if (item.type === 'video') {
        gridItem.innerHTML = `
          <img src="./assets/apartment-image-1.jpg" alt="Video preview" loading="lazy">
          <div class="grid-video-indicator">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>VIDEO TOUR</span>
          </div>
          <span class="grid-item-badge">#2 Video</span>
        `;
      } else {
        gridItem.innerHTML = `
          <img src="${item.src}" alt="Apartment Photo ${item.id}" loading="lazy">
          <span class="grid-item-badge">#${index + 1}</span>
        `;
      }

      const selectItem = () => {
        closeModal(gridModal);
        goToSlide(index);
      };

      gridItem.addEventListener('click', selectItem);
      gridItem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectItem();
        }
      });

      gridGallery.appendChild(gridItem);
    });
  }

  // Dismiss Swipe Hint
  function dismissSwipeHint() {
    if (!isInteracted && swipeHint) {
      isInteracted = true;
      swipeHint.classList.add('hidden');
    }
  }

  // Update Slide State
  function updateSlide(index, animate = true) {
    if (index < 0) {
      index = totalItems - 1;
    } else if (index >= totalItems) {
      index = 0;
    }

    const previousIndex = currentIndex;
    currentIndex = index;

    // Pause video if navigating away from video slide
    if (mediaItems[previousIndex] && mediaItems[previousIndex].type === 'video' && videoElement) {
      videoElement.pause();
    }

    // Apply Track Transform
    if (animate) {
      slidesTrack.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      slidesTrack.style.transition = 'none';
    }

    currentTranslateX = -currentIndex * 100;
    slidesTrack.style.transform = `translateX(${currentTranslateX}%)`;

    // Update Counter
    currentSlideEl.textContent = currentIndex + 1;

    // Update Ambient Glow Backdrop
    const currentItem = mediaItems[currentIndex];
    if (currentItem.type === 'video') {
      ambientBackdrop.style.backgroundImage = `url('./assets/apartment-image-1.jpg')`;
    } else {
      ambientBackdrop.style.backgroundImage = `url('${currentItem.src}')`;
    }

    // Update Active Thumbnail & Scroll into view
    const thumbs = thumbnailsStrip.querySelectorAll('.thumb-item');
    thumbs.forEach((th, idx) => {
      if (idx === currentIndex) {
        th.classList.add('active');
        th.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        th.classList.remove('active');
      }
    });

    // Update Quick Filter Tab Active States
    if (currentItem.type === 'video') {
      tabVideo.classList.add('active');
      tabPhotos.classList.remove('active');
      tabAll.classList.remove('active');
    } else {
      tabVideo.classList.remove('active');
      tabPhotos.classList.add('active');
      tabAll.classList.remove('active');
    }
  }

  function goToSlide(index) {
    updateSlide(index, true);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // Setup Mobile Touch Swipe Gestures
  function setupTouchGestures() {
    const viewport = document.getElementById('gallery-viewport');
    let startY = 0;
    let isHorizontalSwipe = false;
    let hasDeterminedDirection = false;

    viewport.addEventListener('touchstart', (e) => {
      // Don't interfere if user is tapping native video controls
      if (e.target.tagName.toLowerCase() === 'video' && e.target.controls) {
        return;
      }

      dismissSwipeHint();
      isDragging = true;
      hasDeterminedDirection = false;
      isHorizontalSwipe = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragDiffX = 0;
      slidesTrack.style.transition = 'none';
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Determine swipe axis on initial movement
      if (!hasDeterminedDirection) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          hasDeterminedDirection = true;
          isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      if (isHorizontalSwipe) {
        dragDiffX = diffX;
        // Calculate offset percentage relative to track width
        const trackWidth = viewport.clientWidth;
        const dragPercent = (dragDiffX / trackWidth) * 100;
        slidesTrack.style.transform = `translateX(${currentTranslateX + dragPercent}%)`;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      if (isHorizontalSwipe) {
        const threshold = 45; // Minimum drag distance in pixels
        if (dragDiffX < -threshold) {
          nextSlide();
        } else if (dragDiffX > threshold) {
          prevSlide();
        } else {
          // Snap back to current slide
          goToSlide(currentIndex);
        }
      }
      dragDiffX = 0;
    });

    viewport.addEventListener('touchcancel', () => {
      if (isDragging) {
        isDragging = false;
        goToSlide(currentIndex);
      }
    });

    // Also support desktop mouse drag
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseDiffX = 0;

    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.tagName.toLowerCase() === 'video') return;
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseDiffX = 0;
      slidesTrack.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      mouseDiffX = e.clientX - mouseStartX;
      const trackWidth = viewport.clientWidth;
      const dragPercent = (mouseDiffX / trackWidth) * 100;
      slidesTrack.style.transform = `translateX(${currentTranslateX + dragPercent}%)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const threshold = 50;
      if (mouseDiffX < -threshold) {
        nextSlide();
      } else if (mouseDiffX > threshold) {
        prevSlide();
      } else {
        goToSlide(currentIndex);
      }
      mouseDiffX = 0;
    });
  }

  // Setup UI Event Listeners
  function setupEventListeners() {
    // Prev / Next Buttons
    btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissSwipeHint();
      prevSlide();
    });

    btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissSwipeHint();
      nextSlide();
    });

    // Fit/Fill Toggle
    btnFitToggle.addEventListener('click', () => {
      const isFill = appEl.classList.toggle('fill-mode');
      btnFitToggle.classList.toggle('active', isFill);
      showToast(isFill ? 'Fill mode: Edge-to-edge' : 'Fit mode: Full view');
    });

    // Grid View Modal Controls
    btnGridView.addEventListener('click', () => {
      openModal(gridModal);
    });

    btnCloseGrid.addEventListener('click', () => {
      closeModal(gridModal);
    });

    gridModal.addEventListener('click', (e) => {
      if (e.target === gridModal) {
        closeModal(gridModal);
      }
    });

    // Share Button
    btnShare.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Apartment Tour | Exclusive Property Gallery',
            text: 'Take a virtual tour of this luxury residence with high-res photos and video walkthrough.',
            url: window.location.href
          });
        } catch (err) {
          // User cancelled or share failed, fallback to copy
          copyPageUrl();
        }
      } else {
        copyPageUrl();
      }
    });

    // Inquire Button & Modal
    btnInquire.addEventListener('click', () => {
      openModal(contactModal);
    });

    btnCloseContact.addEventListener('click', () => {
      closeModal(contactModal);
    });

    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal(contactModal);
      }
    });

    // Copy Link Button in Modal
    btnCopyLink.addEventListener('click', () => {
      copyPageUrl();
    });

    // Quick Tabs Navigation
    tabAll.addEventListener('click', () => {
      tabAll.classList.add('active');
      tabPhotos.classList.remove('active');
      tabVideo.classList.remove('active');
      goToSlide(0);
    });

    tabPhotos.addEventListener('click', () => {
      // Jump to first photo
      const photoIndex = mediaItems.findIndex(item => item.type === 'image');
      if (photoIndex !== -1) goToSlide(photoIndex);
    });

    tabVideo.addEventListener('click', () => {
      // Jump to video tour
      const videoIndex = mediaItems.findIndex(item => item.type === 'video');
      if (videoIndex !== -1) goToSlide(videoIndex);
    });

    // Desktop Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      // Close modal on Escape
      if (e.key === 'Escape') {
        if (gridModal.classList.contains('open')) closeModal(gridModal);
        if (contactModal.classList.contains('open')) closeModal(contactModal);
        return;
      }

      // If a modal is open, ignore arrow shortcuts
      if (gridModal.classList.contains('open') || contactModal.classList.contains('open')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        dismissSwipeHint();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        dismissSwipeHint();
        nextSlide();
      } else if (e.key === ' ' && mediaItems[currentIndex].type === 'video' && videoElement) {
        // Spacebar to toggle video playback
        e.preventDefault();
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }
    });
  }

  // Modal Helpers
  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Toast Notification Helper
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Copy Link Helper
  function copyPageUrl() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Listing link copied to clipboard!');
      }).catch(() => {
        fallbackCopyText(url);
      });
    } else {
      fallbackCopyText(url);
    }
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Listing link copied to clipboard!');
    } catch (e) {
      showToast('Copy URL from your browser address bar.');
    }
    document.body.removeChild(tempInput);
  }

  // Start the application when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }

})();
