# Hospital Website Template

> **New here? Read [DOCUMENTATION.md](DOCUMENTATION.md)**: a step-by-step customization guide in plain language.

A multi-page, animated hospital website in plain HTML, CSS and JavaScript. No build step, no framework.

**Pages:** Home, Services, Doctors, Book Appointment, Reviews, Gallery, Contact (with map), and a 404 page.

## Rebrand in 6 steps

1. **Content:** edit `assets/js/config.js`. Hospital name, phones, email, address, hours, departments, doctors, reviews, gallery, FAQs and insurance partners all live in this one file. Every page updates automatically.
2. **Colours, fonts and spacing:** edit `assets/css/theme.css`. If you change fonts, also update the Google Fonts `<link>` in each HTML page. The `--space-*` values control the vertical gaps between sections on every page. Two plain sections placed back to back share one gap automatically, so you can add, remove or reorder sections without creating big empty areas.
3. **Images:** replace the illustrations in `assets/img/gallery/` with real photos and update the `gallery` list in config (keep `w` and `h` accurate so the layout doesn't jump). Add doctor photos by setting each doctor's `photo` path; leave it empty to show initials. Add a logo with `logo: "assets/img/logo.svg"`. Replace `assets/img/favicon.svg`.
4. **Clock (contact page):** in config, set `clock.timeZone` to the hospital's zone (e.g. `"Asia/Kolkata"`, `"Europe/London"`) and `clock.clinicHours` to its opening times. Set `hour12: false` for a 24-hour clock, or `enabled: false` to hide it.
5. **Map:** set `map.lat` and `map.lng`. To use Google Maps instead of OpenStreetMap, open Google Maps, choose **Share > Embed a map**, copy only the `src` URL into `map.googleEmbedSrc`, and set `provider: "google"`.
6. **Forms:** set `form.method` and `form.endpoint`.
   - `formsubmit` (default): set the endpoint to `https://formsubmit.co/your@email`. The first submission sends an activation email you must confirm.
   - `formspree`: create a form at formspree.io and paste its endpoint.
   - `whatsapp` or `mailto`: opens the patient's WhatsApp or email app with the request pre-filled. No service needed.

Then upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel).

## What's animated

| Where | Effect | Library |
|---|---|---|
| First page of a visit | Heartbeat-line loader | GSAP |
| Moving between pages | Page transitions (Chrome, Edge, Safari) | Native View Transitions |
| All headings | Line-by-line text reveal | GSAP SplitText |
| Whole site (mouse users) | Smooth inertial scrolling | Lenis |
| Home hero | Live heart monitor, tilt on mouse move, floating cards | GSAP + CSS |
| Home departments | Pinned horizontal scroll (swipe on phones) | GSAP ScrollTrigger |
| Stats | Counting numbers | GSAP |
| Doctors and reviews | Carousels | Swiper |
| Cards and buttons | 3D tilt and magnetic buttons (mouse only) | GSAP |
| Accreditations | Infinite logo strip with pause button | CSS |
| Gallery | Filter animation and full-screen lightbox | GLightbox |
| Services | Journey line that fills as you scroll | GSAP ScrollTrigger |
| Contact | Live clock in the hospital's time zone with open/closed status | Native Intl API |
| Contact | Lazy-loaded map with custom pin | Leaflet + OpenStreetMap |

## Accessibility and motion

- The site honours the device's "reduce motion" setting, and the footer has a **Reduce motion** button that remembers the choice.
- Anything that moves on its own (reviews carousel, logo strip, heart monitor) has its own pause button.
- Everything works without the animation libraries: if a CDN fails, content stays visible and horizontal sections become swipeable.
- Forms have labelled fields, an error summary that links to each problem, and keyboard-friendly steps.

## Privacy note for the appointment form

The forms only collect contact and scheduling details. Keep it that way unless you switch to a HIPAA-compliant (or local-equivalent) form provider: generic form services won't sign a Business Associate Agreement. Avoid adding advertising pixels or session-recording tools to `appointment.html` and `contact.html`. Have each hospital's legal team review the privacy policy and form before launch.

## Files

```
index.html  services.html  doctors.html  appointment.html
reviews.html  gallery.html  contact.html  404.html
assets/
  css/theme.css        ← colours, fonts, radius (rebrand)
  css/style.css        ← layout and components
  css/animations.css   ← page transitions, reduced motion
  js/config.js         ← all hospital content (rebrand)
  js/layout.js         ← shared header, footer, menu
  js/render.js         ← builds lists, cards, filters from config
  js/motion.js         ← animations, carousels, lightbox
  js/forms.js          ← appointment + contact forms
  js/map.js            ← contact map
  js/clock.js          ← live hospital-time clock (contact page)
  img/                 ← favicon and gallery illustrations
```

## Library versions (loaded from CDN, pinned)

GSAP 3.15.0 (ScrollTrigger, SplitText), Lenis 1.3.26, Swiper 14.2.0, GLightbox 3.3.1, Leaflet 1.9.4, Lucide 0.460.0. For production you can download these into an `assets/vendor/` folder and point the `<script>` tags there.

Tip: open the site through a local server (`npx serve` or `python3 -m http.server`) rather than double-clicking the files, so page transitions and the map behave as they will online.
