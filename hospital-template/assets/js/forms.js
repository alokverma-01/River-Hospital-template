/* =====================================================================
   FORMS — appointment (3 steps) and contact enquiry.
   Delivery is set in config: formsubmit | formspree | mailto | whatsapp.
   Keep forms to contact + scheduling details only (no symptoms or
   medical history) unless you use a HIPAA-compliant form provider.
   ===================================================================== */
(function () {
  const H = window.HOSPITAL;
  const { esc, deptName, toast, refreshIcons } = window.Site;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);
  const reduce = Site.reduced();

  /* ---------- shared validation ---------- */
  const rules = {
    required: (v) => v.trim() !== "",
    email: (v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
    tel: (v) => v === "" || /^[+()\d\s-]{7,20}$/.test(v)
  };
  function fieldValue(el) {
    if (el.type === "radio") return ($(`input[name="${el.name}"]:checked`, el.form) || {}).value || "";
    if (el.type === "checkbox") return el.checked ? "yes" : "";
    return el.value;
  }
  function validateField(el) {
    const v = fieldValue(el);
    const label = el.dataset.label || el.name;
    let msg = "";
    if (el.required && !rules.required(v)) {
      msg = el.type === "checkbox" ? "Tick the box to continue."
        : (el.type === "radio" || el.tagName === "SELECT" || el.type === "date") ? `Choose ${label.toLowerCase()}.`
        : `Enter ${label.toLowerCase()}.`;
    }
    else if (el.type === "email" && !rules.email(v)) msg = "Enter an email like name@example.com.";
    else if (el.type === "tel" && !rules.tel(v)) msg = "Enter a phone number using digits, spaces or +.";
    else if (el.dataset.check) msg = customChecks[el.dataset.check]?.(v, el) || "";
    const err = document.getElementById(el.dataset.error || el.id + "-error");
    const targets = el.type === "radio" ? $$(`input[name="${el.name}"]`, el.form) : [el];
    targets.forEach((t) => t.setAttribute("aria-invalid", msg ? "true" : "false"));
    if (err) err.textContent = msg;
    return msg ? { el, msg, label } : null;
  }
  const customChecks = {
    date(v) {
      if (!v) return "";
      const d = new Date(v + "T00:00:00");
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (d < today) return "Choose today or a future date.";
      if ((H.closedWeekdays || []).includes(d.getDay())) return "Outpatient clinics are closed that day. Choose another date, or call the emergency line if it's urgent.";
      return "";
    }
  };
  function showSummary(box, errors) {
    if (!box) return;
    if (!errors.length) { box.hidden = true; return; }
    box.innerHTML = `<strong>${errors.length === 1 ? "Check this detail" : `Check these ${errors.length} details`} before continuing:</strong>
      <ul>${errors.map((e) => `<li><a href="#${e.el.id}">${esc(e.msg)}</a></li>`).join("")}</ul>`;
    box.hidden = false;
    box.focus();
  }
  function shake(el) {
    if (reduce) return;
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
  }
  const absUrl = (u) => { try { return new URL(u, location.href).href; } catch (e) { return u; } };

  /* ---------- delivery ---------- */
  function deliver(form, lines, subject, nextUrl) {
    const f = H.form;
    const text = `${subject}\n\n${lines.join("\n")}`;
    if (f.method === "whatsapp") { location.href = `https://wa.me/${H.whatsapp}?text=${encodeURIComponent(text)}`; return; }
    if (f.method === "mailto") { location.href = `mailto:${H.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`; return; }
    form.action = f.endpoint;
    form.method = "POST";
    const next = $('input[name="_next"]', form);
    if (next) next.value = absUrl(nextUrl);
    form.submit();
  }

  /* ---------- live validation ---------- */
  function liveValidate(form) {
    // Re-check a field only after it has been flagged, so messages clear as people fix them
    // (no validation on blur: it shifts the layout under the pointer mid-click).
    const recheck = (e) => { if (e.target.matches("[data-label]") && e.target.getAttribute("aria-invalid") === "true") validateField(e.target); };
    form.addEventListener("input", recheck);
    form.addEventListener("change", recheck);
  }

  /* =================================================================
     APPOINTMENT FORM
     ================================================================= */
  const form = $("#apptForm");
  if (form) {
    const deptSel = $("#dept");
    const docSel = $("#doctor");
    const date = $("#date");
    const steps = $$(".form-step", form);
    const stepper = $$(".stepper li");
    const summary = $("#apptErrors");
    const back = $("#backBtn");
    const next = $("#nextBtn");
    let current = 0;

    // Populate selects
    deptSel.innerHTML = `<option value="">Choose a department</option>` +
      H.departments.map((d) => `<option value="${esc(d.id)}">${esc(d.name)}</option>`).join("");
    const fillDoctors = () => {
      const list = H.doctors.filter((d) => !deptSel.value || d.dept === deptSel.value);
      const keep = docSel.value;
      docSel.innerHTML = `<option value="">Any available doctor</option>` +
        list.map((d) => `<option value="${esc(d.id)}">${esc(d.name)}, ${esc(d.title)}</option>`).join("");
      if (list.some((d) => d.id === keep)) docSel.value = keep;
    };
    deptSel.addEventListener("change", fillDoctors);
    docSel.addEventListener("change", () => {
      const d = H.doctors.find((x) => x.id === docSel.value);
      if (d && deptSel.value !== d.dept) { deptSel.value = d.dept; fillDoctors(); docSel.value = d.id; }
      updateDocNote();
    });
    const docNote = $("#doctorNote");
    function updateDocNote() {
      const d = H.doctors.find((x) => x.id === docSel.value);
      if (docNote) docNote.textContent = d ? `${d.name} holds clinics on ${d.days}.` : "We'll match you with the first available specialist.";
    }

    // Prefill from ?dept= and ?doctor=
    const pd = params.get("dept"), pdoc = params.get("doctor");
    if (H.departments.some((d) => d.id === pd)) deptSel.value = pd;
    const preDoc = H.doctors.find((d) => d.id === pdoc);
    if (preDoc) deptSel.value = preDoc.dept;
    fillDoctors();
    if (preDoc) docSel.value = preDoc.id;
    updateDocNote();

    // Date limits
    const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    const t = new Date();
    date.min = iso(t);
    const max = new Date(); max.setMonth(max.getMonth() + 3);
    date.max = iso(max);

    // Email becomes required if chosen as contact method
    form.addEventListener("change", (e) => {
      if (e.target.name === "contact_method") {
        const email = $("#email");
        email.required = e.target.value === "Email";
        $("#emailReq").hidden = !email.required;
      }
    });

    function goTo(i, userAction = true) {
      steps[current].hidden = true;
      current = i;
      steps[current].hidden = false;
      stepper.forEach((li, k) => {
        li.classList.toggle("is-active", k === current);
        li.classList.toggle("is-done", k < current);
        k === current ? li.setAttribute("aria-current", "step") : li.removeAttribute("aria-current");
      });
      back.hidden = current === 0;
      next.innerHTML = current === steps.length - 1
        ? `${Site.icon("send")}Send appointment request`
        : `Continue${Site.icon("arrow-right")}`;
      refreshIcons(next);
      if (current === steps.length - 1) buildReview();
      summary.hidden = true;
      if (!userAction) return;
      if (window.gsap && !reduce) gsap.from(steps[current], { x: 30, autoAlpha: 0, duration: 0.5, ease: "power3.out" });
      const top = form.getBoundingClientRect().top + scrollY - 120;
      if (window.__lenis) window.__lenis.scrollTo(top); else scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      $("legend", steps[current])?.focus({ preventScroll: true });
    }
    function validateStep(i) {
      const seen = new Set();
      return $$("[data-label]", steps[i])
        .filter((el) => (el.type === "radio" ? !seen.has(el.name) && seen.add(el.name) : true))
        .map(validateField).filter(Boolean);
    }
    function data() {
      const fd = new FormData(form);
      return {
        dept: deptName(fd.get("department") || ""), doctor: (H.doctors.find((d) => d.id === fd.get("doctor")) || {}).name || "Any available doctor",
        visit: fd.get("visit_type") || "", date: fd.get("preferred_date") || "", slot: fd.get("time_slot") || "",
        method: fd.get("contact_method") || "", name: fd.get("name") || "", phone: fd.get("phone") || "", email: fd.get("email") || ""
      };
    }
    function buildReview() {
      const d = data();
      const nice = d.date ? new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" }) : "";
      $("#reviewBox").innerHTML = `<dl>
        <dt>Department</dt><dd>${esc(d.dept)}</dd>
        <dt>Doctor</dt><dd>${esc(d.doctor)}</dd>
        <dt>Date</dt><dd>${esc(nice)}, ${esc(d.slot.toLowerCase())}</dd>
        <dt>Visit</dt><dd>${esc(d.visit)}</dd></dl>`;
    }
    // store readable values for the email the hospital receives
    function syncHidden() {
      const d = data();
      $("#hDept").value = d.dept;
      $("#hDoctor").value = d.doctor;
    }

    back.addEventListener("click", () => goTo(current - 1));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = validateStep(current);
      if (errors.length) { showSummary(summary, errors); shake(steps[current]); return; }
      if (current < steps.length - 1) return goTo(current + 1);
      if ($('input[name="_honey"]', form).value) return; // bot
      syncHidden();
      const d = data();
      next.disabled = true;
      next.textContent = "Sending…";
      deliver(form, [
        `Name: ${d.name}`, `Phone: ${d.phone}`, `Email: ${d.email || "-"}`, `Department: ${d.dept}`, `Doctor: ${d.doctor}`,
        `Preferred date: ${d.date} (${d.slot})`, `Visit type: ${d.visit}`, `Contact by: ${d.method}`
      ], `Appointment request from ${d.name}`, H.form.thankYouUrl);
      if (H.form.method === "whatsapp" || H.form.method === "mailto") {
        setTimeout(() => { next.disabled = false; goTo(current, false); toast("Your message app should open. Send the message to finish your request."); }, 800);
      }
    });
    liveValidate(form);
    goTo(0, false);

    // Success state after FormSubmit/Formspree redirect
    if (params.get("sent") === "1") {
      $("#apptCard").hidden = true;
      const s = $("#apptSuccess");
      s.hidden = false;
      s.focus();
    }
  }

  /* =================================================================
     CONTACT FORM
     ================================================================= */
  const cf = $("#contactForm");
  if (cf) {
    const summary = $("#contactErrors");
    cf.addEventListener("submit", (e) => {
      e.preventDefault();
      const errors = $$("[data-label]", cf).map(validateField).filter(Boolean);
      if (errors.length) { showSummary(summary, errors); shake(cf); return; }
      summary.hidden = true;
      if ($('input[name="_honey"]', cf).value) return;
      const fd = new FormData(cf);
      deliver(cf, [`Name: ${fd.get("name")}`, `Phone: ${fd.get("phone") || "-"}`, `Email: ${fd.get("email")}`, `Topic: ${fd.get("topic")}`, "", fd.get("message")],
        `Website enquiry: ${fd.get("topic")}`, H.form.contactThankYouUrl);
    });
    liveValidate(cf);
    if (params.get("sent") === "1") toast(`Thanks, your message was sent. We reply ${H.form.responseTime}.`);
  }
})();
