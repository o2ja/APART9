/**
 * Apartment 9 - Property Gallery
 * Clean Navy & White Design with Enhanced Video Seeking & 5s Skip Controls
 */

(function () {
  'use strict';

  // 22 Original Photos + 1 Original Walkthrough Video (as Slide 2)
  const mediaItems = [
    { type: 'image', src: './assets/apartment-image-1.jpg', title: 'Apartment 9', id: 1 },
    { type: 'video', src: './assets/apartment-video.mp4', title: 'Video Tour', id: 'video' },
    { type: 'image', src: './assets/apartment-image-2.jpg', title: 'Living Space', id: 2 },
    { type: 'image', src: './assets/apartment-image-3.jpg', title: 'Interior', id: 3 },
    { type: 'image', src: './assets/apartment-image-4.jpg', title: 'Interior View', id: 4 },
    { type: 'image', src: './assets/apartment-image-5.jpg', title: 'Primary Bedroom', id: 5 },
    { type: 'image', src: './assets/apartment-image-6.jpg', title: 'Bedroom', id: 6 },
    { type: 'image', src: './assets/apartment-image-7.jpg', title: 'Bedroom Detail', id: 7 },
    { type: 'image', src: './assets/apartment-image-8.jpg', title: 'Guest Bedroom', id: 8 },
    { type: 'image', src: './assets/apartment-image-9.jpg', title: 'Room View', id: 9 },
    { type: 'image', src: './assets/apartment-image-10.jpg', title: 'Kitchen', id: 10 },
    { type: 'image', src: './assets/apartment-image-11.jpg', title: 'Kitchen Counter', id: 11 },
    { type: 'image', src: './assets/apartment-image-12.jpg', title: 'Kitchen View', id: 12 },
    { type: 'image', src: './assets/apartment-image-13.jpg', title: 'Bathroom', id: 13 },
    { type: 'image', src: './assets/apartment-image-14.jpg', title: 'Bathroom Details', id: 14 },
    { type: 'image', src: './assets/apartment-image-15.jpg', title: 'Finishes', id: 15 },
    { type: 'image', src: './assets/apartment-image-16.jpg', title: 'Hallway', id: 16 },
    { type: 'image', src: './assets/apartment-image-17.jpg', title: 'Built-ins', id: 17 },
    { type: 'image', src: './assets/apartment-image-18.jpg', title: 'Daylight View', id: 18 },
    { type: 'image', src: './assets/apartment-image-19.jpg', title: 'Balcony', id: 19 },
    { type: 'image', src: './assets/apartment-image-20.jpg', title: 'Balcony View', id: 20 },
    { type: 'image', src: './assets/apartment-image-21.jpg', title: 'Exterior', id: 21 },
    { type: 'image', src: './assets/apartment-image-22.jpg', title: 'Detail', id: 22 }
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
  
  // Tabs
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

  // State
  let currentIndex = 0;
  const totalItems = mediaItems.length;
  let isDragging = false;
  let startX = 0;
  let currentTranslateX = 0;
  let dragDiffX = 0;
  let isInteracted = false;
  let videoElement = null;
  let isScrubbing = false;

  // Initialize
  function initGallery() {
    totalSlidesEl.textContent = totalItems;
    renderSlides();
    renderThumbnails();
    renderGridModal();
    updateSlide(0, false);
    setupTouchGestures();
    setupEventListeners();
    
    setTimeout(() => {
      dismissSwipeHint();
    }, 4000);
  }

  // Helper: Format Time in M:SS
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Render Slides
  function renderSlides() {
    slidesTrack.innerHTML = '';
    
    mediaItems.forEach((item, index) => {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('data-index', index);
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', `Apartment 9 - ${item.title} (${index + 1} of ${totalItems})`);

      const slideInner = document.createElement('div');
      slideInner.className = 'slide-inner';

      if (item.type === 'video') {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'slide-video-container';

        // Badge
        const videoBadge = document.createElement('div');
        videoBadge.className = 'video-pill-badge';
        videoBadge.textContent = 'VIDEO TOUR';
        videoContainer.appendChild(videoBadge);

        // Video
        const video = document.createElement('video');
        video.className = 'slide-video';
        video.src = item.src;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', 'Apartment 9 Video Tour');
        video.autoplay = false;
        video.muted = false;
        videoElement = video;
        videoContainer.appendChild(video);

        // Custom Video Controls with 5-Second Skip & Scrubber
        const customControls = document.createElement('div');
        customControls.className = 'video-custom-controls';
        customControls.innerHTML = `
          <div class="video-progress-wrap">
            <input type="range" class="video-scrubber" id="video-scrubber" min="0" max="100" step="0.1" value="0" aria-label="Seek Video">
            <span class="video-time" id="video-time-display">0:00 / 0:00</span>
          </div>
          <div class="video-actions-row">
            <div class="video-left-actions">
              <button class="v-btn v-btn-play" id="btn-v-play" aria-label="Play or Pause">
                <svg id="v-icon-play" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span id="v-play-label">Play</span>
              </button>
              <button class="v-btn v-btn-skip" id="btn-v-skip-back" title="Rewind 5 Seconds" aria-label="Rewind 5 Seconds">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
                <span>-5s</span>
              </button>
              <button class="v-btn v-btn-skip" id="btn-v-skip-fwd" title="Skip 5 Seconds" aria-label="Skip 5 Seconds">
                <span>+5s</span>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </button>
            </div>
            <div class="video-right-actions">
              <button class="v-btn" id="btn-v-mute" aria-label="Mute or Unmute">
                <svg id="v-icon-sound" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
              </button>
              <button class="v-btn" id="btn-v-fullscreen" aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
        videoContainer.appendChild(customControls);
        slideInner.appendChild(videoContainer);

        // Setup Video Controls Event Handlers
        setupVideoControls(video, customControls);

      } else {
        const img = document.createElement('img');
        img.className = 'slide-img';
        img.src = item.src;
        img.alt = `Apartment 9 - Photo ${item.id}`;
        img.loading = index < 3 ? 'eager' : 'lazy';
        slideInner.appendChild(img);
      }

      slide.appendChild(slideInner);
      slidesTrack.appendChild(slide);
    });
  }

  // Setup Enhanced Video Player Handlers
  function setupVideoControls(video, controlsWrap) {
    const playBtn = controlsWrap.querySelector('#btn-v-play');
    const playIcon = controlsWrap.querySelector('#v-icon-play');
    const playLabel = controlsWrap.querySelector('#v-play-label');
    const skipBackBtn = controlsWrap.querySelector('#btn-v-skip-back');
    const skipFwdBtn = controlsWrap.querySelector('#btn-v-skip-fwd');
    const scrubber = controlsWrap.querySelector('#video-scrubber');
    const timeDisplay = controlsWrap.querySelector('#video-time-display');
    const muteBtn = controlsWrap.querySelector('#btn-v-mute');
    const fsBtn = controlsWrap.querySelector('#btn-v-fullscreen');

    // Prevent any click or touch within video controls from triggering slide gestures
    controlsWrap.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
    controlsWrap.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
    controlsWrap.addEventListener('mousedown', (e) => e.stopPropagation());

    // Toggle Play/Pause
    function togglePlay() {
      if (video.paused || video.ended) {
        video.play();
      } else {
        video.pause();
      }
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });

    video.addEventListener('play', () => {
      playLabel.textContent = 'Pause';
      playIcon.innerHTML = `
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      `;
    });

    video.addEventListener('pause', () => {
      playLabel.textContent = 'Play';
      playIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
    });

    // Skip 5 Seconds Back
    skipBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(0, video.currentTime - 5);
      showToast('Rewind 5s');
    });

    // Skip 5 Seconds Forward
    skipFwdBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTime = Math.min(video.duration || 9999, video.currentTime + 5);
      video.currentTime = targetTime;
      showToast('Forward 5s');
    });

    // Scrubber / Seek Tracking
    scrubber.addEventListener('input', () => {
      isScrubbing = true;
      if (video.duration) {
        const seekTime = (scrubber.value / 100) * video.duration;
        timeDisplay.textContent = `${formatTime(seekTime)} / ${formatTime(video.duration)}`;
      }
    });

    scrubber.addEventListener('change', () => {
      if (video.duration) {
        video.currentTime = (scrubber.value / 100) * video.duration;
      }
      isScrubbing = false;
    });

    // Update Scrubber on Playback
    video.addEventListener('timeupdate', () => {
      if (!isScrubbing && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        scrubber.value = percent;
        timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      }
    });

    video.addEventListener('loadedmetadata', () => {
      timeDisplay.textContent = `0:00 / ${formatTime(video.duration)}`;
    });

    // Mute Toggle
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.style.opacity = video.muted ? '0.5' : '1';
    });

    // Fullscreen Toggle
    fsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // iOS
        }
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Render Thumbnails
  function renderThumbnails() {
    thumbnailsStrip.innerHTML = '';
    
    mediaItems.forEach((item, index) => {
      const thumb = document.createElement('button');
      thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
      thumb.setAttribute('data-index', index);
      thumb.setAttribute('aria-label', `Slide ${index + 1}`);

      if (item.type === 'video') {
        thumb.innerHTML = `
          <img class="thumb-img" src="./assets/apartment-image-1.jpg" alt="Video thumbnail">
          <div class="thumb-video-badge">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        `;
      } else {
        thumb.innerHTML = `<img class="thumb-img" src="${item.src}" alt="Photo ${index + 1}" loading="lazy">`;
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

      if (item.type === 'video') {
        gridItem.innerHTML = `
          <img src="./assets/apartment-image-1.jpg" alt="Video preview" loading="lazy">
          <div class="grid-video-indicator">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <span>VIDEO</span>
          </div>
          <span class="grid-item-badge">#2 Video</span>
        `;
      } else {
        gridItem.innerHTML = `
          <img src="${item.src}" alt="Photo ${item.id}" loading="lazy">
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

    // Pause video when leaving video slide
    if (mediaItems[previousIndex] && mediaItems[previousIndex].type === 'video' && videoElement) {
      videoElement.pause();
    }

    if (animate) {
      slidesTrack.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      slidesTrack.style.transition = 'none';
    }

    currentTranslateX = -currentIndex * 100;
    slidesTrack.style.transform = `translateX(${currentTranslateX}%)`;

    // Counter
    currentSlideEl.textContent = currentIndex + 1;

    // Ambient Backdrop
    const currentItem = mediaItems[currentIndex];
    if (currentItem.type === 'video') {
      ambientBackdrop.style.backgroundImage = `url('./assets/apartment-image-1.jpg')`;
    } else {
      ambientBackdrop.style.backgroundImage = `url('${currentItem.src}')`;
    }

    // Thumbnails
    const thumbs = thumbnailsStrip.querySelectorAll('.thumb-item');
    thumbs.forEach((th, idx) => {
      if (idx === currentIndex) {
        th.classList.add('active');
        th.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        th.classList.remove('active');
      }
    });

    // Quick Tabs
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

  // Setup Mobile Touch Swiping - Isolated from video scrubbing
  function setupTouchGestures() {
    const viewport = document.getElementById('gallery-viewport');
    let startY = 0;
    let isHorizontalSwipe = false;
    let hasDeterminedDirection = false;

    viewport.addEventListener('touchstart', (e) => {
      // If touch originates inside the video container or controls, DO NOT intercept swipe!
      if (e.target.closest('.slide-video-container') || e.target.closest('.video-custom-controls')) {
        isDragging = false;
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

      if (!hasDeterminedDirection) {
        if (Math.abs(diffX) > 8 || Math.abs(diffY) > 8) {
          hasDeterminedDirection = true;
          isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
        }
      }

      if (isHorizontalSwipe) {
        dragDiffX = diffX;
        const trackWidth = viewport.clientWidth;
        const dragPercent = (dragDiffX / trackWidth) * 100;
        slidesTrack.style.transform = `translateX(${currentTranslateX + dragPercent}%)`;
      }
    }, { passive: true });

    viewport.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;

      if (isHorizontalSwipe) {
        const threshold = 40;
        if (dragDiffX < -threshold) {
          nextSlide();
        } else if (dragDiffX > threshold) {
          prevSlide();
        } else {
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

    // Desktop Mouse Drag
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseDiffX = 0;

    viewport.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('.slide-video-container')) return;
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
      const threshold = 45;
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

  // Setup Event Listeners
  function setupEventListeners() {
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

    btnFitToggle.addEventListener('click', () => {
      const isFill = appEl.classList.toggle('fill-mode');
      btnFitToggle.classList.toggle('active', isFill);
      showToast(isFill ? 'Fill mode' : 'Fit mode');
    });

    btnGridView.addEventListener('click', () => openModal(gridModal));
    btnCloseGrid.addEventListener('click', () => closeModal(gridModal));
    gridModal.addEventListener('click', (e) => {
      if (e.target === gridModal) closeModal(gridModal);
    });

    btnShare.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Apartment 9',
            text: 'Apartment 9 - High-resolution gallery and video walkthrough.',
            url: window.location.href
          });
        } catch (err) {
          copyPageUrl();
        }
      } else {
        copyPageUrl();
      }
    });

    btnInquire.addEventListener('click', () => openModal(contactModal));
    btnCloseContact.addEventListener('click', () => closeModal(contactModal));
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal(contactModal);
    });

    btnCopyLink.addEventListener('click', () => copyPageUrl());

    tabAll.addEventListener('click', () => {
      tabAll.classList.add('active');
      tabPhotos.classList.remove('active');
      tabVideo.classList.remove('active');
      goToSlide(0);
    });

    tabPhotos.addEventListener('click', () => {
      goToSlide(0);
    });

    tabVideo.addEventListener('click', () => {
      const videoIdx = mediaItems.findIndex(i => i.type === 'video');
      if (videoIdx !== -1) goToSlide(videoIdx);
    });

    // Desktop Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (gridModal.classList.contains('open')) closeModal(gridModal);
        if (contactModal.classList.contains('open')) closeModal(contactModal);
        return;
      }

      if (gridModal.classList.contains('open') || contactModal.classList.contains('open')) return;

      const isVideoSlide = mediaItems[currentIndex].type === 'video';

      if (e.key === 'ArrowLeft') {
        if (isVideoSlide && videoElement && !e.altKey && !e.shiftKey) {
          // If on video slide, ArrowLeft skips back 5 seconds!
          videoElement.currentTime = Math.max(0, videoElement.currentTime - 5);
          showToast('Rewind 5s');
        } else {
          dismissSwipeHint();
          prevSlide();
        }
      } else if (e.key === 'ArrowRight') {
        if (isVideoSlide && videoElement && !e.altKey && !e.shiftKey) {
          // If on video slide, ArrowRight skips forward 5 seconds!
          videoElement.currentTime = Math.min(videoElement.duration || 9999, videoElement.currentTime + 5);
          showToast('Forward 5s');
        } else {
          dismissSwipeHint();
          nextSlide();
        }
      } else if (e.key === ' ' && isVideoSlide && videoElement) {
        e.preventDefault();
        if (videoElement.paused) {
          videoElement.play();
        } else {
          videoElement.pause();
        }
      }
    });
  }

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

  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function copyPageUrl() {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied!');
      }).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  }

  function fallbackCopy(text) {
    const el = document.createElement('input');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      showToast('Link copied!');
    } catch (e) {
      showToast('URL copied');
    }
    document.body.removeChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }

})();
