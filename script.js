document.documentElement.classList.add("js");

const plans = [
  { name: "Essential Build", pages: "Up to 6 custom pages", monthly: 80, setup: 500, label: "A CLEAR START", description: "A premium UX foundation with an affordable monthly path to launch, host, secure, and maintain your site.", features: ["Custom UX website design", "Hosting + SSL security", "Monthly upkeep and maintenance", "Clear lead pathways"] },
  { name: "Growth Engine", pages: "12–18 tailored pages", monthly: 200, setup: 1000, label: "ROOM TO GROW", description: "A deeper custom experience with more service journeys, UX refinement, and priority monthly care.", features: ["Everything in Essential", "Expanded UX service journeys", "Content and conversion improvements", "Priority monthly maintenance"] },
  { name: "Authority Platform", pages: "Bespoke scope", monthly: 300, setup: 1500, label: "BUILT FOR MOMENTUM", description: "A bespoke UX platform with advanced workflows, proactive care, and a long-term digital partner.", features: ["Everything in Growth", "Bespoke UX architecture", "Advanced integrations", "Proactive security and optimization"] },
];
const chartMax = Math.ceil(Math.max(...plans.map((plan) => plan.setup + plan.monthly * 12 * 10)) / 5000) * 5000 || 1000;
const terms = [
  { label: "1-year term", discount: 0, description: "Base monthly rates" },
  { label: "3-year term", discount: 0.10, description: "10% illustrative rate reduction" },
  { label: "5-year term", discount: 0.20, description: "20% illustrative rate reduction" },
  { label: "10-year term", discount: 0.30, description: "30% illustrative rate reduction" },
];
let selectedTerm = 0;
let selectedPlan = 0;
const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;

function costAtYear(plan, termIndex, year) {
  return plan.setup + plan.monthly * (1 - terms[termIndex].discount) * 12 * year;
}

function renderChart() {
  const chart = document.getElementById("cost-chart");
  if (!chart) return;
  const plan = plans[selectedPlan];
  const width = 620, height = 214;
  const pad = { top: 13, right: 11, bottom: 26, left: 48 };
  const plotW = width - pad.left - pad.right, plotH = height - pad.top - pad.bottom;
  const baseEnd = costAtYear(plan, 0, 10), selectedEnd = costAtYear(plan, selectedTerm, 10);
  const max = chartMax;
  const xCompression = 0.76; // Compress the time axis so cumulative cost differences read more clearly.
  const compressedPlotW = plotW * xCompression;
  const x = (year) => pad.left + year / 10 * compressedPlotW;
  const y = (cost) => pad.top + plotH - cost / max * plotH;
  const line = (term) => Array.from({ length: 11 }, (_, year) => `${year ? "L" : "M"}${x(year).toFixed(1)},${y(costAtYear(plan, term, year)).toFixed(1)}`).join(" ");
  const grid = Array.from({ length: 5 }, (_, i) => {
    const tick = max * i / 4;
    return `<g><line x1="${pad.left}" y1="${y(tick)}" x2="${x(10)}" y2="${y(tick)}" stroke="#d9e1e6"/><text x="${pad.left - 8}" y="${y(tick) + 3}" text-anchor="end" fill="#64737e" font-size="9" font-family="DM Mono, monospace">${tick === 0 ? "$0" : `$${Math.round(tick / 1000)}k`}</text></g>`;
  }).join("");
  const labels = Array.from({ length: 6 }, (_, i) => `<text x="${x(i * 2)}" y="${height - 5}" text-anchor="middle" fill="#858d82" font-size="9" font-family="DM Mono, monospace">${i * 2}</text>`).join("");
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="presentation" aria-hidden="true"><defs><linearGradient id="chart-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#c62835" stop-opacity=".16"/><stop offset="100%" stop-color="#f28c63" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${line(0)} L${x(10)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z" fill="url(#chart-area)"/><path d="${line(0)}" fill="none" stroke="#858b82" stroke-width="2" stroke-dasharray="5 5"/><path d="${line(selectedTerm)}" fill="none" stroke="#c62835" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><line x1="${x(10)}" y1="${pad.top}" x2="${x(10)}" y2="${height - pad.bottom}" stroke="#cbd5dc" stroke-dasharray="3 4"/><text x="${x(10) + 8}" y="${Math.max(pad.top + 12, y(selectedEnd) - 8)}" fill="#c62835" font-size="9" font-family="DM Mono, monospace">${money(selectedEnd)}</text>${labels}<circle cx="${x(10)}" cy="${y(selectedEnd)}" r="4" fill="#c62835" stroke="#ffffff" stroke-width="2"/></svg>`;
  chart.setAttribute("aria-label", `10-year cumulative cost comparison for ${plan.name}. Selected term ${terms[selectedTerm].label}: ${money(selectedEnd)} including setup. One-year rate: ${money(baseEnd)} including setup.`);
  const savings = document.getElementById("savings-value");
  if (savings) savings.textContent = money(baseEnd - selectedEnd);
  const termLabel = document.getElementById("term-label");
  if (termLabel) termLabel.textContent = terms[selectedTerm].label;
  const termDiscount = document.getElementById("term-discount");
  if (termDiscount) termDiscount.textContent = terms[selectedTerm].description;
  const sliderTermLabel = document.getElementById("slider-term-label");
  if (sliderTermLabel) sliderTermLabel.textContent = terms[selectedTerm].label;
  const selectedLabel = document.getElementById("selected-plan-label");
  if (selectedLabel) selectedLabel.textContent = plan.name.toUpperCase();
  const slider = document.getElementById("term-slider");
  if (slider) {
    slider.value = String(selectedTerm);
    slider.setAttribute("aria-valuetext", terms[selectedTerm].label);
    slider.style.setProperty("--slider-fill", `${selectedTerm / (terms.length - 1) * 100}%`);
  }
  document.querySelectorAll(".term-button").forEach((button, index) => {
    const active = index === selectedTerm;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderPriceCards() {
  const container = document.getElementById("price-cards");
  if (!container) return;
  container.replaceChildren(...plans.map((plan, index) => {
    const card = document.createElement("article");
    card.className = `price-card${index === selectedPlan ? " is-selected" : ""}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-pressed", String(index === selectedPlan));
    card.setAttribute("aria-label", `Select ${plan.name} and update the comparison graphic`);
    card.dataset.planCard = String(index);
    const price = Math.round(plan.monthly * (1 - terms[selectedTerm].discount));
    const features = plan.features.map((feature) => `<li>${feature}</li>`).join("");
    card.innerHTML = `<span class="eyebrow">PLAN 0${index + 1}</span><h3>${plan.name}</h3><p class="card-pages">${plan.pages}</p><ul class="card-feature-list">${features}</ul><div class="card-price">${money(price)}<small> / month</small></div><div class="card-setup">${money(plan.setup)} launch setup · care included</div>`;
    const select = () => {
      selectedPlan = index;
      renderPriceCards();
      renderChart();
      document.querySelector(`[data-plan-card="${index}"]`)?.focus({ preventScroll: true });
    };
    card.addEventListener("click", select);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      select();
    });
    return card;
  }));
  const contactCta = document.getElementById("pricing-contact");
  if (contactCta) contactCta.href = `contact.html?plan=${selectedPlan}`;
}

document.querySelectorAll(".term-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedTerm = Number(button.dataset.term);
    renderChart();
    renderPriceCards();
  });
});

const termSlider = document.getElementById("term-slider");
if (termSlider) termSlider.addEventListener("input", () => {
  selectedTerm = Number(termSlider.value);
  renderChart();
  renderPriceCards();
});
document.getElementById("term-back")?.addEventListener("click", () => {
  selectedTerm = Math.max(0, selectedTerm - 1);
  renderChart();
  renderPriceCards();
});
document.getElementById("term-forward")?.addEventListener("click", () => {
  selectedTerm = Math.min(terms.length - 1, selectedTerm + 1);
  renderChart();
  renderPriceCards();
});

const priceCards = document.getElementById("price-cards");
if (priceCards) {
  renderPriceCards();
  renderChart();
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    navigation.classList.toggle("is-open", !isOpen);
  });
  navigation.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    navigation.classList.remove("is-open");
  });
}

const currentPage = document.body.dataset.page;
const currentLink = document.querySelector(`[data-nav="${currentPage}"]`);
if (currentLink) currentLink.setAttribute("aria-current", "page");
document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  const sent = new URLSearchParams(window.location.search).get("sent");
  const status = document.getElementById("form-status");
  if (sent === "1" && status) {
    status.textContent = "Thanks — your message was sent. We’ll be in touch soon.";
  }
  contactForm.addEventListener("submit", () => {
    if (status) status.textContent = "Sending your message…";
  });
}

const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}


/* Reliable form submission and true return-to-top behavior */
document.getElementById("contact-form")?.addEventListener("submit", (event) => {
  const form = event.currentTarget;
  const email = form.querySelector('[name="client_email"]');
  const replyTo = form.querySelector('[name="_replyto"]');
  if (email && replyTo) replyTo.value = email.value.trim();
});

document.querySelectorAll('a.back-top[href="#top"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduceMotion ? "auto" : "smooth";
    window.scrollTo({ top: 0, left: 0, behavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
  });
});
