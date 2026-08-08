/* ==========================================================
   LHYN & NHIEJAY — INTERACTION SCRIPT
   Edit the values in CONFIG to personalize the invitation.
   ========================================================== */

const CONFIG = {
  WEDDING_DATE: "2026-08-29T09:00:00+08:00",

  // Replace with your real RSVP form URL.
  RSVP_URL: "YOUR_RSVP_LINK_HERE",

  // Optional: add an audio file such as "assets/wedding-music.mp3".
  // Leave empty to keep the music control hidden.
  MUSIC_SRC: "",

  // Optional guest-wishes email. If empty, the form works as a local
  // confirmation and does not transmit anything.
  WISHES_EMAIL: ""
};

document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const openButton = document.getElementById("openInvitation");
  const siteHeader = document.getElementById("siteHeader");
  const nav = document.getElementById("siteNav");
  const menuToggle = document.getElementById("menuToggle");
  const rsvpButton = document.getElementById("rsvpButton");
  const rsvpNote = document.getElementById("rsvpNote");
  const musicToggle = document.getElementById("musicToggle");

  // ---------- RSVP ----------
  if (CONFIG.RSVP_URL && CONFIG.RSVP_URL !== "YOUR_RSVP_LINK_HERE") {
    rsvpButton.href = CONFIG.RSVP_URL;
    rsvpNote.textContent = "We can't wait to celebrate with you.";
  } else {
    rsvpButton.href = "#";
    rsvpNote.textContent = "RSVP link will be added soon.";
    rsvpButton.addEventListener("click", (event) => {
      event.preventDefault();
      rsvpNote.textContent = "Please add your RSVP URL in script.js.";
    });
  }

  // ---------- Opening experience ----------
  const openInvitation = () => {
    document.body.classList.remove("locked");
    document.body.classList.add("invitation-open");
    opening.classList.add("is-closing");
    siteHeader.classList.add("visible");

    window.setTimeout(() => {
      opening.style.display = "none";
      document.getElementById("home").scrollIntoView({ behavior: "smooth", block: "start" });
    }, 850);

    if (CONFIG.MUSIC_SRC) {
      setupMusic();
    }
  };

  openButton.addEventListener("click", openInvitation);

  // ---------- Navigation ----------
  const closeMenu = () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ---------- Countdown ----------
  const target = new Date(CONFIG.WEDDING_DATE).getTime();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const countdown = document.getElementById("countdown");
  const countdownMessage = document.getElementById("countdownMessage");

  const pad = (number) => String(number).padStart(2, "0");

  function updateCountdown() {
    const now = Date.now();
    const distance = target - now;

    if (distance <= 0) {
      countdown.hidden = true;
      countdownMessage.hidden = false;
      return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // ---------- Scroll reveal ----------
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // ---------- Optional music ----------
  let audio = null;

  function setupMusic() {
    if (!CONFIG.MUSIC_SRC || audio) return;

    audio = new Audio(CONFIG.MUSIC_SRC);
    audio.loop = true;
    audio.preload = "none";
    musicToggle.hidden = false;
    musicToggle.setAttribute("aria-label", "Play or pause wedding music");

    musicToggle.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          musicToggle.querySelector(".music-icon").textContent = "❚❚";
        }).catch(() => {
          musicToggle.querySelector(".music-icon").textContent = "♪";
        });
      } else {
        audio.pause();
        musicToggle.querySelector(".music-icon").textContent = "♪";
      }
    }, { once: true });

    // Rebind with a normal listener after the first click.
    musicToggle.onclick = () => {
      if (audio.paused) {
        audio.play().then(() => {
          musicToggle.querySelector(".music-icon").textContent = "❚❚";
        }).catch(() => {});
      } else {
        audio.pause();
        musicToggle.querySelector(".music-icon").textContent = "♪";
      }
    };
  }

  // ---------- Guest wishes ----------
  const wishForm = document.getElementById("wishForm");
  const wishStatus = document.getElementById("wishStatus");

  wishForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("wishName").value.trim();
    const message = document.getElementById("wishMessage").value.trim();

    if (!name || !message) {
      wishStatus.textContent = "Please complete both fields.";
      return;
    }

    if (CONFIG.WISHES_EMAIL) {
      const subject = encodeURIComponent(`Wedding wish from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name}`);
      window.location.href = `mailto:${CONFIG.WISHES_EMAIL}?subject=${subject}&body=${body}`;
      wishStatus.textContent = "Opening your email app…";
    } else {
      wishStatus.textContent =
        "Thank you for your lovely message. To receive messages online, connect this form to Formspree, Google Forms, Firebase, or another backend.";
      wishForm.reset();
    }
  });

  // ---------- Escape key ----------
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
});
