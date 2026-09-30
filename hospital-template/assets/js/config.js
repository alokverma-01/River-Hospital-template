/* =====================================================================
   HOSPITAL CONFIG  —  REBRAND POINT #1
   Edit this one object to change the whole site: name, contacts,
   map, form delivery, departments, doctors, reviews and gallery.
   Colours and fonts live in assets/css/theme.css (rebrand point #2).
   ===================================================================== */
window.HOSPITAL = {
  name: "Riverbend General Hospital",
  shortName: "Riverbend",
  tagline: "Specialist care, close to home",
  intro:
    "From a same-day checkup to complex surgery, our specialists see you quickly, explain things clearly, and stay with you through recovery.",
  logo: "", // optional path to an SVG/PNG logo, e.g. "assets/img/logo.svg". Empty = text logo.

  phone: "+1 (555) 010-2000",
  phoneHref: "+15550102000",
  emergencyPhone: "911",
  emergencyLabel: "Emergency department open 24/7",
  whatsapp: "15550102000", // digits only, international format
  email: "appointments@example.org",
  address: "240 Riverside Avenue, Springfield, ST 00000",

  hours: [
    { days: "Monday – Friday", time: "8:00 am – 8:00 pm" },
    { days: "Saturday", time: "9:00 am – 4:00 pm" },
    { days: "Sunday", time: "Outpatients closed" },
    { days: "Emergency", time: "Open 24/7" }
  ],
  closedWeekdays: [0], // outpatient clinics closed on these days (0 = Sunday, 6 = Saturday)
  visitingHours: "Daily, 11:00 am – 8:00 pm (two visitors per patient)",

  /* Live clock on the contact page, shown in the hospital's own time zone.
     timeZone: an IANA name, e.g. "America/New_York", "Europe/London",
     "Asia/Kolkata", "Asia/Dubai", "Australia/Sydney".
     Full list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
     clinicHours: 24-hour "HH:MM" open/close per day; null = closed that day.
     Keep these in step with the "hours" list above. */
  clock: {
    enabled: true,
    timeZone: "America/New_York",
    label: "Local time at the hospital",
    hour12: true,          // false = 24-hour clock (e.g. 20:45)
    showSeconds: true,
    showDate: true,
    showVisitorTime: true, // adds "Your time: …" when the visitor is in another time zone
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

  /* Map: "leaflet" uses OpenStreetMap (no key needed).
     "google": paste the src from Google Maps > Share > Embed a map. */
  map: {
    provider: "leaflet",
    lat: 40.7128,
    lng: -74.006,
    zoom: 15,
    googleEmbedSrc: ""
  },

  /* Form delivery: "formsubmit" | "formspree" | "mailto" | "whatsapp"
     FormSubmit: first submission sends an activation email to the address. */
  form: {
    method: "formsubmit",
    endpoint: "https://formsubmit.co/appointments@example.org",
    thankYouUrl: "appointment.html?sent=1",
    contactThankYouUrl: "contact.html?sent=1",
    responseTime: "within 4 working hours"
  },

  stats: [
    { value: 38, suffix: "", label: "years caring for Springfield" },
    { value: 120, suffix: "+", label: "specialist doctors" },
    { value: 52000, suffix: "", label: "patients treated last year" },
    { value: 14, suffix: " min", label: "average emergency wait" }
  ],

  departments: [
    { id: "cardiology", name: "Cardiology", icon: "heart-pulse",
      summary: "Heart checks, ECG and echo, cardiac rehab and 24/7 chest-pain care.",
      conditions: ["Chest pain", "High blood pressure", "Arrhythmia", "Heart failure"] },
    { id: "neurology", name: "Neurology", icon: "brain",
      summary: "Diagnosis and long-term care for the brain, spine and nerves.",
      conditions: ["Migraine", "Epilepsy", "Stroke recovery", "Parkinson's"] },
    { id: "orthopedics", name: "Orthopedics", icon: "bone",
      summary: "Joint replacement, sports injuries and fracture care with in-house physio.",
      conditions: ["Knee & hip pain", "Fractures", "Back pain", "Sports injuries"] },
    { id: "pediatrics", name: "Pediatrics", icon: "baby",
      summary: "Care for newborns to teens, including vaccinations and a child-friendly ward.",
      conditions: ["Fever & infections", "Vaccinations", "Growth checks", "Asthma"] },
    { id: "womens-health", name: "Women's Health", icon: "heart-handshake",
      summary: "Maternity, gynecology and fertility support from first visit to delivery.",
      conditions: ["Pregnancy care", "Menstrual health", "Menopause", "Fertility"] },
    { id: "oncology", name: "Oncology", icon: "ribbon",
      summary: "Cancer screening, chemotherapy and a dedicated support team for families.",
      conditions: ["Screening", "Chemotherapy", "Radiation planning", "Palliative care"] },
    { id: "ophthalmology", name: "Eye Care", icon: "eye",
      summary: "Eye tests, cataract surgery and diabetic eye screening.",
      conditions: ["Cataracts", "Glaucoma", "Vision tests", "Diabetic eye checks"] },
    { id: "internal-medicine", name: "Internal Medicine", icon: "stethoscope",
      summary: "General adult care, health checks and management of long-term conditions.",
      conditions: ["Diabetes", "Thyroid", "Annual checkups", "Infections"] }
  ],

  doctors: [
    { id: "dr-amelia-lee", name: "Dr. Amelia Lee", dept: "cardiology", title: "Consultant Cardiologist",
      qualifications: "MD, FACC", experience: 16, languages: ["English", "Spanish"], days: "Mon, Wed, Fri", gender: "female", photo: "" },
    { id: "dr-marcus-reid", name: "Dr. Marcus Reid", dept: "neurology", title: "Neurologist",
      qualifications: "MD, PhD", experience: 12, languages: ["English"], days: "Tue, Thu", gender: "male", photo: "" },
    { id: "dr-priya-nair", name: "Dr. Priya Nair", dept: "pediatrics", title: "Head of Pediatrics",
      qualifications: "MBBS, MD (Peds)", experience: 19, languages: ["English", "Hindi", "Malayalam"], days: "Mon – Fri", gender: "female", photo: "" },
    { id: "dr-daniel-okafor", name: "Dr. Daniel Okafor", dept: "orthopedics", title: "Orthopedic Surgeon",
      qualifications: "MD, FRCS (Orth)", experience: 14, languages: ["English", "French"], days: "Mon, Thu, Sat", gender: "male", photo: "" },
    { id: "dr-sofia-marin", name: "Dr. Sofia Marín", dept: "womens-health", title: "Obstetrician & Gynecologist",
      qualifications: "MD, FACOG", experience: 11, languages: ["English", "Spanish"], days: "Tue, Wed, Fri", gender: "female", photo: "" },
    { id: "dr-hassan-karimi", name: "Dr. Hassan Karimi", dept: "oncology", title: "Medical Oncologist",
      qualifications: "MD, DM (Onc)", experience: 17, languages: ["English", "Arabic", "Farsi"], days: "Mon, Wed", gender: "male", photo: "" },
    { id: "dr-grace-whitfield", name: "Dr. Grace Whitfield", dept: "ophthalmology", title: "Eye Surgeon",
      qualifications: "MD, FRCOphth", experience: 9, languages: ["English"], days: "Thu, Fri", gender: "female", photo: "" },
    { id: "dr-kenji-sato", name: "Dr. Kenji Sato", dept: "internal-medicine", title: "Internal Medicine Physician",
      qualifications: "MD, FACP", experience: 21, languages: ["English", "Japanese"], days: "Mon – Sat", gender: "male", photo: "" }
  ],

  reviews: [
    { name: "Janet P.", rating: 5, date: "2026-08-14", source: "Google",
      text: "The cardiology team saw my father within the hour. Dr. Lee explained every test in plain words and called us the next day to check in." },
    { name: "Omar S.", rating: 5, date: "2026-07-30", source: "Google",
      text: "Booked online in the morning, seen the same afternoon. The reception staff were calm and kind even on a busy day." },
    { name: "Linda M.", rating: 4, date: "2026-07-02", source: "Facebook",
      text: "Knee replacement went smoothly and the physio sessions after were excellent. Parking could be easier." },
    { name: "Rahul K.", rating: 5, date: "2026-06-18", source: "Google",
      text: "The children's ward made my daughter feel safe. Dr. Nair was patient with all of our questions." },
    { name: "Beatriz A.", rating: 5, date: "2026-06-03", source: "Google",
      text: "From my first scan to delivery, the maternity team felt like family. Clean rooms, clear instructions." },
    { name: "Tom W.", rating: 4, date: "2026-05-21", source: "Healthgrades",
      text: "Clear follow-up plan after my migraine consultation. Waited 20 minutes past my slot, but the care was worth it." },
    { name: "Mei L.", rating: 5, date: "2026-05-09", source: "Google",
      text: "Cataract surgery on both eyes. Quick, painless and the nurses phoned me the evening after each one." },
    { name: "George H.", rating: 5, date: "2026-04-27", source: "Google",
      text: "Emergency department was fast and organised at 2 am. I felt listened to from the moment I walked in." },
    { name: "Fatima Z.", rating: 5, date: "2026-04-11", source: "Facebook",
      text: "The oncology support nurses helped our whole family understand the treatment plan. Thank you." }
  ],

  gallery: [
    { src: "assets/img/gallery/lobby.svg", w: 1200, h: 800, alt: "Main entrance and reception", tag: "facility" },
    { src: "assets/img/gallery/mri.svg", w: 800, h: 1000, alt: "MRI and imaging suite", tag: "equipment" },
    { src: "assets/img/gallery/ward.svg", w: 1000, h: 1000, alt: "Private patient room", tag: "facility" },
    { src: "assets/img/gallery/team.svg", w: 1200, h: 800, alt: "Nursing team on the cardiac ward", tag: "team" },
    { src: "assets/img/gallery/theatre.svg", w: 800, h: 1000, alt: "Operating theatre", tag: "equipment" },
    { src: "assets/img/gallery/kids.svg", w: 1000, h: 1000, alt: "Children's play area", tag: "facility" },
    { src: "assets/img/gallery/lab.svg", w: 1200, h: 800, alt: "Pathology laboratory", tag: "equipment" },
    { src: "assets/img/gallery/garden.svg", w: 800, h: 1000, alt: "Healing garden for patients and visitors", tag: "facility" },
    { src: "assets/img/gallery/camp.svg", w: 1200, h: 800, alt: "Free community health camp", tag: "events" },
    { src: "assets/img/gallery/doctors.svg", w: 1000, h: 1000, alt: "Specialists during morning rounds", tag: "team" },
    { src: "assets/img/gallery/ambulance.svg", w: 1200, h: 800, alt: "Emergency ambulance bay", tag: "facility" },
    { src: "assets/img/gallery/run.svg", w: 800, h: 1000, alt: "Annual heart-health charity run", tag: "events" }
  ],

  accreditations: [
    "National Hospital Accreditation", "Meridian Health Plan", "Heartline Insurance", "CareFirst Network",
    "State Trauma Level II", "Green Hospital Award", "Northstar Assurance", "Baby-Friendly Certified"
  ],

  journey: [
    { title: "Book", icon: "calendar-check", text: "Request a time online, by phone or on WhatsApp. We confirm by call or message." },
    { title: "Arrive", icon: "map-pin", text: "Check in at the main reception 15 minutes early with your ID and any previous reports." },
    { title: "See your specialist", icon: "stethoscope", text: "Your doctor examines you, orders any tests and explains the options in plain language." },
    { title: "Recover with support", icon: "heart-handshake", text: "Get a written care plan, follow-up reminders and a direct line to your care team." }
  ],

  faqs: [
    { q: "Do I need a referral to see a specialist?",
      a: "No. You can book any department directly. If your insurance requires a referral, bring it to your first visit." },
    { q: "Which insurance plans do you accept?",
      a: "We work with most major plans. Call the front desk with your policy number and we will confirm your cover before your visit." },
    { q: "What should I bring to my appointment?",
      a: "A photo ID, your insurance card, a list of current medicines and any recent test results or scans." },
    { q: "Can I change or cancel my appointment?",
      a: "Yes. Call us or reply to your confirmation message at least 24 hours before your slot." }
  ],

  reviewLink: "#", // link to your Google or other review profile

  social: { facebook: "#", instagram: "#", linkedin: "#", youtube: "#" }
};
