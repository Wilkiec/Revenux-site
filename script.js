document.documentElement.classList.add("js");

const plans = [
  { name: "Essential Build", pages: "Up to 6 custom pages", monthly: 80, setup: 500, label: "A CLEAR START", description: "A polished foundation for businesses ready to look established online and make it easy for customers to get in touch.", features: ["Custom website design", "Mobile-ready pages", "Local SEO foundation", "Contact and lead pathways"] },
  { name: "Growth Engine", pages: "12–18 tailored pages", monthly: 200, setup: 1000, label: "ROOM TO GROW", description: "A deeper service presence with focused pages and conversion paths to support a growing local business.", features: ["Everything in Essential", "Expanded service pages", "Service-area structure", "Analytics-ready setup"] },
  { name: "Authority Platform", pages: "Bespoke scope", monthly: 300, setup: 1500, label: "BUILT FOR MOMENTUM", description: "A custom digital platform for established teams with more services, markets, and workflows to support.", features: ["Everything in Growth", "Custom page architecture", "Advanced integrations", "Tailored lead journeys"] },
];
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
  const max = Math.ceil(Math.max(baseEnd, selectedEnd) / 5000) * 5000 || 1000;
  const x = (year) => pad.left + year / 10 * plotW;
  const y = (cost) => pad.top + plotH - cost / max * plotH;
  const line = (term) => Array.from({ length: 11 }, (_, year) => `${year ? "L" : "M"}${x(year).toFixed(1)},${y(costAtYear(plan, term, year)).toFixed(1)}`).join(" ");
  const grid = Array.from({ length: 5 }, (_, i) => {
    const tick = max * i / 4;
    return `<g><line x1="${pad.left}" y1="${y(tick)}" x2="${width - pad.right}" y2="${y(tick)}" stroke="#353b34"/><text x="${pad.left - 8}" y="${y(tick) + 3}" text-anchor="end" fill="#858d82" font-size="9" font-family="DM Mono, monospace">${tick === 0 ? "$0" : `$${Math.round(tick / 1000)}k`}</text></g>`;
  }).join("");
  const labels = Array.from({ length: 6 }, (_, i) => `<text x="${x(i * 2)}" y="${height - 5}" text-anchor="middle" fill="#858d82" font-size="9" font-family="DM Mono, monospace">${i * 2}</text>`).join("");
  chart.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="presentation" aria-hidden="true"><defs><linearGradient id="chart-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#f28c63" stop-opacity=".16"/><stop offset="100%" stop-color="#f28c63" stop-opacity="0"/></linearGradient></defs>${grid}<path d="${line(0)} L${x(10)},${height - pad.bottom} L${x(0)},${height - pad.bottom} Z" fill="url(#chart-area)"/><path d="${line(0)}" fill="none" stroke="#858b82" stroke-width="2" stroke-dasharray="5 5"/><path d="${line(selectedTerm)}" fill="none" stroke="#f28c63" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${labels}<circle cx="${x(10)}" cy="${y(selectedEnd)}" r="4" fill="#f28c63" stroke="#1b1e1b" stroke-width="2"/></svg>`;
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
    card.dataset.planCard = String(index);
    const price = Math.round(plan.monthly * (1 - terms[selectedTerm].discount));
    const features = plan.features.map((feature) => `<li>${feature}</li>`).join("");
    card.innerHTML = `<span class="eyebrow">PLAN 0${index + 1}</span><h3>${plan.name}</h3><p class="card-pages">${plan.pages}</p><ul class="card-feature-list">${features}</ul><div class="card-price">${money(price)}<small> / month</small></div><div class="card-setup">${money(plan.setup)} initial setup · sample pricing</div><button class="card-select" type="button" aria-pressed="${index === selectedPlan}">${index === selectedPlan ? "Selected for graphic" : "Select this tier"}<span>↗</span></button>`;
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
  priceCards.addEventListener("click", (event) => {
    const card = event.target.closest(".price-card");
    if (!card) return;
    selectedPlan = Number(card.dataset.planCard);
    renderPriceCards();
    renderChart();
  });
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
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan");
  if (plan !== null && plans[Number(plan)]) document.getElementById("plan").value = plans[Number(plan)].name;
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`RevenUX website inquiry — ${data.get("business")}`);
    const body = encodeURIComponent(`Name: ${data.get("name")}\nEmail: ${data.get("email")}\nBusiness: ${data.get("business")}\nPlan: ${data.get("plan")}\n\nProject details:\n${data.get("project") || "Not provided"}`);
    document.getElementById("form-status").textContent = "Your email draft is ready. Review it and press Send in your email app.";
    window.location.href = `mailto:hello@revenuxdesign.com?subject=${subject}&body=${body}`;
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
