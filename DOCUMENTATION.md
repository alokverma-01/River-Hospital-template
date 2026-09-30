# Hospital Website Template — Customization Guide

This guide shows you, step by step, how to turn this template into a website for your own hospital or clinic. You don't need to be a programmer. If you can edit a text file carefully, you can do this.

---

## Contents

1. [What you need](#1-what-you-need)
2. [How to preview the website](#2-how-to-preview-the-website)
3. [The files you will edit](#3-the-files-you-will-edit)
4. [Rules for editing config.js (read this first)](#4-rules-for-editing-configjs-read-this-first)
5. [Hospital name, logo and contact details](#5-hospital-name-logo-and-contact-details)
6. [Opening hours](#6-opening-hours)
7. [Live clock and time zone (contact page)](#7-live-clock-and-time-zone-contact-page)
8. [Departments](#8-departments)
9. [Doctors](#9-doctors)
10. [Patient reviews](#10-patient-reviews)
11. [Gallery photos](#11-gallery-photos)
12. [Numbers, patient journey, FAQs, partners and social links](#12-numbers-patient-journey-faqs-partners-and-social-links)
13. [Colours, fonts and spacing](#13-colours-fonts-and-spacing)
14. [Map](#14-map)
15. [Forms: where appointment requests go](#15-forms-where-appointment-requests-go)
16. [Text that is written directly in the pages](#16-text-that-is-written-directly-in-the-pages)
17. [Menu, favicon and footer links](#17-menu-favicon-and-footer-links)
18. [Publishing the website](#18-publishing-the-website)
19. [Checklist before going live](#19-checklist-before-going-live)
20. [Problems and fixes](#20-problems-and-fixes)

---

## 1. What you need

- **A text editor.** We recommend [Visual Studio Code](https://code.visualstudio.com/) (free). Notepad also works, but it is harder to spot mistakes.
- **A web browser** such as Chrome, Edge, Firefox or Safari.
- **Your hospital's details:** name, phone numbers, email, address, opening hours, departments, doctors, photos and logo.

You do **not** need to install anything else. There is no build step and no database.

---

## 2. How to preview the website

**Quick way:** double-click `index.html`. It opens in your browser. Most things work this way.

**Better way (recommended):** some features, like page transitions and the map, work best through a small local server.

- **In VS Code:** install the free **Live Server** extension. Right-click `index.html` and choose **Open with Live Server**. The page reloads by itself every time you save a file.
- **Or, if you have Node.js installed:** open a terminal in the template folder and type `npx serve`, then open the address it shows.

After each change, **save the file and refresh the browser** to see the result.

---

## 3. The files you will edit

Most of your work happens in **two files**:

| File | What it controls |
|---|---|
| `assets/js/config.js` | **All the content:** name, phones, email, address, hours, clock, departments, doctors, reviews, gallery, FAQs, map, forms and social links. Change it once and every page updates. |
| `assets/css/theme.css` | **The look:** colours, fonts, rounded corners and spacing. |

Sometimes you will also touch:

| File or folder | When |
|---|---|
| `assets/img/` | To add your logo, doctor photos, gallery photos and favicon. |
| The `.html` pages | To change a few headings and sentences that are written directly in the page (see [section 16](#16-text-that-is-written-directly-in-the-pages)). |
| `assets/js/layout.js` | Only to change the menu items or the footer's privacy links (see [section 17](#17-menu-favicon-and-footer-links)). |

**The pages:**

| Page | File |
|---|---|
| Home | `index.html` |
| Services / departments | `services.html` |
| Doctors | `doctors.html` |
| Book appointment | `appointment.html` |
| Reviews | `reviews.html` |
| Gallery | `gallery.html` |
| Contact (with map and clock) | `contact.html` |
| Page not found | `404.html` |

You can ignore the other files in `assets/css/` and `assets/js/`. They run the design and animations and read everything from `config.js` and `theme.css`.

---

## 4. Rules for editing config.js (read this first)

`config.js` is a list of settings. Each setting looks like this:

```js
phone: "+1 (555) 010-2000",
```

- The part **before** the colon (`phone`) is the setting's **name**. **Never change it.**
- The part **after** the colon is the **value**. This is what you change.

**Follow these rules and nothing will break:**

1. **Keep the quote marks.** Text always sits inside quotes: `"Like this"`.
2. **Keep the comma at the end of each line.** In lists, keep the comma between items.
3. **Numbers have no quotes:** `experience: 16`, not `experience: "16"`.
4. **`true` and `false` have no quotes.**
5. **Don't delete brackets:** `{ }` and `[ ]` always come in pairs.
6. **Apostrophes are fine** inside the quotes: `"Children's ward"`. But a **double quote mark** (`"`) inside your text would end the text early. Use curly quotes (“ ”) instead, or put a backslash before it: `"The \"best\" care"`.
7. Lines starting with `//`, and text between `/*` and `*/`, are **notes for you**. The website ignores them.

**Tip:** make a copy of `config.js` before you start. If something goes wrong, you can go back.

**If the page goes blank or the content disappears** after an edit, you almost always have a missing comma, quote mark or bracket near the line you just changed. Press **F12** in the browser and open the **Console** tab. The red message tells you the line number.

---

## 5. Hospital name, logo and contact details

Open `assets/js/config.js`. At the top you will find:

```js
name: "Riverbend General Hospital",
shortName: "Riverbend",
tagline: "Specialist care, close to home",
intro: "From a same-day checkup to complex surgery, ...",
logo: "",

phone: "+1 (555) 010-2000",
phoneHref: "+15550102000",
emergencyPhone: "911",
emergencyLabel: "Emergency department open 24/7",
whatsapp: "15550102000",
email: "appointments@example.org",
address: "240 Riverside Avenue, Springfield, ST 00000",
```

| Setting | What it is | Example |
|---|---|---|
| `name` | Full hospital name. Used in the browser tab, the footer and the copyright line. | `"Sunrise Medical Centre"` |
| `shortName` | The big word in the logo. The rest of `name` appears in small text underneath. | `"Sunrise"` → big "Sunrise", small "Medical Centre" |
| `tagline` | The main headline on the home page. | `"Caring for our city since 1985"` |
| `intro` | The paragraph under the home headline. | One or two sentences. |
| `logo` | Path to your logo file. Leave it as `""` to show the built-in heartbeat logo. | `"assets/img/logo.svg"` |
| `phone` | Front-desk number **as people should read it**. | `"+91 98765 43210"` |
| `phoneHref` | The **same number with digits only** (a `+` at the start is fine). Used when people tap to call. | `"+919876543210"` |
| `emergencyPhone` | Emergency number, shown in the red bar at the top. | `"108"` or `"911"` |
| `emergencyLabel` | Text in the red emergency bar. | `"Emergency open 24 hours"` |
| `whatsapp` | WhatsApp number with **digits only**, including the country code. No `+`, no spaces. | `"919876543210"` |
| `email` | Main email address. | `"hello@sunrise.org"` |
| `address` | Full street address. | `"12 MG Road, Pune 411001"` |

**Adding your logo:**
1. Put your logo file in `assets/img/`, for example `assets/img/logo.svg`. SVG or PNG both work. A square logo looks best.
2. Set `logo: "assets/img/logo.svg",`.

---

## 6. Opening hours

```js
hours: [
  { days: "Monday – Friday", time: "8:00 am – 8:00 pm" },
  { days: "Saturday", time: "9:00 am – 4:00 pm" },
  { days: "Sunday", time: "Outpatients closed" },
  { days: "Emergency", time: "Open 24/7" }
],
closedWeekdays: [0],
visitingHours: "Daily, 11:00 am – 8:00 pm (two visitors per patient)",
```

- **`hours`** is what visitors **read** on the contact page, the appointment page and in the footer. Write it any way you like. Add or remove lines, keeping one `{ days: "...", time: "..." }` per line with commas between them.
- **`closedWeekdays`** stops people from booking an appointment on days you are closed. Use numbers: `0` = Sunday, `1` = Monday, `2` = Tuesday, `3` = Wednesday, `4` = Thursday, `5` = Friday, `6` = Saturday.
  - Closed Sundays only: `[0]`
  - Closed Saturday and Sunday: `[0, 6]`
  - Open every day: `[]`
- **`visitingHours`** appears on the home page under "Visiting and directions".

> **Important:** the contact-page clock uses its own hours list (next section). When you change your hours, update **both** `hours` and `clock.clinicHours`.

---

## 7. Live clock and time zone (contact page)

The contact page shows a live clock with the **hospital's local time**. It also says whether the clinics are open right now ("closes 8:00 pm" or "opens tomorrow 8:00 am"). Visitors in another time zone also see their own time.

```js
clock: {
  enabled: true,
  timeZone: "America/New_York",
  label: "Local time at the hospital",
  hour12: true,
  showSeconds: true,
  showDate: true,
  showVisitorTime: true,
  clinicHours: {
    sun: null,
    mon: ["08:00", "20:00"],
    tue: ["08:00", "20:00"],
    wed: ["08:00", "20:00"],
    thu: ["08:00", "20:00"],
    fri: ["08:00", "20:00"],
    sat: ["09:00", "16:00"]
  },
  openText: "Outpatient clinics open",
  closedText: "Outpatient clinics closed",
  emergencyText: "Emergency department open 24/7"
},
```

| Setting | What it does |
|---|---|
| `enabled` | `false` hides the clock completely. |
| `timeZone` | Your hospital's time zone. See the list below. |
| `label` | The small title on the clock card. |
| `hour12` | `true` shows 8:45 pm. `false` shows 20:45. |
| `showSeconds` | `false` hides the seconds. |
| `showDate` | `false` hides the date line. |
| `showVisitorTime` | `false` hides the "Your time: …" line for visitors in other time zones. |
| `clinicHours` | Opening and closing time for each day, **in 24-hour format**. Write `null` (no quotes) for a closed day. |
| `openText`, `closedText`, `emergencyText` | The wording on the card. |

**24-hour format help:** 8:00 am = `"08:00"`, 12:30 pm = `"12:30"`, 4:00 pm = `"16:00"`, 8:00 pm = `"20:00"`.

**Common time zones:**

| Country / city | `timeZone` value |
|---|---|
| India | `"Asia/Kolkata"` |
| UAE (Dubai) | `"Asia/Dubai"` |
| Saudi Arabia | `"Asia/Riyadh"` |
| Pakistan | `"Asia/Karachi"` |
| Bangladesh | `"Asia/Dhaka"` |
| Nepal | `"Asia/Kathmandu"` |
| Singapore | `"Asia/Singapore"` |
| United Kingdom | `"Europe/London"` |
| Germany / France | `"Europe/Berlin"` / `"Europe/Paris"` |
| Nigeria | `"Africa/Lagos"` |
| Kenya | `"Africa/Nairobi"` |
| South Africa | `"Africa/Johannesburg"` |
| USA, East (New York) | `"America/New_York"` |
| USA, Central (Chicago) | `"America/Chicago"` |
| USA, West (Los Angeles) | `"America/Los_Angeles"` |
| Canada (Toronto) | `"America/Toronto"` |
| Australia (Sydney) | `"Australia/Sydney"` |

Find any other zone in the "TZ identifier" column [on this list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Summer time (daylight saving) is handled automatically.

If you mistype the time zone, the clock doesn't break. It shows the visitor's own time instead, so check it carefully.

---

## 8. Departments

Departments appear on the home page (sideways-scrolling cards with arrow buttons), on the Services page, in the footer and in the appointment form.

```js
{ id: "cardiology", name: "Cardiology", icon: "heart-pulse",
  summary: "Heart checks, ECG and echo, cardiac rehab and 24/7 chest-pain care.",
  conditions: ["Chest pain", "High blood pressure", "Arrhythmia", "Heart failure"] },
```

| Setting | What it is |
|---|---|
| `id` | A short code for the department: **lowercase letters, numbers and dashes only, no spaces**. Doctors use it to link to their department. |
| `name` | The name people see. |
| `icon` | An icon name from [lucide.dev/icons](https://lucide.dev/icons). Search for an icon, click it and copy its name, e.g. `stethoscope`, `baby`, `brain`, `bone`, `eye`, `pill`, `syringe`, `activity`, `smile`. |
| `summary` | One sentence about the department. |
| `conditions` | A few short tags shown on the card. |

- **To add a department:** copy a whole `{ ... },` block, paste it below and change the values.
- **To remove one:** delete its whole block. Then check that no doctor still uses that `id`.
- The footer shows the first 6 departments.
- The home-page numbering ("01/08") and the arrow buttons adjust automatically.

---

## 9. Doctors

```js
{ id: "dr-amelia-lee", name: "Dr. Amelia Lee", dept: "cardiology", title: "Consultant Cardiologist",
  qualifications: "MD, FACC", experience: 16, languages: ["English", "Spanish"],
  days: "Mon, Wed, Fri", gender: "female", photo: "" },
```

| Setting | What it is |
|---|---|
| `id` | A unique short code, e.g. `"dr-amelia-lee"` (lowercase, dashes, no spaces). |
| `name` | Full name as shown. |
| `dept` | **Must exactly match a department's `id`** from section 8, e.g. `"cardiology"`. |
| `title` | Job title. |
| `qualifications` | Degrees. |
| `experience` | Years of experience, as a **number without quotes**. |
| `languages` | Languages spoken. Visitors can type a language into the Doctors page search box to find matching doctors. |
| `days` | Clinic days, in any wording. |
| `gender` | `"female"` or `"male"`. |
| `photo` | Path to a photo, or `""` to show the doctor's initials instead. |

**Adding doctor photos:**
1. Create a folder `assets/img/doctors/` and put the photos in it.
2. Use portrait photos, about **800 × 840 pixels**, all the same shape, in JPG or WebP format.
3. Set `photo: "assets/img/doctors/amelia-lee.jpg"`.

The home page carousel and the Doctors page (with its filters) update by themselves.

---

## 10. Patient reviews

```js
{ name: "Janet P.", rating: 5, date: "2026-08-14", source: "Google",
  text: "The cardiology team saw my father within the hour..." },
```

| Setting | What it is |
|---|---|
| `name` | Reviewer's name. For privacy, a first name and initial is best. |
| `rating` | A number from 1 to 5, no quotes. |
| `date` | Written as `"YYYY-MM-DD"`, e.g. `"2026-08-14"`. |
| `source` | Where the review came from, e.g. `"Google"`. |
| `text` | The review itself. |

The average rating, star count and rating bars are calculated automatically.

**`reviewLink`** (further down in config): paste the link to your Google review page so the "Write a review" button works.

> Use real reviews only, with the patient's permission. Fake reviews can break advertising and consumer laws.

---

## 11. Gallery photos

```js
{ src: "assets/img/gallery/lobby.svg", w: 1200, h: 800, alt: "Main entrance and reception", tag: "facility" },
```

| Setting | What it is |
|---|---|
| `src` | Path to the image. |
| `w`, `h` | The image's **real width and height in pixels**. This stops the page jumping while photos load. |
| `alt` | A short description of the photo. Screen readers read it, and it also appears as the caption. |
| `tag` | A category. **The filter buttons are created from your tags automatically**, so if you use `"events"`, an "Events" button appears. |

**To use your own photos:**
1. Put your photos in `assets/img/gallery/`. Keep each one under about 300 KB, around 1600 pixels wide at most. You can shrink photos for free at [squoosh.app](https://squoosh.app).
2. Update each line's `src`, `w`, `h`, `alt` and `tag`.
3. Delete the sample `.svg` illustrations you no longer use.

**How to find a photo's width and height:** on Windows, right-click the file → **Properties** → **Details**. On a Mac, open it in Preview → **Tools** → **Show Inspector**.

---

## 12. Numbers, patient journey, FAQs, partners and social links

### Numbers (`stats`)

```js
stats: [
  { value: 38, suffix: "", label: "years caring for Springfield" },
  { value: 120, suffix: "+", label: "specialist doctors" },
  { value: 52000, suffix: "", label: "patients treated last year" },
  { value: 14, suffix: " min", label: "average emergency wait" }
],
```

These count up on the home page. `value` is a number without quotes. `suffix` is added after it, e.g. `"+"` or `" min"`.

> Keep **4 items in this order**. The home page's top section reuses item 2 ("120+ specialists") and item 4 ("14 min average emergency wait").

### Patient journey (`journey`)

The 4 numbered steps on the Services page. Each step has a `title`, an `icon` (from [lucide.dev/icons](https://lucide.dev/icons)) and a `text`.

### FAQs (`faqs`)

Questions and answers on the Contact page. `q` = question, `a` = answer. Add or remove as many as you like.

### Insurance and accreditation partners (`accreditations`)

The names in the scrolling strip on the home page. It's a simple list of text: `"Name one", "Name two",`.

### Social media (`social`)

```js
social: { facebook: "#", instagram: "#", linkedin: "#", youtube: "#" }
```

Replace each `"#"` with your page's full link, e.g. `"https://facebook.com/sunrisehospital"`. To remove an icon, delete that item and its comma.

---

## 13. Colours, fonts and spacing

Open `assets/css/theme.css`.

### Colours

```css
--brand: #1f6f66;      /* main colour */
--brand-700: #164f49;  /* darker version of the main colour */
--brand-100: #d3e8e2;  /* light version */
--brand-50: #eaf4f1;   /* very light version (backgrounds) */
--accent: #f4b43c;     /* "Book appointment" buttons */
--accent-700: #c98c14; /* darker accent */
--emergency: #c8102e;  /* emergency bar and tiles */
--ink: #12302e;        /* text and dark sections */
--muted: #4f6562;      /* grey text */
--line: #d6e2de;       /* borders */
--paper: #f4f7f5;      /* page background */
--surface: #ffffff;    /* cards and form fields */
```

Colours are written as **hex codes** like `#1f6f66`. Pick colours with any colour picker, for example Google "color picker", or get a full set of shades from [uicolors.app](https://uicolors.app): paste your main colour and copy the 700, 100 and 50 shades.

**Keep text readable:** dark text on light backgrounds, and white text on dark colours. Check your pairs at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/).

**Also change the browser bar colour** on phones: in every `.html` page, find `<meta name="theme-color" content="#1f6f66">` and use your `--brand` colour.

### Fonts

```css
--font-head: "Bricolage Grotesque", ...;  /* headings */
--font-body: "Figtree", ...;              /* normal text */
```

To use different fonts:
1. Choose two fonts on [fonts.google.com](https://fonts.google.com), for example "Poppins" for headings and "Inter" for text.
2. Click **Get font** → **Get embed code** and copy the `<link href="https://fonts.googleapis.com/css2?...">` line.
3. In **every** `.html` page, replace the line that starts with `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?` with your new link. **Tip:** in VS Code, use **Edit → Replace in Files** to change all 8 pages at once.
4. In `theme.css`, replace only the first font name in quotes, e.g. `--font-head: "Poppins", ui-sans-serif, system-ui, sans-serif;`.

### Rounded corners

`--r-xl`, `--r-lg`, `--r-md` and `--r-sm` control how round the corners are. Smaller numbers give a sharper look; `0px` gives square corners.

### Spacing (the gaps between sections)

```css
--space-section: clamp(3rem, 6vw, 5rem);        /* gap between main sections */
--space-section-tight: clamp(2rem, 4vw, 3rem);  /* gap for compact sections */
--space-hero-top: clamp(1.5rem, 3vw, 2.5rem);   /* space under the header */
--space-head: clamp(1.5rem, 3vw, 2.5rem);       /* space under section titles */
```

Each value reads as **(smallest on phones, grows with screen width, largest on big screens)**. For a tighter site, lower the numbers. For more breathing room, raise them. For example, `clamp(2rem, 4vw, 3.5rem)` is tighter than the default. `1rem` is about 16 pixels.

Two plain sections placed one after the other share one gap automatically, so moving or deleting sections never leaves big empty spaces.

### Page width

`--container: 1200px;` is the maximum width of the content on large screens.

---

## 14. Map

The contact page shows a map. It needs no API key and no account.

```js
map: {
  provider: "leaflet",
  lat: 40.7128,
  lng: -74.006,
  zoom: 15,
  googleEmbedSrc: ""
},
```

**Option A: OpenStreetMap (default, free)**
1. Open [Google Maps](https://maps.google.com) and find your hospital.
2. **Right-click** the exact spot. The first line of the menu shows two numbers, e.g. `18.5204, 73.8567`. Click them to copy.
3. The first number is `lat`, the second is `lng`: `lat: 18.5204, lng: 73.8567,` (numbers, no quotes).
4. `zoom`: 15 is a good street-level view. Higher numbers zoom in closer.

**Option B: Google Maps**
1. In Google Maps, open your hospital → **Share** → **Embed a map** → **Copy HTML**.
2. The copied code looks like `<iframe src="https://www.google.com/maps/embed?pb=..." ...>`. Copy **only the address inside `src="..."`**.
3. Paste it into `googleEmbedSrc: "https://www.google.com/maps/embed?pb=..."`.
4. Set `provider: "google"`.

Also set `lat` and `lng` in both cases. The "Get directions" link uses them.

---

## 15. Forms: where appointment requests go

The **Book appointment** and **Contact** forms send their messages using the method you choose:

```js
form: {
  method: "formsubmit",
  endpoint: "https://formsubmit.co/appointments@example.org",
  thankYouUrl: "appointment.html?sent=1",
  contactThankYouUrl: "contact.html?sent=1",
  responseTime: "within 4 working hours"
},
```

Choose **one** `method`:

| Method | How it works | Setup |
|---|---|---|
| `"formsubmit"` (default) | Each request arrives in your **email inbox**. Free, no account. | Set `endpoint` to `"https://formsubmit.co/YOUR-EMAIL"`. After publishing, submit the form once yourself. FormSubmit emails you an **activation link**: click it, and from then on every request reaches your inbox. |
| `"formspree"` | Requests arrive by email, and you can also see them in a dashboard. Free plan available. | Sign up at [formspree.io](https://formspree.io), create a form and paste its address (like `"https://formspree.io/f/abcdwxyz"`) into `endpoint`. |
| `"whatsapp"` | Opens WhatsApp on the patient's phone or computer with the request already written. The patient presses send. | Make sure `whatsapp` (section 5) is set. `endpoint` is not used. |
| `"mailto"` | Opens the patient's email app with the request already written. | Make sure `email` (section 5) is set. `endpoint` is not used. |

`responseTime` is the promise shown to patients after they send a request, e.g. `"within 1 working day"`.

**Test the form after publishing.** Send a test request and make sure it arrives.

> **Privacy:** the forms only ask for contact and scheduling details. Do not add questions about symptoms or medical history unless your form service is approved for health data where you live (for example HIPAA in the USA). Don't add advertising or tracking tools to the appointment and contact pages. Ask your legal team to review the privacy policy.

---

## 16. Text that is written directly in the pages

Most text comes from `config.js`, but some headings and sentences are written directly in the `.html` files. Open the page in your editor, search for the sentence (**Ctrl + F**, or **Cmd + F** on Mac) and type over it. **Only change the words between the tags**, never the parts inside `< >`.

For example, to change:

```html
<h2 data-split>Meet the specialists</h2>
```

only edit `Meet the specialists`.

**Things worth checking on the home page (`index.html`):**

| Text | Note |
|---|---|
| "Emergency department open now" | Top of the hero. |
| "Nationally accredited" | Under the hero buttons. |
| "Same-day appointments" / "Request before noon to be seen today" | The card on the heart monitor. |
| "**across 8 departments**" | Written by hand. **Update it if you change the number of departments.** |
| Section headings like "A hospital your family already knows" | Change to suit your hospital. |

**Browser tab titles and search descriptions:** at the top of each page:

```html
<title>Home | {{name}}</title>
<meta name="description" content="Book appointments, find specialist doctors and get emergency care.">
```

- `{{name}}` is replaced by your hospital name automatically. **Leave it as it is.**
- Rewrite the `description` for each page. Google shows it in search results; one sentence of about 150 characters is ideal.

---

## 17. Menu, favicon and footer links

### Menu

The top menu is defined in `assets/js/layout.js`, near the top:

```js
const nav = [
  { id: "home", href: "index.html", label: "Home" },
  { id: "services", href: "services.html", label: "Services" },
  ...
];
```

- **To rename a menu item,** change its `label`.
- **To hide a page from the menu,** delete its line (you can also delete the page file).
- **To add a new page:** copy an existing page such as `services.html`, rename it (e.g. `about.html`) and change its content. Change `data-page="services"` in its `<body>` tag to `data-page="about"`. Then add `{ id: "about", href: "about.html", label: "About" },` to the menu list.

### Favicon (the small icon in the browser tab)

Replace `assets/img/favicon.svg` with your own icon, using the same file name. If your icon is a PNG, name it `favicon.png` and, in every page, change `href="assets/img/favicon.svg" type="image/svg+xml"` to `href="assets/img/favicon.png" type="image/png"`.

### Footer: privacy and accessibility links

In `assets/js/layout.js`, search for `Privacy policy`. Replace the two `href="#"` with links to your real pages:

```js
<a href="privacy.html">Privacy policy</a><a href="accessibility.html">Accessibility statement</a>
```

The copyright year updates by itself.

---

## 18. Publishing the website

Upload the **whole template folder**: all the `.html` files plus the `assets` folder. Keep the folder structure exactly the same.

**Easiest: Netlify Drop (free)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the template folder onto the page.
3. Your site is live in seconds. Create a free account to keep it, and connect your own domain under **Domain settings**.

**Other options:**
- **Vercel** ([vercel.com](https://vercel.com)): create a new project and upload the folder, or connect a GitHub repository.
- **GitHub Pages:** upload the files to a GitHub repository, then go to **Settings → Pages** and select the main branch.
- **cPanel / regular web hosting:** open **File Manager**, go to `public_html` and upload all the files and the `assets` folder (or upload a ZIP and extract it there).

The **404 page:** Netlify and GitHub Pages use `404.html` automatically. On cPanel, set it under **Error Pages**, or add this line to a file called `.htaccess`: `ErrorDocument 404 /404.html`.

---

## 19. Checklist before going live

- [ ] Hospital name, short name, tagline and intro are correct.
- [ ] Every phone number works when tapped on a phone (check `phoneHref` and `emergencyPhone`).
- [ ] WhatsApp number is digits only, with the country code.
- [ ] Email and address are correct.
- [ ] Opening hours match in `hours`, `closedWeekdays` and `clock.clinicHours`.
- [ ] Clock `timeZone` is your hospital's time zone.
- [ ] All sample doctors, reviews and gallery images are replaced with real ones.
- [ ] Every doctor's `dept` matches a department `id`.
- [ ] "across 8 departments" on the home page matches your number.
- [ ] Map shows the right building.
- [ ] Form test submitted and received (FormSubmit activation link clicked).
- [ ] Social links and review link point to your real pages.
- [ ] Privacy policy and accessibility links point to real pages.
- [ ] Logo, favicon and `theme-color` updated.
- [ ] Page descriptions rewritten.
- [ ] Checked on a phone as well as a computer.

---

## 20. Problems and fixes

| Problem | Fix |
|---|---|
| **Page is blank, or lists and cards are missing.** | There is a typing mistake in `config.js`, usually a missing comma, quote or bracket near your last change. Press **F12** → **Console** to see the line number. |
| **An icon is missing.** | The icon name is misspelled or doesn't exist. Check the exact name on [lucide.dev/icons](https://lucide.dev/icons). |
| **A doctor shows the wrong department (or a code like "cardio").** | The doctor's `dept` doesn't match any department `id`. Make them exactly the same. |
| **A photo doesn't show.** | Check the path and spelling, including capital letters: `Photo.JPG` is not the same as `photo.jpg` on most web hosts. |
| **The map is empty.** | Check `lat` and `lng` (numbers, no quotes). For Google, paste only the `src` address, and set `provider: "google"`. |
| **Form requests don't arrive.** | For FormSubmit, click the activation email (check spam). Make sure `endpoint` contains your email address. |
| **The clock shows the wrong time.** | Check `timeZone` spelling, e.g. `"Asia/Kolkata"`, with a capital letter after the slash. |
| **Animations feel too much.** | Visitors can switch them off with **Reduce motion** in the footer. The site also respects the device's own reduce-motion setting. |
| **Changes don't appear.** | Save the file, then do a hard refresh: **Ctrl + F5** (Windows) or **Cmd + Shift + R** (Mac). |

---

**That's it.** For most hospitals, editing `config.js` and `theme.css` and replacing the images is all you need.
