/* =========================================================
   Nhiejay & Lhyn — Wedding Invitation
   Vanilla JS — countdown, nav, reveal, opening transition
   ========================================================= */

/* ---------------------------------------------------------
   EDITABLE CONFIGURATION
   Update these values to change the wedding details site-wide.
   --------------------------------------------------------- */
const WEDDING = {
  groom: "Nhiejay Lintag",
  bride: "Lhyn Manalansan",
  date: "August 29, 2026",
  dateTime: "2026-08-29T09:00:00+08:00", // ISO datetime, Philippine Time (UTC+8)
  ceremony: "Minor Basilica and Shrine Parish of Our Lady of the Rosary of Orani",
  reception: "Clubhouse Coastal Grove",
  location: "Kaparangan, Orani, Bataan",
  dressCode: "Midnight Blue"
};

document.addEventListener("DOMContentLoaded", () => {
  initOpening();
  initNav();
  initCountdown();
  initReveal();
  initRsvpForm();
  initWishesForm();
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
   --------------------------------------------------------- */
function initRsvpForm(){
  bindFormSubmit("rsvpForm", "rsvpStatus", "Thank you! Your RSVP has been received.");
}

function initWishesForm(){
  bindFormSubmit("wishesForm", "wishesStatus", "Thank you for your kind wishes!");
}

function bindFormSubmit(formId, statusId, successMessage){
  const form = document.getElementById(formId);
  const status = document.getElementById(statusId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const endpoint = form.dataset.endpoint;

    if (!endpoint || endpoint === "YOUR_FORM_ENDPOINT_HERE") {
      status.textContent = "Thank you! (Connect a form endpoint — see google-apps-script.gs — to save responses.)";
      form.reset();
      return;
    }

    const data = new FormData(form);
    status.textContent = "Sending…";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      });
      if (res.ok) {
        status.textContent = successMessage;
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
      }
    } catch (err) {
      status.textContent = "Something went wrong. Please try again.";
    }
  });
}
