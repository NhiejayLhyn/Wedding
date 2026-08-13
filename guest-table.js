/* =========================================================
   Niejhay & Lhyn — Guest Table Lookup
   Static GitHub Pages implementation
   ========================================================= */

(() => {
  "use strict";

  const form = document.getElementById("guestLookupForm");
  const input = document.getElementById("guestName");
  const result = document.getElementById("guestResult");
  const resultsList = document.getElementById("guestMatches");
  const status = document.getElementById("guestStatus");
  const tryAgain = document.getElementById("guestTryAgain");

  if (!form || !input || !result || !resultsList || !status) return;

  const sourceGuests = Array.isArray(window.guests) ? window.guests : [];

  function normalizeName(name) {
    return String(name || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function validGuest(guest) {
    return guest &&
      typeof guest.name === "string" &&
      guest.name.trim() &&
      typeof guest.table === "string" &&
      guest.table.trim();
  }

  const cleanGuests = sourceGuests.filter(validGuest);

  function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value || "");
    return div.innerHTML;
  }

  function setStatus(message) {
    status.textContent = message || "";
  }

  function showResult() {
    result.hidden = false;
    result.classList.remove("is-visible");
    requestAnimationFrame(() => result.classList.add("is-visible"));
  }

  function hideResult() {
    result.hidden = true;
    result.classList.remove("is-visible");
    resultsList.innerHTML = "";
  }

  function showTable(guest) {
    resultsList.innerHTML = `
      <div class="guest-table__welcome">Welcome, <strong>${escapeHtml(guest.name)}</strong>!</div>
      <p class="guest-table__label">Your assigned table is</p>
      <div class="guest-table__number">${escapeHtml(guest.table)}</div>
      <p class="guest-table__celebration">We can't wait to celebrate with you!</p>
    `;
    setStatus(`Table assignment found for ${guest.name}.`);
    showResult();
  }

  function showMultiple(matches) {
    resultsList.innerHTML = `
      <div class="guest-table__multiple-heading">We found several guests</div>
      <p class="guest-table__multiple-note">Please tap your name to see your assigned table.</p>
      <div class="guest-table__match-list">
        ${matches.map((guest, index) => `
          <button type="button"
                  class="guest-table__match"
                  data-guest-index="${index}">
            <span>${escapeHtml(guest.name)}</span>
            <span aria-hidden="true">→</span>
          </button>
        `).join("")}
      </div>
    `;

    resultsList.querySelectorAll("[data-guest-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const guest = matches[Number(button.dataset.guestIndex)];
        if (guest) showTable(guest);
      });
    });

    setStatus(`${matches.length} guest matches found. Select your name.`);
    showResult();
  }

  function searchGuests(query) {
    const normalizedQuery = normalizeName(query);
    if (!normalizedQuery) return [];

    return cleanGuests.filter((guest) =>
      normalizeName(guest.name).includes(normalizedQuery)
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    const query = input.value;

    if (!normalizeName(query)) {
      setStatus("Please enter your name first.");
      hideResult();
      input.focus();
      return;
    }

    if (!cleanGuests.length) {
      setStatus("The guest list is not available yet. Please contact the wedding reception team.");
      hideResult();
      return;
    }

    const matches = searchGuests(query);

    if (!matches.length) {
      resultsList.innerHTML = `
        <div class="guest-table__not-found">We couldn't find your name.</div>
        <p class="guest-table__not-found-note">Please check the spelling and try again.</p>
        <button type="button" class="btn btn--outline-dark guest-table__retry" id="guestRetryInline">
          Try Again
        </button>
      `;
      setStatus("No guest matched your search.");
      showResult();

      const retry = document.getElementById("guestRetryInline");
      if (retry) retry.addEventListener("click", resetSearch);
      return;
    }

    if (matches.length === 1) {
      showTable(matches[0]);
      return;
    }

    showMultiple(matches);
  }

  function resetSearch() {
    input.value = "";
    hideResult();
    setStatus("");
    input.focus();
  }

  form.addEventListener("submit", handleSubmit);
  if (tryAgain) tryAgain.addEventListener("click", resetSearch);
})();
