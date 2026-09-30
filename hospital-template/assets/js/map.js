/* =====================================================================
   MAP — no API key needed.
   provider "leaflet": OpenStreetMap tiles via Leaflet (default)
   provider "google": paste the iframe src from Google Maps > Share > Embed a map
   ===================================================================== */
(function () {
  const H = window.HOSPITAL;
  const el = document.getElementById("map");
  if (!el) return;
  const m = H.map;
  const { esc } = window.Site;

  function init() {
    if (m.provider === "google" && m.googleEmbedSrc) {
      el.innerHTML = `<iframe src="${esc(m.googleEmbedSrc)}" title="Map showing ${esc(H.name)}" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade" style="border:0;width:100%;height:100%;position:absolute;inset:0" allowfullscreen></iframe>`;
      return;
    }
    if (!window.L) {
      el.querySelector(".map-placeholder").textContent = "The map could not load. Use the address and directions link beside it.";
      return;
    }
    el.innerHTML = "";
    const map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView([m.lat, m.lng], m.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);
    const pin = L.divIcon({ className: "", html: '<div class="map-pin"><span>+</span></div>', iconSize: [48, 48], iconAnchor: [8, 48], popupAnchor: [16, -44] });
    L.marker([m.lat, m.lng], { icon: pin, title: H.name, alt: H.name })
      .addTo(map)
      .bindPopup(`<strong>${esc(H.name)}</strong><br>${esc(H.address)}<br><a href="https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}" target="_blank" rel="noopener">Get directions</a>`)
      .openPopup();
    // Zoom with the wheel only after the map is clicked (so page scrolling isn't hijacked)
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
    if (window.gsap && !Site.reduced()) gsap.from(el, { autoAlpha: 0, scale: 0.97, duration: 0.9, ease: "expo.out" });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) { obs.disconnect(); init(); }
    }, { rootMargin: "200px" }).observe(el);
  } else init();
})();
