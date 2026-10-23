const tiers = [
  { name: "Essential Build", short: "Essential Build", pages: "6 custom pages", pageCount: 6, monthly: 80, setup: 500, features: ["Custom layout", "Mobile-ready", "Local SEO basics"], eyebrow: "A CLEAR START", title: "A polished first impression.", description: "The essential foundation: a clean, fast website built to explain what you do and make it easy for customers to get in touch." },
  { name: "Growth Engine", short: "Growth Engine", pages: "12 custom pages", pageCount: 12, monthly: 150, setup: 800, features: ["Expanded services", "Conversion pages", "Analytics ready"], eyebrow: "ROOM TO GROW", title: "More room for every service.", description: "Give your core services their own space, with a stronger page structure that makes it easier for customers to find the right fit." },
  { name: "Authority Platform", short: "Authority Platform", pages: "18 custom pages", pageCount: 18, monthly: 200, setup: 1000, features: ["Service-area pages", "Lead pathways", "Full integration"], eyebrow: "BUILT FOR MOMENTUM", title: "Show up across your market.", description: "Build a deeper local presence with dedicated service and location pages, thoughtful conversion paths, and room for useful integrations." },
  { name: "Dominance Hub", short: "Dominance Hub", pages: "24 custom pages", pageCount: 24, monthly: 250, setup: 1200, features: ["Custom funnels", "Local landing pages", "Advanced UI"], eyebrow: "A BROADER FOOTPRINT", title: "Turn more visits into action.", description: "A larger site with custom landing pages and focused lead funnels, designed to support multiple services and local markets." },
  { name: "Enterprise Ecosystem", short: "Enterprise Ecosystem", pages: "Scope to fit", pageCount: null, monthly: 300, setup: 1500, features: ["Bespoke structure", "Custom workflows", "Advanced integrations"], eyebrow: "TAILORED TO YOUR NEEDS", title: "A digital system built around you.", description: "A bespoke platform for complex operations, customer journeys, and integrations. Final scope and deliverables are agreed together." },
];

const terms = [
  { label: "1-year term", discount: 0, description: "Base monthly rates" },
  { label: "3-year term", discount: 0.10, description: "10% sample rate reduction" },
  { label: "5-year term", discount: 0.20, description: "20% sample rate reduction" },
  { label: "10-year term", discount: 0.30, description: "30% sample rate reduction" },
];

let selectedTerm = 0;
let selectedTier = 0;
const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;

function updateShowcase(index) {
  const tier = tiers[index];
  document.querySelectorAll(".tier-option").forEach((button, buttonIndex) => {
    const active = buttonIndex === index;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  const panel = document.getElementById("tier-panel");
  panel.setAttribute("aria-labelledby", `tier-tab-${index + 1}`);
  document.getElementById("showcase-tag").textContent = tier.short.toUpperCase();
  document.getElementById("showcase-eyebrow").textContent = tier.eyebrow;
  document.getElementById("showcase-title").textContent = tier.title;
  document.getElementById("showcase-description").textContent = tier.description;
  document.getElementById("showcase-pages").textContent = tier.pages.toUpperCase();
  document.getElementById("showcase-features").replaceChildren(...tier.features.map((feature) => {
    const tag = document.createElement("span");
    tag.textContent = feature;
    return tag;
  }));
}

function costAtYear(tier, termIndex, year) {
  const term = terms[termIndex];
  const monthly = tier.monthly * (1 - term.discount);
  return tier.setup + monthly * 12 * year;
}

function renderChart() {
  const tier = tiers[selectedTier];
  const width = 620;
  const height = 214;
  const pad = { top: 13, right: 11, bottom: 26, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const baseEnd = costAtYear(tier, 0, 10);
  const selectedEnd = costAtYear(tier, selectedTerm, 10);
  const max = Math.ceil(Math.max(baseEnd, selectedEnd) / 5000) * 5000 || 1000;
  const x = (year) => pad.left + (year / 10) * plotW;
  const y = (cost) => pad.top + plotH - (cost / max) * plotH;
  const line = (term) => Array.from({ length: 11 }, (_, year) => `${year ? "L" : "M"}${x(year).toFixed(1)},${y(costAtYear(tier, term, year)).toFixed(1)}`).join(" ");
  const ticks = Array.from({ length: 5 }, (_, i) => max * i / 4);
  const grid = ticks.map((tick) => `<g><line x1="${pad.left}" y1="${y(tick)}" x2="${width - pad.right}" y2="${y(tick)}" stroke="#353b34" stroke-width="1"/><text x="${pad.left - 8}" y="${y(tick) + 3}" text-anchor="end" fill="#858d82" font-size="9" font-family="DM Mono, monospace">${tick === 0 ? "$0" : `$${Math.round(tick / 1000)}k`}</text></g>`).join("");
  const yearLabels = Array.from({ length: 6 }, (_, i) => {
    const year = i * 2;
    return `<text x="${x(year)}" y="${height - 5}" text-anchor="middle" fill="#858d82" font-size="9" font-family="DM Mono, monospace">${year}</text>`;
  }).join("");
  const svg = `<svg viewBox="0 0 ${width} ${height}" role="presentation" aria-hidden="true"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f28c63" stop-opacity=".16"/><stop offset="100%" stop-color="#f28c63" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${line(0)} L${x(10)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z" fill="url(#area)"/><path d="${line(0)}" fill="none" stroke="#858b82" stroke-width="2" stroke-dasharray="5 5"/><path d="${line(selectedTerm)}" fill="none" stroke="#f28c63" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${yearLabels}<circle cx="${x(10)}" cy="${y(selectedEnd)}" r="4" fill="#f28c63" stroke="#1b1e1b" stroke-width="2"/></svg>`;
  const chart = document.getElementById("cost-chart");
  chart.innerHTML = svg;
  chart.setAttribute("aria-label", `10-year cumulative cost comparison. The selected ${terms[selectedTerm].label} costs ${money(selectedEnd)} including setup. The 1-year rate costs ${money(baseEnd)} including setup.`);
  document.getElementById("savings-value").textContent = money(baseEnd - selectedEnd);
  document.getElementById("term-label").textContent = terms[selectedTerm].label;
  document.getElementById("term-discount").textContent = terms[selectedTerm].description;
  document.querySelectorAll(".term-button").forEach((button, index) => {
    const active = index === selectedTerm;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderPriceCards() {
  const container = document.getElementById("price-cards");
  container.replaceChildren(...tiers.map((tier, index) => {
    const card = document.createElement("article");
    card.className = `price-card${index === selectedTier ? " is-highlighted" : ""}`;
    const termPrice = Math.round(tier.monthly * (1 - terms[selectedTerm].discount));
    card.innerHTML = `<span class="eyebrow">TIER ${index + 1}</span><h3>${tier.name}</h3><p class="card-pages">${tier.pages} · ${tier.features[0]}</p><div class="card-price">${money(termPrice)}<small> / month</small></div><div class="card-setup">${money(tier.setup)} initial setup</div><button class="card-select" type="button" data-select-tier="${index}" aria-pressed="${index === selectedTier}">${index === selectedTier ? "Selected build" : "Compare this build"}</button>`;
    return card;
  }));
}

function updatePricing() {
  const select = document.getElementById("tier-select");
  select.value = String(selectedTier);
  renderChart();
  renderPriceCards();
}

document.querySelectorAll(".tier-option").forEach((button) => {
  button.addEventListener("click", () => updateShowcase(Number(button.dataset.tier) - 1));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = Number(button.dataset.tier) - 1;
    const next = event.key === "Home" ? 0 : event.key === "End" ? tiers.length - 1 : (current + (event.key === "ArrowDown" ? 1 : tiers.length - 1)) % tiers.length;
    document.querySelector(`[data-tier="${next + 1}"]`).focus();
    updateShowcase(next);
  });
});

document.querySelectorAll(".term-button").forEach((button) => {
  button.addEventListener("click", () => {
    selectedTerm = Number(button.dataset.term);
    updatePricing();
  });
});

document.getElementById("tier-select").addEventListener("change", (event) => {
  selectedTier = Number(event.target.value);
  updatePricing();
});

document.getElementById("price-cards").addEventListener("click", (event) => {
  const button = event.target.closest("[data-select-tier]");
  if (!button) return;
  selectedTier = Number(button.dataset.selectTier);
  updatePricing();
  document.getElementById("tier-select").focus({ preventScroll: true });
});

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");
menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  navigation.classList.toggle("is-open", !isOpen);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    navigation.classList.remove("is-open");
  }
});

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`RevenUX website inquiry — ${data.get("business")}`);
  const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nBusiness: ${data.get("business")}\n\nProject details:\n${data.get("project") || "Not provided"}`);
  // Replace this address with your preferred inbox before launch.
  window.location.href = `mailto:hello@revenuxdesign.com?subject=${subject}&body=${body}`;
  document.getElementById("form-status").textContent = "Your email draft is ready. Review it and press Send in your email app.";
});

document.getElementById("year").textContent = new Date().getFullYear();
updateShowcase(0);
updatePricing();
