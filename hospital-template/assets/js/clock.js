/* =====================================================================
   CLOCK — live hospital time in the hospital's own time zone.
   Settings live in config.js under "clock". Drop the markup below on
   any page (see contact.html) and include this script:
     <aside class="clock-card" data-clock> … </aside>
   ===================================================================== */
(function () {
  const H = window.HOSPITAL || {};
  const C = H.clock || {};
  const cards = document.querySelectorAll("[data-clock]");
  if (!cards.length) return;
  if (C.enabled === false) { cards.forEach((c) => c.remove()); return; }

  const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hour12 = C.hour12 !== false;

  // Fall back to the visitor's zone if the configured one is invalid
  let tz = C.timeZone;
  try { new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(); }
  catch (e) { console.warn("[clock] Unknown timeZone:", tz); tz = undefined; }

  const fmtTime = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "numeric", minute: "2-digit", second: "2-digit", hour12
  });
  const fmtDate = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric" });
  const fmtZone = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" });
  const fmtParts24 = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
  });
  const fmtVisitor = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12, timeZoneName: "short" });

  const part = (parts, type) => (parts.find((p) => p.type === type) || {}).value || "";
  const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  // "20:00" -> "8:00 pm" (or "20:00" in 24-hour mode)
  const niceTime = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    if (!hour12) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  };

  function clinicStatus(now) {
    const hours = C.clinicHours;
    if (!hours) return null;
    const p = fmtParts24.formatToParts(now);
    const day = DAYS.indexOf(part(p, "weekday").slice(0, 3).toLowerCase());
    const mins = (+part(p, "hour") % 24) * 60 + +part(p, "minute");
    const today = hours[DAYS[day]];
    if (today && mins >= toMin(today[0]) && mins < toMin(today[1])) {
      return { open: true, text: `${C.openText || "Open"} · closes ${niceTime(today[1])}` };
    }
    // Find the next opening: later today, or one of the next 7 days
    for (let i = 0; i <= 7; i++) {
      const d = (day + i) % 7;
      const h = hours[DAYS[d]];
      if (!h || (i === 0 && mins >= toMin(h[0]))) continue;
      const when = i === 0 ? "" : i === 1 ? "tomorrow " : DAY_NAMES[d] + " ";
      return { open: false, text: `${C.closedText || "Closed"} · opens ${when}${niceTime(h[0])}` };
    }
    return { open: false, text: C.closedText || "Closed" };
  }

  function setup(card) {
    const q = (s) => card.querySelector(s);
    const els = {
      label: q("[data-clock-label]"), hm: q("[data-clock-hm]"), sec: q("[data-clock-sec]"),
      period: q("[data-clock-period]"), date: q("[data-clock-date]"), tz: q("[data-clock-tz]"),
      time: q("[data-clock-time]"), status: q("[data-clock-status]"), statusText: q("[data-clock-status-text]"),
      emergency: q("[data-clock-emergency]"), visitor: q("[data-clock-visitor]")
    };
    if (els.label && C.label) els.label.textContent = C.label;
    if (els.emergency && C.emergencyText) els.emergency.textContent = C.emergencyText;
    if (els.date && C.showDate === false) els.date.hidden = true;
    if (els.sec && C.showSeconds === false) els.sec.hidden = true;
    // Compare wall-clock time, not zone names ("Asia/Calcutta" is the same as "Asia/Kolkata")
    const sameAsVisitor = (now) => {
      const p = fmtParts24.formatToParts(now);
      return (+part(p, "hour") % 24) === now.getHours() && +part(p, "minute") === now.getMinutes();
    };

    let lastMinute = -1;
    function tick() {
      const now = new Date();
      const p = fmtTime.formatToParts(now);
      if (els.hm) els.hm.textContent = `${part(p, "hour")}:${part(p, "minute")}`;
      if (els.sec) els.sec.textContent = ":" + part(p, "second");
      if (els.period) els.period.textContent = part(p, "dayPeriod").toLowerCase();
      if (els.time) els.time.setAttribute("datetime", now.toISOString());

      // Everything else only needs updating once a minute
      const minute = now.getUTCMinutes();
      if (minute === lastMinute) return;
      lastMinute = minute;
      if (els.date) els.date.textContent = fmtDate.format(now);
      if (els.tz) els.tz.textContent = part(fmtZone.formatToParts(now), "timeZoneName");
      const s = clinicStatus(now);
      if (els.status) {
        els.status.hidden = !s;
        if (s) { els.status.classList.toggle("is-open", s.open); els.statusText.textContent = s.text; }
      }
      if (els.visitor) {
        const show = C.showVisitorTime !== false && tz && !sameAsVisitor(now);
        els.visitor.hidden = !show;
        if (show) els.visitor.textContent = "Your time: " + fmtVisitor.format(now).replace(/\b(AM|PM)\b/, (m) => m.toLowerCase());
      }
    }
    tick();
    // Align ticks to the start of each second
    setTimeout(() => { tick(); setInterval(tick, 1000); }, 1000 - (Date.now() % 1000));
    card.classList.add("is-ready");
  }

  cards.forEach(setup);
})();
