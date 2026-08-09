# Niejhay & Lhyn — Wedding Invitation Website

A mobile-first, single-page wedding invitation. Plain HTML/CSS/JS — no build step, no framework. Works as a static site anywhere (GitHub Pages, Netlify, Vercel, or any web host).

```
/
├── index.html
├── style.css
├── script.js
├── google-apps-script.gs   (backend for RSVP + Snap & Share photo uploads)
├── assets/
│   ├── wedding-video.mp4    (opening monogram animation, compressed for mobile)
│   ├── background-music.mp3 (site background music, compressed for mobile)
│   ├── couple-photo.jpg
│   ├── entourage-1.jpg / entourage-2.jpg
│   └── monogram.png
└── README.md
```

## 1. Add / replace the video

The opening screen uses `assets/wedding-video.mp4`. It's already compressed (720p, no audio, ~60 KB) for fast mobile loading. To swap it for a different clip:

1. Replace `assets/wedding-video.mp4` with your file (keep the same filename, or update the `<source>` path in `index.html` under `#opening`).
2. Keep it short (10–20s), muted, and under a few MB — mobile guests are often on cellular data.
3. If your new video is landscape footage rather than a centered animation, open `style.css` and change `.opening__video` from `width: min(84vw, 420px)` to `width: 100%; height: 100%; object-fit: cover;` and remove `mix-blend-mode: multiply`.

## 2. Add / replace the couple photo

Replace `assets/couple-photo.jpg` with your preferred photo (same filename), or update the `src` attributes in `index.html` (used in the hero photo section — the gallery further down the page is a separate, expandable set of photos, see section 12).

## 3. Connect the RSVP form + Snap & Share to a Google Sheet / Drive

The RSVP form (`#rsvp`) and the Snap & Share photo upload (`#snapshare`) are built directly into the site — guests never leave the page. Out of the box they'll show a thank-you message but won't save anywhere; to actually collect RSVPs into a spreadsheet and photos into a Drive folder, wire up the included Apps Script backend (free, no server needed, ~5 minutes):

1. Create a new spreadsheet at [sheets.google.com](https://sheets.google.com).
2. In the sheet, go to **Extensions > Apps Script**, delete the starter code, and paste in the entire contents of `google-apps-script.gs`.
3. Click **Deploy > New deployment**, choose type **Web app**, set "Execute as" to **Me** and "Who has access" to **Anyone**, then click **Deploy** and authorize it.
4. Copy the Web app URL it gives you (`https://script.google.com/macros/s/.../exec`).
5. In `index.html`, paste that URL into the `data-endpoint` attribute of `<form id="rsvpForm" ...>`, replacing `YOUR_FORM_ENDPOINT_HERE`.

That's it for RSVP. **Snap & Share automatically reuses the same URL** — you don't need to set it a second time unless you specifically want photos going to a different Apps Script deployment (in which case, set the `data-endpoint` on the `.snapshare__box` element in `index.html` too).

Submissions create a "RSVP Responses" tab in your spreadsheet, and a "Wedding Guest Photos" folder in your Google Drive, automatically the first time each is used. Full details and troubleshooting are in the comments at the top of `google-apps-script.gs`.

If you ever edit `google-apps-script.gs` after already deploying once, you must redeploy (**Deploy > Manage deployments > pencil icon > Version: New version > Deploy**) or the live URL keeps serving the old code.

If you'd rather use a different backend (Formspree, Firebase, etc.) for the RSVP form, it already `POST`s as standard `FormData` to whatever URL you put in `data-endpoint`, so any endpoint that accepts that will work — though Snap & Share's Drive upload specifically depends on the Apps Script code provided.

## 4. Edit the RSVP form fields (optional)

The RSVP form asks for name, attendance, guest count, contact info, and an optional message. To add, remove, or relabel a field, edit the `#rsvp` section in `index.html` — and add a matching column to the `RSVP_HEADERS` array in `google-apps-script.gs` so new fields get saved too.

## 5. Snap & Share (photo upload + social sharing)

The `#snapshare` section (replacing the old simple timeline) lets guests:

- **Upload a photo** straight into your "Wedding Guest Photos" Drive folder (via the Apps Script backend above). Photos are automatically resized/compressed in the guest's browser before upload (capped at 1600px, ~80% JPEG quality) to keep it fast on mobile data.
- **Share a photo** to Instagram, Facebook, Messages, etc. using their phone's native share sheet, with a caption built from the `WEDDING.hashtag` value pre-filled. This uses the Web Share API, supported on most mobile browsers — there's no way for a website to auto-post directly into Instagram or Facebook without a registered, reviewed app on those platforms, so the native share sheet is the closest real equivalent. On desktop or unsupported browsers, the button instead copies the caption to the clipboard so guests can paste it manually.
- **Copy the wedding hashtag** on its own, for guests who'd rather post independently.

To change the hashtag, edit `hashtag: "#NiejhayAndLhynWedding2026"` in the `WEDDING` object at the top of `script.js` — it's read automatically into the section.

## 6. Edit wedding information

All core details live in one place — the `WEDDING` object at the top of `script.js`:

```js
const WEDDING = {
  groom: "Niejhay Lintag",
  bride: "Lhyn Manalansan",
  date: "August 29, 2026",
  dateTime: "2026-08-29T09:00:00+08:00",
  ceremony: "Minor Basilica and Shrine Parish of Our Lady of the Rosary of Orani",
  reception: "Clubhouse Coastal Grove",
  location: "Kaparangan, Orani, Bataan",
  dressCode: "Midnight Blue",
  hashtag: "#NiejhayAndLhynWedding2026"
};
```

The countdown reads `dateTime` directly, and the Snap & Share section reads `hashtag` directly. Other text on the page (names, date, venue names, addresses) is written directly in `index.html`, so if you change a value in `WEDDING`, search for the matching text in `index.html` and update it there too.

**Note on the ceremony time:** the provided wedding brief states **9:00 AM**; one of the uploaded invitation card images shows 9:30 AM. The site currently uses 9:00 AM everywhere (hero, "The Day" section, countdown). If 9:30 AM is correct, update the time in `index.html` (two places) and the `dateTime` value above.

## 7. Google Maps links

The "Get Directions" buttons already link to Google Maps search queries:

- Ceremony: `https://www.google.com/maps/search/?api=1&query=Minor+Basilica+and+Shrine+Parish+of+Our+Lady+of+the+Rosary+of+Orani%2C+Orani%2C+Bataan%2C+Philippines`
- Reception: `https://www.google.com/maps/search/?api=1&query=Clubhouse+Coastal+Grove%2C+Kaparangan%2C+Orani%2C+Bataan%2C+Philippines`

To use an exact pinned location instead of a text search, replace either URL with a Google Maps share link (Maps app → Share → Copy Link).

## 8. The entourage section

The "Our Entourage" section displays the two entourage card images directly (`assets/entourage-1.jpg` and `assets/entourage-2.jpg`), collapsed behind a "View the full entourage" toggle to keep the mobile experience light. To update the entourage list, replace those two image files (keep the same filenames), or delete the whole `<section id="entourage">...</section>` block in `index.html` if you'd rather leave it off the website.

## 9. Our Story section

`index.html` → `<section id="story">` contains three editable placeholders (no personal history was provided, so nothing was invented). Fill them in, or delete the section and remove "Our Story" from the nav menu (`#navMenu`) if you don't want it.

## 10. Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `niejhay-lhyn-wedding`).
2. Upload all files in this folder, keeping the folder structure intact (`index.html`, `style.css`, `script.js`, `assets/`).
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then **Save**.
6. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
7. Share that link (or a shortened version) via Messenger, SMS, or a QR code pointing to it.

## 11. Background music

The site plays `assets/background-music.mp3` on loop, at a moderate volume (55%). Browsers block audio with sound from autoplaying on page load, so playback actually starts the moment a guest taps **"Open Invitation"** on the opening screen — that tap counts as a real user gesture, which browsers do allow to trigger sound. A small music-note icon in the top nav bar (next to the hamburger menu) lets guests mute it at any time, or start it manually if that first attempt was blocked for some reason (rare, but possible on some browsers).

To swap the track:

1. Replace `assets/background-music.mp3` with your file (keep the same filename, or update the `<source>` path in `index.html` inside `<audio id="bgMusic">`).
2. Keep it reasonably compressed for mobile — the included file was re-encoded to 128kbps (~4 MB for a 4-minute track). A bitrate around 128kbps keeps quality good while staying light on cellular data.
3. To change the default volume, edit `audio.volume = 0.55;` in `initMusic()` in `script.js` (0 to 1).
4. To remove background music entirely, delete the `<audio id="bgMusic">` block and the `.site-nav__music` button in `index.html`, and remove the `initMusic()` call in `script.js`.

**A note on the provided track:** the uploaded file is a cover recording of a commercially copyrighted song. It's fine to use on a private wedding site shared with your own guests, but if you publish the site somewhere very public (a public GitHub Pages URL indexed by search engines, etc.), be aware platforms like YouTube/Facebook can flag copyrighted audio if the page is ever screen-recorded or shared into their systems. For full peace of mind, royalty-free wedding-appropriate tracks are widely available (e.g. via YouTube Audio Library or Epidemic Sound) if you'd rather swap it.

## 12. Adding more photos to the gallery

The "A Glimpse of Us" gallery is a tap-to-enlarge grid, driven by a list near the top of `script.js`:

```js
const GALLERY = [
  { src: "assets/couple-photo.jpg", alt: "Niejhay and Lhyn smiling together" }
  // { src: "assets/gallery/photo-2.jpg", alt: "Describe this photo" },
];
```

To add a photo:

1. Put the image file in `assets/gallery/` (this empty folder is already included — any filename works).
2. Add a line to the `GALLERY` array above with its path and a short description (the description is read aloud by screen readers and shown if the image fails to load — describe what's happening in the photo).
3. Save, and the grid + lightbox update automatically — no other file needs to change.

Photos display in the order listed. There's no hard limit on how many you add, but for guests on mobile data, keep individual files reasonably sized (compress large phone photos to roughly 1500px on the long side / under ~500 KB each if you can — most photo apps or [squoosh.app](https://squoosh.app) can do this in a couple of taps).

## Notes

- No RSVP deadline, program schedule, or contact numbers were provided, so none were invented — add them if/when the couple decides on them. A placeholder hashtag was added for Snap & Share (`#NiejhayAndLhynWedding2026`) — change it in `script.js` (see section 6) to whatever the couple prefers.
- The site respects `prefers-reduced-motion` and is keyboard-navigable, with visible focus states throughout.
