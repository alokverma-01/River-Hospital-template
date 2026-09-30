/* =====================================================================
   RENDER — turns config data into page content. Each block only runs
   when its container exists on the current page.
   ===================================================================== */
(function () {
  const H = window.HOSPITAL;
  const { esc, icon, initials, deptName, avgRating, starText, pulsePath, refreshIcons } = window.Site;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);

  Site.reduced = () =>
    document.documentElement.classList.contains("reduce-motion") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateIn(els) {
    if (!window.gsap || Site.reduced() || !els.length) return;
    gsap.fromTo(els, { y: 24, autoAlpha: 0, scale: 0.97 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.05, ease: "power3.out", overwrite: true });
  }
  function afterLayoutChange() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ---------- simple bindings: data-bind="phone" etc. ---------- */
  $$("[data-bind]").forEach((el) => { const v = H[el.dataset.bind]; if (v != null) el.textContent = v; });
  $$("[data-tel]").forEach((el) => (el.href = "tel:" + H.phoneHref));
  $$("[data-tel-emergency]").forEach((el) => (el.href = "tel:" + H.emergencyPhone));
  $$("[data-mailto]").forEach((el) => (el.href = "mailto:" + H.email));
  $$("[data-whatsapp]").forEach((el) => (el.href = "https://wa.me/" + H.whatsapp));
  $$("[data-rating]").forEach((el) => (el.textContent = avgRating().toFixed(1)));
  $$("[data-stars]").forEach((el) => { el.textContent = starText(avgRating()); el.setAttribute("aria-label", `Rated ${avgRating().toFixed(1)} out of 5`); el.setAttribute("role", "img"); });
  $$("[data-stat]").forEach((el) => { const s = H.stats[+el.dataset.stat]; if (s) el.textContent = s.value.toLocaleString() + s.suffix; });
  $$("[data-pulse]").forEach((el) => (el.innerHTML = `<svg viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 60 H420 L440 30 L470 100 L500 10 L528 110 L548 60 H1200"/></svg>`));

  $$("[data-bind-form-time]").forEach((el) => (el.textContent = H.form.responseTime));
  const rl = $("#reviewLinkBtn");
  if (rl) rl.href = H.reviewLink || "#";

  /* ---------- hours lists ---------- */
  $$(".js-hours").forEach((ul) => {
    ul.innerHTML = H.hours.map((h) => `<li><span>${esc(h.days)}</span><span>${esc(h.time)}</span></li>`).join("");
  });

  /* ---------- stats ---------- */
  const stats = $("#stats");
  if (stats) {
    stats.innerHTML = H.stats.map((s) => `
      <div class="stat">
        <div class="stat-num"><span data-count="${s.value}" data-suffix="${esc(s.suffix)}">${s.value.toLocaleString()}${esc(s.suffix)}</span></div>
        <div class="stat-label">${esc(s.label)}</div>
      </div>`).join("");
  }

  /* ---------- horizontal departments (home) ---------- */
  const track = $("#hscrollTrack");
  if (track) {
    track.innerHTML = H.departments.map((d, i) => `
      <a class="hpanel" href="services.html#${esc(d.id)}">
        <span class="hpanel-num" aria-hidden="true">${String(i + 1).padStart(2, "0")}/${String(H.departments.length).padStart(2, "0")}</span>
        <span class="hpanel-ico">${icon(d.icon)}</span>
        <h3>${esc(d.name)}</h3>
        <p>${esc(d.summary)}</p>
        <ul>${d.conditions.slice(0, 3).map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
        <span class="text-link">Explore ${esc(d.name)}${icon("arrow-right")}</span>
      </a>`).join("");
  }

  /* ---------- doctor card ---------- */
  function doctorCard(d, i) {
    const photo = d.photo
      ? `<img src="${esc(d.photo)}" alt="Portrait of ${esc(d.name)}" width="400" height="420" loading="lazy">`
      : `<div class="avatar-initials" style="--hue:${(150 + i * 37) % 360}" role="img" aria-label="${esc(d.name)}">${initials(d.name)}</div>`;
    return `
      <article class="doctor-card" data-dept="${esc(d.dept)}" data-tilt>
        <div class="doctor-photo">${photo}<span class="doctor-dept">${esc(deptName(d.dept))}</span></div>
        <div class="doctor-body">
          <h3>${esc(d.name)}</h3>
          <p class="doctor-title">${esc(d.title)}, ${esc(d.qualifications)}</p>
          <ul class="doctor-meta">
            <li>${icon("award")}<span>${d.experience} years of experience</span></li>
            <li>${icon("languages")}<span>${d.languages.map(esc).join(", ")}</span></li>
            <li>${icon("calendar-days")}<span>Clinic days: ${esc(d.days)}</span></li>
          </ul>
          <a class="btn btn-brand btn-block" href="appointment.html?doctor=${encodeURIComponent(d.id)}&dept=${encodeURIComponent(d.dept)}">
            ${icon("calendar-check")}Book with Dr. ${esc(d.name.split(" ").pop())}</a>
        </div>
      </article>`;
  }

  /* featured doctors slider (home) */
  const featured = $("#featuredDoctors");
  if (featured) featured.innerHTML = H.doctors.map((d, i) => `<div class="swiper-slide">${doctorCard(d, i)}</div>`).join("");

  /* doctors page grid + filters */
  const docGrid = $("#doctorGrid");
  if (docGrid) {
    const filterBar = $("#doctorFilters");
    const search = $("#doctorSearch");
    const used = [...new Set(H.doctors.map((d) => d.dept))];
    let active = used.includes(params.get("dept")) ? params.get("dept") : "all";
    filterBar.innerHTML =
      `<button class="chip" type="button" data-f="all">All doctors</button>` +
      used.map((id) => `<button class="chip" type="button" data-f="${esc(id)}">${esc(deptName(id))}</button>`).join("");
    const draw = (animate) => {
      const q = (search?.value || "").trim().toLowerCase();
      const list = H.doctors
        .map((d, i) => ({ d, i }))
        .filter(({ d }) => (active === "all" || d.dept === active) &&
          (!q || [d.name, d.title, deptName(d.dept), d.languages.join(" ")].join(" ").toLowerCase().includes(q)));
      docGrid.innerHTML = list.length
        ? list.map(({ d, i }) => doctorCard(d, i)).join("")
        : `<p class="empty-state">No doctors match "${esc(q)}". Try another name or department, or <a href="contact.html">ask our front desk</a>.</p>`;
      $$("[data-f]", filterBar).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === active)));
      $("#doctorCount") && ($("#doctorCount").textContent = `${list.length} ${list.length === 1 ? "doctor" : "doctors"}`);
      refreshIcons(docGrid);
      document.dispatchEvent(new CustomEvent("site:content"));
      if (animate) animateIn($$(".doctor-card", docGrid));
      afterLayoutChange();
    };
    filterBar.addEventListener("click", (e) => { const b = e.target.closest("[data-f]"); if (!b) return; active = b.dataset.f; draw(true); });
    search?.addEventListener("input", () => draw(true));
    draw(false);
  }

  /* ---------- services page: departments grid ---------- */
  const deptGrid = $("#deptGrid");
  if (deptGrid) {
    const search = $("#deptSearch");
    const draw = (animate) => {
      const q = (search?.value || "").trim().toLowerCase();
      const list = H.departments.filter((d) => !q || [d.name, d.summary, d.conditions.join(" ")].join(" ").toLowerCase().includes(q));
      deptGrid.innerHTML = list.length
        ? list.map((d) => `
          <article class="dept-card" id="${esc(d.id)}">
            <span class="hpanel-ico">${icon(d.icon)}</span>
            <h3>${esc(d.name)}</h3>
            <p>${esc(d.summary)}</p>
            <ul>${d.conditions.map((c) => `<li>${icon("check")}${esc(c)}</li>`).join("")}</ul>
            <div class="card-actions">
              <a class="btn btn-brand btn-sm" href="appointment.html?dept=${encodeURIComponent(d.id)}">${icon("calendar-check")}Book</a>
              <a class="text-link" href="doctors.html?dept=${encodeURIComponent(d.id)}">See doctors${icon("arrow-right")}</a>
            </div>
          </article>`).join("")
        : `<p class="empty-state">No department matches "${esc(q)}". Call ${esc(H.phone)} and we'll point you to the right specialist.</p>`;
      refreshIcons(deptGrid);
      if (animate) animateIn($$(".dept-card", deptGrid));
      afterLayoutChange();
    };
    search?.addEventListener("input", () => draw(true));
    draw(false);
    // Jump to a department linked from another page (services.html#cardiology)
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }

  /* ---------- patient journey ---------- */
  const journey = $("#journey");
  if (journey) {
    journey.innerHTML = `<div class="journey-line" aria-hidden="true"><span></span></div>` +
      H.journey.map((s, i) => `
        <div class="step">
          <div class="step-num" aria-hidden="true">${i + 1}</div>
          <h3><span class="visually-hidden">Step ${i + 1}: </span>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>`).join("");
  }

  /* ---------- FAQ ---------- */
  const faq = $("#faq");
  if (faq) {
    faq.innerHTML = H.faqs.map((f) => `
      <details>
        <summary>${esc(f.q)}<span class="plus" aria-hidden="true">${icon("plus")}</span></summary>
        <div class="answer"><p>${esc(f.a)}</p></div>
      </details>`).join("");
  }

  /* ---------- reviews ---------- */
  function reviewCard(r) {
    const date = new Date(r.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", year: "numeric" });
    return `
      <figure class="review-card" style="margin:0">
        <span class="stars" role="img" aria-label="Rated ${r.rating} out of 5">${starText(r.rating)}</span>
        <blockquote><p style="margin:0">${esc(r.text)}</p></blockquote>
        <footer>
          <span class="review-avatar" aria-hidden="true">${esc(r.name[0])}</span>
          <figcaption><cite>${esc(r.name)}</cite><small>${esc(r.source)} review, ${date}</small></figcaption>
        </footer>
      </figure>`;
  }
  const reviewSlides = $$(".js-review-slides");
  reviewSlides.forEach((w) => (w.innerHTML = H.reviews.map((r) => `<div class="swiper-slide">${reviewCard(r)}</div>`).join("")));
  const masonryReviews = $("#reviewMasonry");
  if (masonryReviews) masonryReviews.innerHTML = H.reviews.map(reviewCard).join("");

  const summary = $("#ratingBars");
  if (summary) {
    const n = H.reviews.length || 1;
    summary.innerHTML = [5, 4, 3, 2, 1].map((star) => {
      const c = H.reviews.filter((r) => r.rating === star).length;
      const pct = Math.round((c / n) * 100);
      return `<div class="rating-row"><span>${star} star</span>
        <div class="rating-track" role="img" aria-label="${pct}% of reviews are ${star} stars"><div class="rating-fill" style="width:${pct}%"></div></div>
        <span>${pct}%</span></div>`;
    }).join("");
  }
  $$("[data-review-count]").forEach((el) => (el.textContent = H.reviews.length));

  /* ---------- marquee ---------- */
  const mq = $("#marquee");
  if (mq) {
    const items = H.accreditations.map((a) => `<span class="badge-pill">${icon("shield-check")}${esc(a)}</span>`).join("");
    mq.innerHTML = `<div class="marquee-inner"><div style="display:flex;gap:1rem">${items}</div><div style="display:flex;gap:1rem" aria-hidden="true">${items}</div></div>`;
  }

  /* ---------- gallery ---------- */
  const masonry = $("#masonry");
  if (masonry) {
    const tags = [...new Set(H.gallery.map((g) => g.tag))];
    const label = (t) => t[0].toUpperCase() + t.slice(1);
    $("#galleryFilters").innerHTML =
      `<button class="chip" type="button" data-g="all" aria-pressed="true">All photos</button>` +
      tags.map((t) => `<button class="chip" type="button" data-g="${esc(t)}" aria-pressed="false">${esc(label(t))}</button>`).join("");
    masonry.innerHTML = H.gallery.map((g) => `
      <a href="${esc(g.src)}" class="glightbox" data-type="image" data-gallery="hospital" data-tag="${esc(g.tag)}" data-title="${esc(g.alt)}">
        <figure style="margin:0">
          <img src="${esc(g.src)}" alt="${esc(g.alt)}" width="${g.w}" height="${g.h}" loading="lazy" decoding="async">
          <figcaption>${esc(g.alt)}</figcaption>
        </figure>
      </a>`).join("");
    $("#galleryFilters").addEventListener("click", (e) => {
      const b = e.target.closest("[data-g]");
      if (!b) return;
      const f = b.dataset.g;
      $$("[data-g]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      const shown = [];
      $$("a", masonry).forEach((a) => {
        const show = f === "all" || a.dataset.tag === f;
        a.hidden = !show;
        a.classList.toggle("glightbox", show);
        if (show) shown.push(a);
      });
      animateIn(shown);
      document.dispatchEvent(new CustomEvent("site:gallery-filter"));
      afterLayoutChange();
    });
  }

  /* ---------- contact cards ---------- */
  const cc = $("#contactCards");
  if (cc) {
    cc.innerHTML = `
      <a class="contact-card emergency" href="tel:${esc(H.emergencyPhone)}"><span class="tile-ico">${icon("ambulance")}</span><strong>Call ${esc(H.emergencyPhone)}</strong><span>Emergency, 24 hours a day</span></a>
      <a class="contact-card" href="tel:${esc(H.phoneHref)}"><span class="tile-ico">${icon("phone")}</span><strong>${esc(H.phone)}</strong><span>Front desk and appointments</span></a>
      <a class="contact-card" href="https://wa.me/${esc(H.whatsapp)}" target="_blank" rel="noopener"><span class="tile-ico">${icon("message-circle")}</span><strong>WhatsApp us</strong><span>Replies ${esc(H.form.responseTime)}</span></a>
      <a class="contact-card" href="mailto:${esc(H.email)}"><span class="tile-ico">${icon("mail")}</span><strong>${esc(H.email)}</strong><span>General questions</span></a>`;
  }
  const addr = $("#addressText");
  if (addr) addr.textContent = H.address;
  const dir = $("#directionsLink");
  if (dir) dir.href = `https://www.google.com/maps/dir/?api=1&destination=${H.map.lat},${H.map.lng}`;

  /* ---------- structured data for search engines ---------- */
  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org", "@type": "Hospital", name: H.name, telephone: H.phone, email: H.email,
    address: H.address, geo: { "@type": "GeoCoordinates", latitude: H.map.lat, longitude: H.map.lng },
    medicalSpecialty: H.departments.map((d) => d.name)
  });
  document.head.appendChild(ld);

  refreshIcons();
})();
