/* =====================================================================
   MOTION — GSAP + ScrollTrigger + SplitText + Lenis, plus Swiper and
   GLightbox setup. Every effect is optional: if a library fails to load
   or motion is reduced, content stays fully visible and usable.
   ===================================================================== */
(function () {
  const H = window.HOSPITAL;
  const reduce = Site.reduced();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const html = document.documentElement;

  /* =================================================================
     1. WIDGETS (run with or without GSAP)
     ================================================================= */

  /* ---- Carousels ---- */
  const swipers = {};
  if (window.Swiper) {
    $$(".swiper[data-swiper]").forEach((el) => {
      const name = el.dataset.swiper;
      const isReviews = name === "reviews";
      swipers[name] = new Swiper(el, {
        slidesPerView: 1.08,
        spaceBetween: 20,
        grabCursor: true,
        speed: 700,
        loop: isReviews,
        a11y: { enabled: true },
        keyboard: { enabled: true, onlyInViewport: true },
        navigation: { prevEl: `[data-prev="${name}"]`, nextEl: `[data-next="${name}"]` },
        pagination: { el: `[data-dots="${name}"]`, clickable: true },
        autoplay: isReviews && !reduce ? { delay: 5200, pauseOnMouseEnter: true, disableOnInteraction: false } : false,
        breakpoints: {
          640: { slidesPerView: 2.1, spaceBetween: 20 },
          1024: { slidesPerView: isReviews ? 3 : 3.2, spaceBetween: 24 },
          1280: { slidesPerView: isReviews ? 3 : 4, spaceBetween: 24 }
        }
      });
    });
  }
  $$("[data-carousel-pause]").forEach((btn) => {
    const sw = swipers[btn.dataset.carouselPause];
    if (!sw || !sw.autoplay) { btn.hidden = true; return; }
    const set = (running) => {
      btn.setAttribute("aria-pressed", String(!running));
      btn.setAttribute("aria-label", running ? "Pause automatic sliding" : "Play automatic sliding");
      btn.innerHTML = Site.icon(running ? "pause" : "play");
      Site.refreshIcons(btn);
    };
    if (reduce) { btn.hidden = true; return; }
    set(true);
    btn.addEventListener("click", () => {
      const running = sw.autoplay.running;
      running ? sw.autoplay.stop() : sw.autoplay.start();
      set(!running);
    });
  });

  /* ---- Gallery lightbox ---- */
  let lightbox;
  const initLightbox = () => {
    if (!window.GLightbox || !$(".glightbox")) return;
    lightbox?.destroy();
    lightbox = GLightbox({ selector: ".glightbox", touchNavigation: true, loop: true, openEffect: reduce ? "none" : "zoom", closeEffect: reduce ? "none" : "fade" });
  };
  initLightbox();
  document.addEventListener("site:gallery-filter", initLightbox);

  /* ---- Marquee pause (WCAG 2.2.2) ---- */
  $$("[data-marquee-pause]").forEach((btn) => {
    const mq = document.getElementById(btn.dataset.marqueePause);
    if (reduce) { btn.hidden = true; return; }
    btn.addEventListener("click", () => {
      const paused = mq.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", String(paused));
      btn.setAttribute("aria-label", paused ? "Play scrolling logos" : "Pause scrolling logos");
      btn.innerHTML = Site.icon(paused ? "play" : "pause");
      Site.refreshIcons(btn);
    });
  });

  /* ---- Departments strip: prev/next arrows ----
     Pinned mode (GSAP, wide screens) registers hsNav.goTo/state below;
     otherwise the arrows scroll the track natively by one panel. */
  const hsNav = { goTo: null, state: null };
  const hsTrack = $("#hscrollTrack");
  const hsBtns = { prev: $('[data-hscroll="prev"]'), next: $('[data-hscroll="next"]') };
  const updateHsArrows = () => {
    if (!hsTrack || !hsBtns.prev) return;
    let atStart, atEnd;
    if (hsNav.state) ({ atStart, atEnd } = hsNav.state());
    else {
      atStart = hsTrack.scrollLeft <= 2;
      atEnd = hsTrack.scrollLeft + hsTrack.clientWidth >= hsTrack.scrollWidth - 2;
    }
    hsBtns.prev.disabled = atStart;
    hsBtns.next.disabled = atEnd;
  };
  if (hsTrack && hsBtns.prev) {
    const step = (dir) => {
      if (hsNav.goTo) return hsNav.goTo(dir);
      const panel = $(".hpanel", hsTrack);
      const gap = parseFloat(getComputedStyle(hsTrack).columnGap) || 0;
      hsTrack.scrollBy({ left: dir * ((panel ? panel.offsetWidth : 300) + gap), behavior: reduce ? "auto" : "smooth" });
    };
    hsBtns.prev.addEventListener("click", () => step(-1));
    hsBtns.next.addEventListener("click", () => step(1));
    hsTrack.addEventListener("scroll", updateHsArrows, { passive: true });
    addEventListener("resize", updateHsArrows);
    updateHsArrows();
  }

  /* ---- Heart monitor on the home hero ---- */
  const monitor = $(".monitor");
  let bpmTimer;
  if (monitor) {
    const bpm = $("#bpm");
    const pauseBtn = $("[data-monitor-pause]");
    const tick = () => { if (bpm) bpm.textContent = 70 + Math.round(Math.random() * 8); };
    const start = () => { clearInterval(bpmTimer); bpmTimer = setInterval(tick, 1300); monitor.classList.remove("is-paused"); };
    const stop = () => { clearInterval(bpmTimer); monitor.classList.add("is-paused"); };
    if (reduce) { stop(); pauseBtn && (pauseBtn.hidden = true); }
    else start();
    pauseBtn?.addEventListener("click", () => {
      const paused = monitor.classList.contains("is-paused");
      paused ? start() : stop();
      pauseBtn.setAttribute("aria-pressed", String(!paused));
      pauseBtn.setAttribute("aria-label", paused ? "Pause heartbeat animation" : "Play heartbeat animation");
      pauseBtn.innerHTML = Site.icon(paused ? "pause" : "play");
      Site.refreshIcons(pauseBtn);
    });
  }

  /* =================================================================
     2. GSAP MOTION
     ================================================================= */
  const loader = $(".loader");
  const endLoader = () => { loader?.remove(); html.classList.remove("show-loader"); };

  if (!window.gsap) { endLoader(); return; }
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);
  const hasST = !!window.ScrollTrigger;

  if (reduce) {
    endLoader();
    // Counters, bars and lines simply show their final state.
    return;
  }

  gsap.defaults({ ease: "power3.out", duration: 0.9 });

  /* ---- Smooth scroll (desktop pointers only) ---- */
  if (window.Lenis && finePointer) {
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -100 } });
    window.__lenis = lenis;
    if (hasST) lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---- Loader (first page of each visit) ---- */
  let introDelay = 0.1;
  if (loader && html.classList.contains("show-loader")) {
    try { sessionStorage.setItem("seenLoader", "1"); } catch (e) {}
    loader.style.animation = "none"; // cancel CSS failsafe, GSAP owns it now
    const path = $("path", loader);
    const len = path.getTotalLength();
    introDelay = 1.45;
    gsap.timeline({ onComplete: endLoader })
      .set(path, { strokeDasharray: len, strokeDashoffset: len })
      .from(".loader-name", { y: 20, autoAlpha: 0, duration: 0.6 }, 0.1)
      .to(path, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0)
      .to(loader, { clipPath: "inset(0 0 100% 0)", duration: 0.75, ease: "expo.inOut" }, "+=0.15");
  } else {
    endLoader();
  }

  /* ---- Split headings ---- */
  $$("[data-split]").forEach((el) => {
    const isHero = el.closest(".hero, .page-hero");
    const anim = (targets) =>
      gsap.from(targets, {
        yPercent: 110, duration: 1.05, stagger: 0.09, ease: "expo.out",
        delay: isHero ? introDelay : 0,
        scrollTrigger: !isHero && hasST ? { trigger: el, start: "top 88%", once: true } : undefined
      });
    if (window.SplitText) {
      SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true, onSplit: (self) => anim(self.lines) });
    } else {
      gsap.from(el, { y: 30, autoAlpha: 0, delay: isHero ? introDelay : 0 });
    }
  });

  /* ---- Hero entrance ---- */
  const heroBits = $$("[data-hero]");
  if (heroBits.length) {
    gsap.from(heroBits, { y: 28, autoAlpha: 0, stagger: 0.08, duration: 0.9, delay: introDelay + 0.25 });
  }
  if (monitor) {
    gsap.timeline({ delay: introDelay })
      .from(monitor, { scale: 0.92, autoAlpha: 0, duration: 1.2, ease: "expo.out" })
      .from(".monitor-top > *", { y: 20, autoAlpha: 0, stagger: 0.1 }, "-=0.8")
      .from(".glass-chip", { y: 30, autoAlpha: 0, scale: 0.9, stagger: 0.15, ease: "back.out(1.6)" }, "-=0.6");
    // subtle floating on the side chip
    gsap.to(".chip-b", { y: -10, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: introDelay + 1.5 });
    // monitor follows the pointer a little
    if (finePointer) {
      const rx = gsap.quickTo(monitor, "rotationY", { duration: 0.8 });
      const ry = gsap.quickTo(monitor, "rotationX", { duration: 0.8 });
      gsap.set(monitor, { transformPerspective: 1200 });
      $(".hero").addEventListener("pointermove", (e) => {
        rx((e.clientX / innerWidth - 0.5) * 6);
        ry(-(e.clientY / innerHeight - 0.5) * 6);
      });
    }
  }
  const pageLine = $(".page-hero-line path");
  if (pageLine) {
    const len = pageLine.getTotalLength();
    gsap.fromTo(pageLine, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: introDelay });
  }
  if (!hasST) return;

  /* ---- Scroll reveals ---- */
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, { y: 40, autoAlpha: 0, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
  });
  $$("[data-reveal-group]").forEach((group) => {
    const items = [...group.children].filter((c) => !c.classList.contains("journey-line"));
    gsap.from(items, {
      y: 44, autoAlpha: 0, stagger: 0.08, duration: 0.85,
      scrollTrigger: { trigger: group, start: "top 85%", once: true }
    });
  });
  $$("[data-reveal-scale]").forEach((el) => {
    gsap.from(el, { scale: 0.94, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  /* ---- Parallax ---- */
  $$("[data-parallax]").forEach((el) => {
    gsap.to(el, { yPercent: -(parseFloat(el.dataset.parallax) || 12), ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---- Counters ---- */
  $$("[data-count]").forEach((el) => {
    const end = +el.dataset.count;
    const suffix = el.dataset.suffix || "";
    const o = { v: 0 };
    el.textContent = "0" + suffix;
    gsap.to(o, {
      v: end, duration: 2.2, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString() + suffix)
    });
  });

  /* ---- Rating bars ---- */
  $$(".rating-fill").forEach((bar, i) => {
    gsap.from(bar, { scaleX: 0, duration: 1.3, delay: i * 0.08, ease: "expo.out", scrollTrigger: { trigger: bar, start: "top 92%", once: true } });
  });

  /* ---- Journey progress line ---- */
  const jl = $(".journey-line span");
  if (jl) {
    const mmj = gsap.matchMedia();
    mmj.add({ wide: "(min-width: 861px)", narrow: "(max-width: 860px)" }, (ctx) => {
      const prop = ctx.conditions.wide ? { scaleX: 1 } : { scaleY: 1 };
      gsap.to(jl, { ...prop, ease: "none", scrollTrigger: { trigger: "#journey", start: "top 75%", end: "bottom 55%", scrub: 0.6 } });
    });
  }

  /* ---- Drawn lines (CTA bands) ---- */
  $$(".cta-line path").forEach((p) => {
    const len = p.getTotalLength();
    gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut", scrollTrigger: { trigger: p.closest(".cta-band"), start: "top 80%", once: true } });
  });

  /* ---- Pinned horizontal departments ---- */
  const hs = $(".hscroll");
  if (hs) {
    const track = $(".hscroll-track", hs);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", () => {
      hs.classList.add("is-pinned");
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tween = gsap.to(track, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: hs, pin: true, scrub: 0.8, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1, onUpdate: updateHsArrows, onRefresh: updateHsArrows }
      });
      // Arrow buttons: scroll the page to where the next/previous panel lines up
      const panelStops = () => {
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const d = dist();
        return $$(".hpanel", track).map((p) => Math.min(d, Math.max(0, p.offsetLeft - pad)));
      };
      hsNav.state = () => {
        const p = tween.scrollTrigger.progress;
        return { atStart: p <= 0.001, atEnd: p >= 0.999 };
      };
      hsNav.goTo = (dir) => {
        const st = tween.scrollTrigger;
        const d = dist() || 1;
        const x = st.progress * d;
        const stops = panelStops();
        let target = dir > 0 ? stops.find((s) => s > x + 5) : [...stops].reverse().find((s) => s < x - 5);
        if (target == null) target = dir > 0 ? d : 0;
        const y = st.start + (st.end - st.start) * (target / d);
        window.__lenis ? window.__lenis.scrollTo(y, { duration: 1.1 }) : scrollTo({ top: y, behavior: "smooth" });
      };
      updateHsArrows();
      $$(".hpanel", track).forEach((p) => {
        gsap.from($(".hpanel-ico", p), { rotate: -25, scale: 0.6, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true } });
        gsap.from(p, { y: 60, ease: "none",
          scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 100%", end: "left 65%", scrub: true } });
      });
      // Keep keyboard focus visible: jump the page to the focused panel
      const onFocus = (e) => {
        const p = e.target.closest(".hpanel");
        if (!p) return;
        const st = tween.scrollTrigger;
        const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        const progress = Math.min(1, Math.max(0, (p.offsetLeft - pad) / (dist() || 1)));
        const y = st.start + (st.end - st.start) * progress;
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
      };
      track.addEventListener("focusin", onFocus);
      return () => {
        hs.classList.remove("is-pinned"); track.removeEventListener("focusin", onFocus);
        hsNav.goTo = hsNav.state = null; requestAnimationFrame(updateHsArrows);
      };
    });
  }

  /* ---- Magnetic buttons and tilt cards (mouse only) ---- */
  if (finePointer) {
    $$(".magnetic").forEach((b) => {
      const x = gsap.quickTo(b, "x", { duration: 0.4, ease: "power3" });
      const y = gsap.quickTo(b, "y", { duration: 0.4, ease: "power3" });
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.28);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      b.addEventListener("pointerleave", () => { x(0); y(0); });
    });
    let tiltEl = null;
    document.addEventListener("pointermove", (e) => {
      const c = e.target.closest?.("[data-tilt]");
      if (tiltEl && tiltEl !== c) gsap.to(tiltEl, { rotateX: 0, rotateY: 0, duration: 0.6 });
      tiltEl = c;
      if (!c) return;
      const r = c.getBoundingClientRect();
      gsap.to(c, {
        rotateY: ((e.clientX - r.left) / r.width - 0.5) * 7,
        rotateX: -((e.clientY - r.top) / r.height - 0.5) * 7,
        transformPerspective: 900, duration: 0.4, ease: "power2.out", overwrite: "auto"
      });
    });
  }

  /* ---- Recalculate once images and fonts settle ---- */
  addEventListener("load", () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
