/* =========================================================
   Niejhay & Lhyn — Wedding Invitation
   Vanilla JS — countdown, nav, reveal, opening transition
   ========================================================= */

/* ---------------------------------------------------------
   EDITABLE CONFIGURATION
   Update these values to change the wedding details site-wide.
   --------------------------------------------------------- */
const WEDDING = {
  groom: "Niejhay Lintag",
  bride: "Lhyn Manalansan",
  date: "August 29, 2026",
  dateTime: "2026-08-29T09:00:00+08:00", // ISO datetime, Philippine Time (UTC+8)
  ceremony: "Minor Basilica and Shrine Parish of Our Lady of the Rosary of Orani",
  reception: "Clubhouse Coastal Grove",
  location: "Kaparangan, Orani, Bataan",
  dressCode: "Midnight Blue",
  hashtag: "#NIEJHAYfoundhismamahaLHYN" // shown on the Snap & Share section
};

/* ---------------------------------------------------------
   GALLERY PHOTOS
   Add a photo: drop the image file into assets/gallery/, then
   add its path here as a new line. Order here is the order it
   appears on the site. Each needs a short alt-text description
   for accessibility (what's happening in the photo).
   --------------------------------------------------------- */
const GALLERY = [

  { src: "assets/gallery/gallery-1.jpg", alt: "Niejhay and Lhyn smiling together at Little Seoul Cafe" },
  { src: "assets/gallery/gallery-2.jpg", alt: "Niejhay carrying Lhyn on his back in front of the Grotto Cross memorial" },
  { src: "assets/gallery/gallery-3.jpg", alt: "Niejhay and Lhyn smiling together while dining at a restaurant" },
  { src: "assets/gallery/gallery-4.jpg", alt: "Niejhay and Lhyn standing together inside a church, with Lhyn holding a bouquet of red roses" },
  { src: "assets/gallery/gallery-5.jpg", alt: "Niejhay and Lhyn posing together in front of the Grotto Cross memorial" },
  { src: "assets/gallery/gallery-6.jpg", alt: "Niejhay and Lhyn posing together at a shopping mall" },
  { src: "assets/gallery/gallery-7.jpg", alt: "Niejhay and Lhyn playfully posing together in front of the Grotto Cross memorial" },
  { src: "assets/gallery/gallery-8.jpg", alt: "Niejhay and Lhyn smiling together while enjoying a scenic mountain view" }
];

document.addEventListener("DOMContentLoaded", () => {
  initOpening();
  initNav();
  initCountdown();
  initReveal();
  initRsvpForm();
  initSnapShare();
  initMusic();
  initGallery();
});

/* ---------------------------------------------------------
   Opening screen -> smooth scroll into the invitation
   --------------------------------------------------------- */
function initOpening(){
  const openBtn = document.getElementById("openBtn");
  const invitation = document.getElementById("invitation");
  const video = document.querySelector(".opening__video");

  // Attempt autoplay; if blocked (some mobile browsers), it will just show the poster.
  if (video) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { /* autoplay blocked — poster image remains, no action needed */ });
    }
  }

  if (openBtn && invitation) {
    openBtn.addEventListener("click", () => {
      invitation.scrollIntoView({ behavior: "smooth", block: "start" });
      // Tapping "Open Invitation" is a real user gesture, so browsers
      // will allow audio with sound to start here (unlike page-load
      // autoplay, which they block). See initMusic() for the toggle.
      playMusic();
    });
  }
}

/* ---------------------------------------------------------
   Background music
   Browsers block autoplay-with-sound until the guest interacts
   with the page, so playback starts on the "Open Invitation" tap
   (see initOpening above). The nav bar toggle lets guests mute it
   any time afterward, or start it manually if that first attempt
   was blocked for some reason.
   --------------------------------------------------------- */
function initMusic(){
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio || !toggle) return;

  audio.volume = 0.55;

  toggle.addEventListener("click", () => {
    if (audio.paused) {
      playMusic();
    } else {
      audio.pause();
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Play background music");
    }
  });

  // Also start music the moment a guest interacts with the page at all —
  // scrolling (in addition to tapping "Open Invitation" — see initOpening).
  // On mobile, a scroll begins with a touch, and browsers count touches
  // as a real user gesture, so this is allowed to start audio with sound
  // too. Desktop mouse-wheel scrolling alone does NOT count as a gesture
  // per browser autoplay rules (this is intentional on their part, to
  // stop accidental scrolling from triggering sound) — the click handler
  // on "Open Invitation" remains the reliable path there.
  // { once: true } means each of these only fires the first time.
  window.addEventListener("touchstart", () => playMusic(), { once: true, passive: true });
  window.addEventListener("scroll", () => playMusic(), { once: true, passive: true });
}

function playMusic(){
  const audio = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");
  if (!audio) return;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (toggle) {
        toggle.setAttribute("aria-pressed", "true");
        toggle.setAttribute("aria-label", "Mute background music");
      }
    }).catch(() => {
      // Autoplay blocked — leave the toggle in its "off" state so the
      // guest can start music manually with a direct tap on it.
    });
  }
}

/* ---------------------------------------------------------
   Mobile navigation: hamburger + scroll-aware header
   --------------------------------------------------------- */
function initNav(){
  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("navMenu");
  const scrim = document.getElementById("navScrim");
  const links = document.querySelectorAll("[data-nav]");
  const opening = document.getElementById("opening");

  function openMenu(){
    menu.classList.add("is-open");
    scrim.classList.add("is-open");
    menuBtn.setAttribute("aria-expanded", "true");
  }
  function closeMenu(){
    menu.classList.remove("is-open");
    scrim.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
  }
  if (scrim) scrim.addEventListener("click", closeMenu);
  links.forEach(link => link.addEventListener("click", closeMenu));

  // Reveal the fixed nav only after the opening screen, and add a
  // subtle elevated style once the page has scrolled.
  if ("IntersectionObserver" in window && opening) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        nav.classList.toggle("is-shown", !entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    io.observe(opening);
  } else {
    nav.classList.add("is-shown");
  }

  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }, { passive: true });
}

/* ---------------------------------------------------------
   Countdown timer
   --------------------------------------------------------- */
function initCountdown(){
  const target = new Date(WEDDING.dateTime).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs")
  };
  const grid = document.getElementById("countdown");
  const todayMsg = document.getElementById("cd-today");

  if (!els.days || isNaN(target)) return;

  function pad(n){ return String(n).padStart(2, "0"); }

  function tick(){
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      grid.hidden = true;
      todayMsg.hidden = false;
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   Scroll reveal for sections/photos
   --------------------------------------------------------- */
function initReveal(){
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window) || targets.length === 0) {
    targets.forEach(t => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  targets.forEach(t => io.observe(t));
}

/* ---------------------------------------------------------
   RSVP + Guest wishes forms
   Both post to the same Google Apps Script Web App endpoint
   (see google-apps-script.gs + README for setup). Set the
   data-endpoint attribute on each <form> in index.html once
   you've deployed your script.

   NOTE: Google Apps Script Web Apps respond through a redirect
   that browsers won't let JS read in normal CORS mode — even
   when the request succeeds, fetch() can throw. So this uses
   mode: "no-cors" and treats "the request didn't throw" as
   success, rather than trying to read the response. Always
   double-check new rows are appearing in your sheet, since this
   approach can't surface a real server-side error message.
   --------------------------------------------------------- */
function initRsvpForm(){
  bindFormSubmit("rsvpForm", "rsvpStatus", "Thank you! Your RSVP has been received.", {
    checkDuplicate: true,
    duplicateMessage: "Looks like we already have an RSVP under that name. If you need to change your response, please reach out to the couple directly."
  });
}

function bindFormSubmit(formId, statusId, successMessage, opts){
  const options = opts || {};
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Guards against double-click / double-tap firing two submissions
    // before the first one finishes.
    if (isSubmitting) return;

    const endpoint = form.dataset.endpoint;

    if (!endpoint || endpoint === "YOUR_FORM_ENDPOINT_HERE") {
      status.textContent = "Thank you! (Connect a form endpoint — see google-apps-script.gs — to save responses.)";
      form.reset();
      return;
    }

    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

    isSubmitting = true;
    if (submitBtn) submitBtn.disabled = true;
    status.textContent = "Sending…";

    try {
      if (options.checkDuplicate) {
        // Read the real response (instead of no-cors fire-and-forget) so
        // we can tell a guest their RSVP was already recorded, rather
        // than silently accepting a second copy or lying about success.
        // NOTE: Apps Script Web Apps normally respond through a redirect
        // that JS can't read; this works because the request body here
        // (FormData) never triggers a CORS preflight, and Apps Script
        // does allow the final response to be read in that case. If you
        // ever see "Something went wrong" here even though the RSVP
        // sheet looks fine, your deployment/browser combo may not
        // support reading the response — you'd then need to drop
        // checkDuplicate and go back to plain no-cors mode.
        const res = await fetch(endpoint, { method: "POST", body: data });
        const result = await res.json();
        if (result && result.duplicate) {
          status.textContent = options.duplicateMessage || "This RSVP was already submitted.";
        } else if (result && result.ok === false) {
          status.textContent = "Something went wrong. Please check your internet connection and try again.";
        } else {
          status.textContent = successMessage;
          form.reset();
        }
      } else {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          body: data
        });
        status.textContent = successMessage;
        form.reset();
      }
    } catch (err) {
      status.textContent = "Something went wrong. Please check your internet connection and try again.";
    } finally {
      isSubmitting = false;
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

/* ---------------------------------------------------------
   Snap & Share
   Lets a guest take/choose one or more photos, then either:
     (a) upload them to the couple's Google Drive folder via the
         same Apps Script backend used for RSVP (see
         google-apps-script.gs), or
     (b) share them straight to Instagram/Facebook/Messages etc.
         through the device's native share sheet, with the
         wedding hashtag pre-filled as the caption.

   True one-tap "auto-post to Instagram/Facebook" isn't possible
   from a plain website — those platforms require a registered,
   reviewed app for that. The native share sheet (Web Share API)
   is the closest real equivalent: it's supported on most mobile
   browsers and lets the guest pick exactly where to post with
   the caption already filled in. On desktop browsers that don't
   support it, sharing falls back to just copying the hashtag.
   --------------------------------------------------------- */
function initSnapShare(){
  const box = document.querySelector(".snapshare__box");
  const hashtagEl = document.getElementById("weddingHashtag");
  const copyBtn = document.getElementById("copyHashtagBtn");
  const fileInput = document.getElementById("snapFile");
  const previewWrap = document.getElementById("snapPreviewWrap");
  const uploadBtn = document.getElementById("snapUploadBtn");
  const shareBtn = document.getElementById("snapShareBtn");
  const status = document.getElementById("snapStatus");
  if (!box || !fileInput) return;

  if (hashtagEl) hashtagEl.textContent = WEDDING.hashtag;

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(WEDDING.hashtag);
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => { copyBtn.textContent = original; }, 1800);
      } catch (err) {
        status.textContent = `Copy this manually: ${WEDDING.hashtag}`;
      }
    });
  }

  let currentFiles = []; // array of resized/compressed Blobs, ready to upload or share

  function renderPreviews(){
    previewWrap.innerHTML = "";
    currentFiles.forEach((file, i) => {
      const url = URL.createObjectURL(file);
      const thumb = document.createElement("div");
      thumb.className = "snapshare__thumb";
      thumb.innerHTML = `
        <img src="${url}" alt="Selected photo ${i + 1}">
        <button type="button" class="snapshare__thumb-remove" aria-label="Remove this photo">&times;</button>
      `;
      thumb.querySelector(".snapshare__thumb-remove").addEventListener("click", () => {
        currentFiles.splice(i, 1);
        renderPreviews();
      });
      previewWrap.appendChild(thumb);
    });

    const hasFiles = currentFiles.length > 0;
    previewWrap.hidden = !hasFiles;
    uploadBtn.disabled = !hasFiles;
    shareBtn.disabled = !hasFiles;
    uploadBtn.textContent = currentFiles.length > 1
      ? `Upload ${currentFiles.length} Photos to Our Gallery`
      : "Upload to Our Gallery";
  }

  fileInput.addEventListener("change", async () => {
    const raw = Array.from(fileInput.files || []);
    if (!raw.length) return;

    status.textContent = raw.length > 1 ? "Preparing your photos…" : "Preparing your photo…";

    // Process each photo independently: one unreadable file (e.g. an
    // iPhone HEIC photo most browsers can't decode) shouldn't throw
    // away the rest of a multi-photo selection.
    const results = await Promise.allSettled(raw.map(f => resizeImage(f, 1600, 0.82)));

    const succeeded = [];
    let heicCount = 0;
    const otherFailures = []; // { name, type, size, error }

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        succeeded.push(result.value);
      } else if (isLikelyHeic_(raw[i])) {
        heicCount++;
      } else {
        otherFailures.push({
          name: raw[i].name || "(unnamed)",
          type: raw[i].type || "(unknown type)",
          size: raw[i].size,
          error: result.reason && result.reason.message
        });
      }
    });

    currentFiles = currentFiles.concat(succeeded);
    renderPreviews();

    if (!heicCount && !otherFailures.length) {
      status.textContent = "";
    } else {
      const parts = [];
      if (succeeded.length) {
        parts.push(`Added ${succeeded.length} photo${succeeded.length > 1 ? "s" : ""}.`);
      }
      if (heicCount) {
        parts.push(`${heicCount} photo${heicCount > 1 ? "s" : ""} couldn't be read — iPhone "HEIC" photos aren't supported here. In your phone's Camera settings, switch Formats to "Most Compatible" (saves as JPG), or choose an existing JPG/PNG instead.`);
      }
      if (otherFailures.length) {
        // Temporary diagnostic detail (file type/size/error) shown right
        // on the page so the failure can be identified from a phone
        // without needing remote devtools. Safe to trim back to a plain
        // "please try again" once the cause is confirmed.
        const detail = otherFailures
          .map(f => `${f.name} — ${f.type}, ${(f.size / 1024).toFixed(0)}KB${f.error ? `, ${f.error}` : ""}`)
          .join(" | ");
        parts.push(`${otherFailures.length} photo${otherFailures.length > 1 ? "s" : ""} couldn't be read (${detail}).`);
      }
      status.textContent = parts.join(" ");
    }

    fileInput.value = ""; // allow re-selecting the same file(s) later, and lets "change" fire again for another batch
  });

  if (uploadBtn) {
    uploadBtn.addEventListener("click", async () => {
      if (!currentFiles.length) return;

      // Fall back to the RSVP form's endpoint if this section's own
      // data-endpoint hasn't been set separately — most sites will
      // want to use one single Apps Script deployment for everything.
      const rsvpForm = document.getElementById("rsvpForm");
      let endpoint = box.dataset.endpoint;
      if (!endpoint || endpoint === "YOUR_FORM_ENDPOINT_HERE") {
        endpoint = rsvpForm && rsvpForm.dataset.endpoint;
      }
      if (!endpoint || endpoint === "YOUR_FORM_ENDPOINT_HERE") {
        status.textContent = "Thank you! (Connect a form endpoint — see google-apps-script.gs — to save photos.)";
        return;
      }

      uploadBtn.disabled = true;
      const total = currentFiles.length;

      try {
        for (let i = 0; i < total; i++) {
          status.textContent = total > 1 ? `Uploading photo ${i + 1} of ${total}…` : "Uploading…";
          const base64 = await blobToBase64(currentFiles[i]);
          const data = new FormData();
          data.append("formType", "photo");
          data.append("fileName", `guest-photo-${Date.now()}-${i + 1}.jpg`);
          data.append("mimeType", "image/jpeg");
          data.append("fileData", base64);
          await fetch(endpoint, { method: "POST", mode: "no-cors", body: data });
        }
        status.textContent = total > 1 ? `Uploaded ${total} photos! Thank you for sharing.` : "Uploaded! Thank you for sharing.";
        currentFiles = [];
        renderPreviews();
      } catch (err) {
        status.textContent = "Something went wrong partway through. Please check your connection and try again.";
      } finally {
        uploadBtn.disabled = false;
      }
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (!currentFiles.length) return;
      const shareText = `Celebrating ${WEDDING.groom} & ${WEDDING.bride}! ${WEDDING.hashtag}`;
      const shareFiles = currentFiles.map((file, i) => new File([file], `wedding-photo-${i + 1}.jpg`, { type: "image/jpeg" }));

      if (navigator.canShare && navigator.canShare({ files: shareFiles })) {
        try {
          await navigator.share({ files: shareFiles, text: shareText });
          status.textContent = "Thanks for sharing!";
        } catch (err) {
          // User likely cancelled the share sheet — not an error.
        }
        return;
      }

      // Desktop / unsupported browsers: no direct-to-app share is
      // possible, so make manual posting as easy as we can.
      try {
        await navigator.clipboard.writeText(shareText);
        status.textContent = "Your browser can't open the share menu — caption copied! Save your photo(s) above and paste the caption when you post.";
      } catch (err) {
        status.textContent = `Save your photo(s) above and post them with: ${shareText}`;
      }
    });
  }
}

/** Rough check for HEIC/HEIF (default iPhone photo format), which most
 *  non-Safari browsers can't decode client-side. Checked by MIME type
 *  first since that's reliable when present; falls back to the file
 *  extension because some browsers report HEIC files with an empty
 *  or generic MIME type. */
function isLikelyHeic_(file){
  const type = (file.type || "").toLowerCase();
  if (type.includes("heic") || type.includes("heif")) return true;
  if (!type) {
    const name = (file.name || "").toLowerCase();
    return name.endsWith(".heic") || name.endsWith(".heif");
  }
  return false;
}

/** Resize + compress an image File/Blob in-browser via canvas, returning a JPEG Blob. */
async function resizeImage(file, maxDimension, quality){
  // Prefer createImageBitmap: it decodes a somewhat wider range of
  // formats than an <img> element in some browsers. Fall back to the
  // <img>-based path (below) if it's unavailable or fails.
  let bitmap = null;
  if (window.createImageBitmap) {
    try {
      bitmap = await createImageBitmap(file);
    } catch (err) {
      bitmap = null; // fall through to the <img>-based approach
    }
  }

  if (bitmap) {
    let { width, height } = bitmap;
    if (width > maxDimension || height > maxDimension) {
      const scale = maxDimension / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed")),
        "image/jpeg",
        quality
      );
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const scale = maxDimension / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

/** Convert a Blob to a base64 string (no data: prefix) for posting as a form field. */
function blobToBase64(blob){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ---------------------------------------------------------
   Gallery grid + tap-to-enlarge lightbox
   Renders the GALLERY array (defined near WEDDING config above)
   into #galleryGrid, and opens a fullscreen view on tap.
   --------------------------------------------------------- */
function initGallery(){
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  if (!GALLERY.length) {
    grid.innerHTML = '<p class="gallery__empty"><em>Photos coming soon.</em></p>';
    return;
  }

  grid.innerHTML = GALLERY.map((photo, i) => `
    <button type="button" class="gallery__item" data-index="${i}" aria-label="View photo: ${escapeHtml(photo.alt)}">
      <img src="${photo.src}" alt="${escapeHtml(photo.alt)}" loading="lazy">
    </button>
  `).join("");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  if (!lightbox || !lightboxImg) return;

  function openLightbox(index){
    const photo = GALLERY[index];
    if (!photo) return;
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  grid.querySelectorAll(".gallery__item").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(Number(btn.dataset.index)));
  });
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });
}

function escapeHtml(str){
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}
