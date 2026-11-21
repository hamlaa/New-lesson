# NEW LESSON — Student Council Campaign Website

A static campaign website for the **NEW LESSON** student council party of
**Ko Samui School (โรงเรียนเกาะสมุย)**, Thailand.

It uses only HTML, CSS and JavaScript. There is no backend, database, build step or
library to install.

---

## 1. Preview the website

**Option A: double-click.** Open `index.html` in any modern browser (Chrome, Edge,
Safari or Firefox). Everything works straight from the file.

**Option B: local server (recommended while editing).**

```bash
cd /home/creamieserver/labs/student_consill
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl + C` in the terminal to stop.

To check how the site looks on a phone, open the browser's developer tools
(`F12`) and turn on the device toolbar (`Ctrl + Shift + M`).

---

## 2. Project structure

```
student_consill/
├── index.html            ← page skeleton (you rarely need to edit this)
├── README.md             ← this guide
├── assets/
│   ├── images/           ← photos, logo, hero background, clouds
│   ├── icons/            ← favicon
│   └── fonts/            ← self-hosted web fonts (work offline)
├── css/
│   ├── style.css         ← colours, typography, components (mobile first)
│   └── responsive.css    ← tablet / desktop layouts, reduced motion, print
└── js/
    ├── data.js           ← ★ ALL editable content lives here ★
    ├── icons.js          ← SVG icons for policies and social links
    └── main.js           ← builds the page from data.js and runs animations
```

---

## 3. Editing content (`js/data.js`)

All text, names, photos, policies and links are in **`js/data.js`**. Open it in any text
editor (VS Code, Notepad, TextEdit…), change the text between the quotes, save, and
refresh the browser.

> ⚠️ Keep the quotes `"..."` and the commas `,` between items. If the page suddenly shows
> only the default text, a missing comma or quote is the usual cause. Press `F12` and
> look at the **Console** tab: it shows the line with the problem.

### Party and school details

```js
partyName: "NEW LESSON",
partyNameThai: "พรรคนิวเลสซั่น",
slogan: "A New Chapter. A Better School.",
schoolName: "Ko Samui School",
schoolNameThai: "โรงเรียนเกาะสมุย",
ballotNumber: "1",
electionDate: "Election Day · Friday 12 December 2026",
```

### Italic accent words

In headings you can wrap words in `*asterisks*` to show them in the elegant italic style:

```js
headline: "A NEW LESSON *BEGINS.*",
```

### Add a member

Copy one member block, paste it **at the end** of the `members` list, and change the
values:

```js
{
  id: 7,
  number: "07",
  name: "Firstname Lastname",
  nameThai: "ชื่อ นามสกุล",          // optional
  nickname: "Nick",
  position: "Head of Academic Affairs",
  image: "assets/images/member-07.jpg",
  description: "A short introduction about this member.",
  responsibilities: [
    "First responsibility",
    "Second responsibility",
  ],
  slogan: "Personal slogan here.",  // optional, delete the line to hide
  // layout: "c",                   // optional: "a", "b", "c" or "d"
},
```

That is all. The website automatically creates the new member's full-screen section, the
entry in the team list, and the dot in the member navigator.

### Remove a member

Delete their whole `{ ... },` block.

### Reorder members

Move the blocks into the order you want. Update the `number` fields if needed.

### Member layouts

Member sections rotate through four designs:

| Layout | Look |
|---|---|
| `a` | Text on the left, arched portrait on the right |
| `b` | Tilted photo card on the left, text on the right |
| `c` | Capsule portrait in the centre, text split on both sides |
| `d` | Sky-blue colour panel with portrait on the left, text on the right |

Add `layout: "b"` (for example) to a member to pick a design yourself.

### Policies

Each policy has a title, a category, an icon and a description:

```js
{
  title: "Open Study Rooms",
  category: "Academics",
  icon: "book",
  description: "Quiet study rooms open until 17:30 before exams…",
},
```

- The category filter buttons are created automatically from the categories you use.
- Available icons: `book`, `chat`, `leaf`, `star`, `drop`, `heart`, `users`, `trophy`,
  `wifi`, `bus`, `sun`, `calendar`. To add your own, add a new entry to `js/icons.js`.

### Social media

```js
socials: [
  { platform: "instagram", label: "Instagram", url: "https://instagram.com/yourparty" },
  { platform: "line",      label: "LINE OpenChat", url: "https://line.me/..." },
],
```

Available icons: `instagram`, `facebook`, `tiktok`, `line`, `youtube`, `x`.
Real links open in a new tab.

---

## 4. Replacing images

All images live in `assets/images/`. The sample images are illustrated placeholders that
show where real photos go.

| File | Used for | Recommended size |
|---|---|---|
| `member-01.jpg` … `member-06.jpg` | Member portraits | **1000 × 1250 px** (portrait, 4:5) |
| `hero-background.jpg` | Sky behind the opening section | 2400 × 1500 px |
| `hero-island.png` | Island and sea layer in the opening section (transparent PNG) | 2400 × 900 px |
| `cloud-01.png`, `cloud-02.png` | Floating cloud layers (transparent PNG) | 1200 × 480 px |
| `party-logo.png` | Party logo (nav bar, party card, closing section) | 512 × 512 px, square |

**The easiest way:** save your new photo with the **same file name** (for example
`member-01.jpg`) and replace the old file. No code changes are needed.

**Or use a new name:** copy the photo into `assets/images/` and update its path in
`js/data.js`, for example `image: "assets/images/tonkla.jpg"`.

Photo tips:
- Use **portrait** photos in a 4:5 ratio, with the face in the upper-middle part of
  the frame. Photos are cropped to fill the frame automatically.
- Light or sky-blue backgrounds suit the theme best.
- Keep each photo under about **300 KB**. Export as JPG at 80% quality, or use a tool
  like [squoosh.app](https://squoosh.app), so the site loads fast on mobile data.
- If a photo is missing or the path is wrong, the site shows a styled placeholder with
  the member's initials ("Photo coming soon") instead of a broken image.

---

## 5. Changing colours and fonts

### Colours

The quickest way is the `theme` section in `js/data.js`:

```js
theme: {
  primary: "#69BDF5",    // Sky Blue
  secondary: "#B9E1FF",  // Light Blue
  background: "#FFFFFF", // White
  text: "#173B63",       // Deep Navy
  accent: "#EAF6FF",     // Soft Blue
},
```

The same values are also the CSS variables at the top of `css/style.css` (`--c-primary`,
`--c-text`, …). Lighter and darker shades are worked out from these automatically.

### Fonts

The fonts are self-hosted in `assets/fonts/`:

- **Bricolage Grotesque**: headings and body text
- **Instrument Serif** (italic): accent words, nicknames and slogans
- **Noto Sans Thai**: Thai text

To change them, replace the `@font-face` rules at the top of `css/style.css` and the
`--font-display`, `--font-body` and `--font-serif` variables.

---

## 6. Features

- **Hero**: layered parallax scene (sky, clouds, giant wordmark, island, paper planes)
  that also reacts gently to mouse movement on desktop, plus a rotating
  "Meet Our Team" scroll badge.
- **Party introduction**: a statement whose words light up as you scroll, a party
  card with stats, Philosophy / Vision / Mission cards, and a scrolling slogan band.
- **Team list**: a table of contents of all members. On desktop, a photo preview
  follows the cursor.
- **Member showcase**: one full-screen section per member, in four rotating layouts.
  Each has portrait reveal and depth parallax, a giant outlined number, a drifting
  nickname, and a spinning candidate badge. A floating navigator shows which member you
  are viewing and lets you jump to any member.
- **Policies**: cards with category filter, a cursor glow on hover, and animated icons.
- **Closing**: "THE FUTURE STARTS WITH US." with a call to action, election date,
  and social links.
- **Accessibility**: semantic HTML, skip link, keyboard-friendly navigation,
  visible focus styles, alt text, and support for the **prefers-reduced-motion**
  setting (all motion is turned off for users who ask for less motion).
- **Performance**: no libraries. Parallax uses one `requestAnimationFrame` loop and
  reads no layout while scrolling. Images below the fold are lazy-loaded.

---

## 7. Publishing online (optional)

Because this is a static site, you can upload the whole folder to any static host for
free, for example **GitHub Pages**, **Netlify** (drag-and-drop the folder) or
**Cloudflare Pages**. Before publishing:

1. Replace placeholder photos and `#` social links.
2. Update the `<title>` and `<meta name="description">` near the top of `index.html`.
   Search engines and link previews read these.
