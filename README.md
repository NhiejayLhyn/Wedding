[README.md](https://github.com/user-attachments/files/30856228/README.md)
# Nhiejay & Lhyn — Wedding Invitation Website

A mobile-first, single-page wedding invitation. Plain HTML/CSS/JS — no build step, no framework. Works as a static site anywhere (GitHub Pages, Netlify, Vercel, or any web host).

```
/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── wedding-video.mp4   (opening monogram animation, compressed for mobile)
│   ├── couple-photo.jpg
│   └── monogram.png
└── README.md
```

## 1. Add / replace the video

The opening screen uses `assets/wedding-video.mp4`. It's already compressed (720p, no audio, ~60 KB) for fast mobile loading. To swap it for a different clip:

1. Replace `assets/wedding-video.mp4` with your file (keep the same filename, or update the `<source>` path in `index.html` under `#opening`).
2. Keep it short (10–20s), muted, and under a few MB — mobile guests are often on cellular data.
3. If your new video is landscape footage rather than a centered animation, open `style.css` and change `.opening__video` from `width: min(84vw, 420px)` to `width: 100%; height: 100%; object-fit: cover;` and remove `mix-blend-mode: multiply`.

## 2. Add / replace the couple photo

Replace `assets/couple-photo.jpg` with your preferred photo (same filename), or update the `src` attributes in `index.html` (used in the hero photo section and the gallery section — two places).

## 3. Change the RSVP link

Open `script.js` and edit:

```js
rsvpUrl: "YOUR_RSVP_LINK_HERE"
```

Then open `index.html`, find the RSVP section (`id="rsvp"`), and update the button's `href`:

```html
<a class="btn btn--gold" href="YOUR_RSVP_LINK_HERE" ...>RSVP Now</a>
```

A Google Form link works well here.

## 4. Connect the "Leave a Message" form (optional)

The guest wishes form works without a backend (it just shows a thank-you message locally). To actually collect messages:

1. Create a free endpoint with [Formspree](https://formspree.io), a Google Apps Script Web App, or Firebase.
2. In `index.html`, find `<form id="wishesForm" data-endpoint="YOUR_FORM_ENDPOINT_HERE">` and replace the placeholder with your endpoint URL.

## 5. Edit wedding information

All core details live in one place — the `WEDDING` object at the top of `script.js`:

```js
const WEDDING = {
  groom: "Nhiejay Lintag",
  bride: "Lhyn Manalansan",
  date: "August 29, 2026",
  dateTime: "2026-08-29T09:00:00+08:00",
  ceremony: "Minor Basilica and Shrine Parish of Our Lady of the Rosary of Orani",
  reception: "Clubhouse Coastal Grove",
  location: "Kaparangan, Orani, Bataan",
  dressCode: "Midnight Blue",
  rsvpUrl: "YOUR_RSVP_LINK_HERE"
};
```

The countdown reads `dateTime` directly. Text elsewhere on the page (names, date, venue names, addresses) is written directly in `index.html`, so if you change a value in `WEDDING`, search for the matching text in `index.html` and update it there too.

**Note on the ceremony time:** the provided wedding brief states **9:00 AM**; one of the uploaded invitation card images shows 9:30 AM. The site currently uses 9:00 AM everywhere (hero, "The Day" section, countdown). If 9:30 AM is correct, update the time in `index.html` (two places) and the `dateTime` value above.

## 6. Google Maps links

The "Get Directions" buttons already link to Google Maps search queries:

- Ceremony: `https://www.google.com/maps/search/?api=1&query=Minor+Basilica+and+Shrine+Parish+of+Our+Lady+of+the+Rosary+of+Orani%2C+Orani%2C+Bataan%2C+Philippines`
- Reception: `https://www.google.com/maps/search/?api=1&query=Clubhouse+Coastal+Grove%2C+Kaparangan%2C+Orani%2C+Bataan%2C+Philippines`

To use an exact pinned location instead of a text search, replace either URL with a Google Maps share link (Maps app → Share → Copy Link).

## 7. The entourage section

The "Our Entourage" section displays the two entourage card images directly (`assets/entourage-1.jpg` and `assets/entourage-2.jpg`), collapsed behind a "View the full entourage" toggle to keep the mobile experience light. To update the entourage list, replace those two image files (keep the same filenames), or delete the whole `<section id="entourage">...</section>` block in `index.html` if you'd rather leave it off the website.

## 8. Our Story section

`index.html` → `<section id="story">` contains three editable placeholders (no personal history was provided, so nothing was invented). Fill them in, or delete the section and remove "Our Story" from the nav menu (`#navMenu`) if you don't want it.

## 9. Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `nhiejay-lhyn-wedding`).
2. Upload all files in this folder, keeping the folder structure intact (`index.html`, `style.css`, `script.js`, `assets/`).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then **Save**.
6. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
7. Share that link (or a shortened version) via Messenger, SMS, or a QR code pointing to it.

## Notes

- No RSVP deadline, program schedule, contact numbers, or hashtag were provided, so none were invented — add them if/when the couple decides on them.
- The site respects `prefers-reduced-motion` and is keyboard-navigable, with visible focus states throughout.
