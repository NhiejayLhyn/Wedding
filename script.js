/* =========================================================
   NHIEJAY & LHYN — WEDDING INVITATION CONFIGURATION
   Edit the values in WEDDING to update the site.
   ========================================================= */
const WEDDING = {
  groom: "Nhiejay Lintag",
  bride: "Lhyn Manalansan",
  displayNames: "Nhiejay & Lhyn",
  date: "August 29, 2026",
  dateTime: "2026-08-29T09:00:00+08:00",
  ceremony: "Minor Basilica and Shrine Parish of Our Lady of the Rosary of Orani",
  ceremonyCity: "Orani, Bataan, Philippines",
  reception: "Clubhouse Coastal Grove",
  receptionCity: "Kaparangan, Orani, Bataan, Philippines",
  dressCode: "Midnight Blue",
  rsvpUrl: "YOUR_RSVP_LINK_HERE",
  musicFile: "" // Optional: e.g. "assets/wedding-music.mp3"
};

document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const shell = document.getElementById("invitation");
  const openButton = document.getElementById("openInvitation");
  const video = document.querySelector(".opening__video");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const rsvpButton = document.getElementById("rsvpButton");
  const musicToggle = document.getElementById("musicToggle");

  // Keep RSVP editable from one configuration object.
  if (rsvpButton && WEDDING.rsvpUrl && WEDDING.rsvpUrl !== "YOUR_RSVP_LINK_HERE") {
    rsvpButton.href = WEDDING.rsvpUrl;
  } else if (rsvpButton) {
    rsvpButton.addEventListener("click", (event) => {
      if (WEDDING.rsvpUrl === "YOUR_RSVP_LINK_HERE") {
        event.preventDefault();
        alert("Please add your RSVP link in script.js.");
      }
    });
  }

  // Opening experience.
  openButton.addEventListener("click", () => {
    shell.classList.add("is-open");
    opening.classList.add("is-closed");
    document.body.classList.add("invitation-open");
    window.setTimeout(() => {
      opening.style.display = "none";
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 650);

    // Mobile browsers allow media actions after a user gesture.
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }

    if (WEDDING.musicFile) {
      setupMusic(WEDDING.musicFile);
    }
  });

  // Mobile navigation.
  function closeMenu() {
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }
  menuToggle.addEventListener("click", () => {
    const open = menuToggle.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

  // Countdown.
  const countdown = document.getElementById("countdown");
  const complete = document.getElementById("countdownComplete");
  const target = new Date(WEDDING.dateTime).getTime();

  function updateCountdown() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      countdown.hidden = true;
      complete.hidden = false;
      return;
    }
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.querySelector('[data-unit="days"]').textContent = String(days).padStart(2, "0");
    document.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, "0");
    document.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2, "0");
    document.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Scroll reveal.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }

  // Optional music. This remains disabled unless a file is configured.
  function setupMusic(file) {
    let audio = document.getElementById("weddingAudio");
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "weddingAudio";
      audio.loop = true;
      audio.preload = "none";
      audio.src = file;
      document.body.appendChild(audio);
    }
    musicToggle.hidden = false;
    musicToggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => musicToggle.setAttribute("aria-pressed", "true")).catch(() => {});
      } else {
        audio.pause();
        musicToggle.setAttribute("aria-pressed", "false");
      }
    });
  }
});
