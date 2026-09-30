/* =====================================================================
   LAYOUT — builds the shared header, footer and global UI from config.
   Works from file:// and any static host (no fetch needed).
   ===================================================================== */
(function () {
  const H = window.HOSPITAL;
  const page = document.body.dataset.page || "";

  /* ---------- shared helpers (used by other scripts) ---------- */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (name, cls = "") => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ""} aria-hidden="true"></i>`;
  const initials = (name) => name.replace(/^Dr\.?\s+/i, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const deptName = (id) => (H.departments.find((d) => d.id === id) || {}).name || id;
  const avgRating = () => H.reviews.reduce((s, r) => s + r.rating, 0) / (H.reviews.length || 1);
  const starText = (n) => "★★★★★".slice(0, Math.round(n)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n));
  const pulsePath = "M0 20 H34 L40 8 L48 32 L56 2 L63 38 L69 20 H120";

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add("is-visible"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3800);
  }
  function refreshIcons(root) {
    if (window.lucide && typeof lucide.createIcons === "function") {
      lucide.createIcons({ icons: lucide.icons, attrs: { "stroke-width": 1.9 }, root: root || document });
    }
  }

  window.Site = { esc, icon, initials, deptName, avgRating, starText, pulsePath, toast, refreshIcons };

  /* ---------- nav model ---------- */
  const nav = [
    { id: "home", href: "index.html", label: "Home" },
    { id: "services", href: "services.html", label: "Services" },
    { id: "doctors", href: "doctors.html", label: "Doctors" },
    { id: "reviews", href: "reviews.html", label: "Reviews" },
    { id: "gallery", href: "gallery.html", label: "Gallery" },
    { id: "contact", href: "contact.html", label: "Contact" }
  ];
  const cur = (id) => (id === page ? ' aria-current="page"' : "");
  const nameRest = H.name.replace(H.shortName, "").trim() || "Hospital";
  const logoMark = H.logo
    ? `<img src="${esc(H.logo)}" alt="">`
    : `<svg viewBox="0 0 120 40" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 20 H34 L40 8 L48 32 L56 2 L63 38 L69 20 H112"/></svg>`;
  const logo = `<a class="logo" href="index.html" aria-label="${esc(H.name)} home">
      <span class="logo-mark">${logoMark}</span>
      <span class="logo-text">${esc(H.shortName)}<small>${esc(nameRest)}</small></span></a>`;

  /* ---------- skip link, loader, progress ---------- */
  document.body.insertAdjacentHTML("afterbegin", `
    <a class="skip-link" href="#main">Skip to main content</a>
    <div class="loader" aria-hidden="true"><div class="loader-inner">
      <svg viewBox="0 0 120 40"><path d="${pulsePath}"/></svg>
      <span class="loader-name">${esc(H.name)}</span></div></div>
    <div class="scroll-progress" aria-hidden="true"></div>`);

  /* ---------- header ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    header.outerHTML = `
    <div class="emergency-bar">
      <div class="container">
        <p class="eb-left" style="margin:0"><span class="eb-dot" aria-hidden="true"></span>
          <span><span class="eb-label-long">${esc(H.emergencyLabel)}. </span>In an emergency, <a href="tel:${esc(H.emergencyPhone)}">call ${esc(H.emergencyPhone)}</a></span></p>
        <div class="eb-right">
          <a href="tel:${esc(H.phoneHref)}">Front desk ${esc(H.phone)}</a>
          <a href="mailto:${esc(H.email)}">${esc(H.email)}</a>
        </div>
      </div>
    </div>
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        ${logo}
        <nav class="main-nav" aria-label="Main"><ul>
          ${nav.map((n) => `<li><a href="${n.href}"${cur(n.id)}>${n.label}</a></li>`).join("")}
        </ul></nav>
        <div class="header-actions">
          <a class="btn btn-accent magnetic" href="appointment.html"${cur("appointment")}>${icon("calendar-check")}Book appointment</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobileMenu" aria-label="Open menu">${icon("menu")}</button>
        </div>
      </div>
      <div class="mobile-menu" id="mobileMenu" hidden>
        <div class="container">
          <ul>
            ${nav.map((n) => `<li><a href="${n.href}"${cur(n.id)}>${n.label}${icon("chevron-right")}</a></li>`).join("")}
          </ul>
          <a class="btn btn-accent btn-block" href="appointment.html">${icon("calendar-check")}Book appointment</a>
          <a class="btn btn-emergency btn-block" style="margin-top:.75rem" href="tel:${esc(H.emergencyPhone)}">${icon("phone")}Emergency: call ${esc(H.emergencyPhone)}</a>
        </div>
      </div>
    </header>`;
  }

  /* ---------- footer ---------- */
  const footer = document.getElementById("site-footer");
  const svgSocial = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9h4v12H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm4 6h4v2c.6-1 2-2.2 4-2.2 3.6 0 4 2.4 4 5.4V21h-4v-5.8c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1V21H10Z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15V9l5.2 3Z"/></svg>'
  };
  if (footer) {
    const reduceOn = document.documentElement.classList.contains("reduce-motion");
    footer.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            ${logo}
            <p>${esc(H.tagline)}. ${esc(H.address)}</p>
            <div class="socials">
              ${Object.entries(H.social || {}).map(([k, v]) => `<a href="${esc(v)}" aria-label="${k[0].toUpperCase() + k.slice(1)}">${svgSocial[k] || ""}</a>`).join("")}
            </div>
          </div>
          <div>
            <h2>Visit</h2>
            <ul>${nav.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
              <li><a href="appointment.html">Book appointment</a></li></ul>
          </div>
          <div>
            <h2>Departments</h2>
            <ul>${H.departments.slice(0, 6).map((d) => `<li><a href="services.html#${esc(d.id)}">${esc(d.name)}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h2>Opening hours</h2>
            <ul>${H.hours.map((h) => `<li><strong style="color:#fff">${esc(h.days)}</strong><br>${esc(h.time)}</li>`).join("")}</ul>
          </div>
        </div>
        <p class="disclaimer">This website is for general information and appointment requests only. In a medical emergency, call ${esc(H.emergencyPhone)} or go to the nearest emergency department.</p>
        <div class="footer-bottom">
          <p><span>© ${new Date().getFullYear()} ${esc(H.name)}</span><a href="#">Privacy policy</a><a href="#">Accessibility statement</a></p>
          <button class="motion-toggle" type="button" data-motion-toggle aria-pressed="${reduceOn}">
            ${icon(reduceOn ? "play" : "pause")}<span>${reduceOn ? "Turn animations on" : "Reduce motion"}</span></button>
        </div>
      </div>
    </footer>
    <button class="to-top" type="button" aria-label="Back to top">${icon("arrow-up")}</button>`;
  }

  /* ---------- behaviour ---------- */
  const hdr = document.getElementById("siteHeader");
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobileMenu");
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = icon(open ? "x" : "menu");
    refreshIcons(toggle);
    if (open && window.gsap && !document.documentElement.classList.contains("reduce-motion")) {
      gsap.from(menu.querySelectorAll("li, .btn"), { y: 18, autoAlpha: 0, stagger: 0.04, duration: 0.45, ease: "power3.out" });
    }
  }
  toggle?.addEventListener("click", () => setMenu(menu.hidden));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu && !menu.hidden) { setMenu(false); toggle.focus(); } });
  matchMedia("(min-width: 1041px)").addEventListener?.("change", (e) => e.matches && setMenu(false));

  const toTop = document.querySelector(".to-top");
  const progress = document.querySelector(".scroll-progress");
  const cssProgress = CSS.supports && CSS.supports("animation-timeline: scroll()");
  if (cssProgress) progress?.classList.add("css-driven");
  function onScroll() {
    const y = window.scrollY;
    hdr?.classList.toggle("is-scrolled", y > 10);
    toTop?.classList.toggle("is-visible", y > 700);
    if (!cssProgress && progress) {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 });
    else scrollTo({ top: 0, behavior: "smooth" });
    document.querySelector(".skip-link")?.focus({ preventScroll: true });
  });

  document.querySelector("[data-motion-toggle]")?.addEventListener("click", () => {
    const off = document.documentElement.classList.contains("reduce-motion");
    try { localStorage.setItem("motion", off ? "on" : "off"); } catch (e) {}
    location.reload();
  });

  document.title = document.title.replace("{{name}}", H.name);
})();
