# RevenUX Design

A responsive, multi-page website for RevenUX. Built with semantic HTML, CSS, and vanilla JavaScript so it can be hosted on GitHub Pages without a build step or platform watermark.

## Pages

- `index.html` — home page and introduction
- `services.html` — services and project process
- `pricing.html` — three sample plans and interactive term comparison
- `about.html` — team and approach
- `contact.html` — project inquiry form

Shared visual styles and interactions are in `styles.css` and `script.js`.

## Run locally

Open `index.html` in a browser, or run a static server from this directory:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

The `.github/workflows/pages.yml` workflow deploys the site when changes reach `main`. In the repository’s **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.

The `CNAME` file points Pages to `revenuxdesign.com`. Keep the matching DNS records at the domain registrar in place when making future changes.

## Before sharing publicly

- Confirm the sample plan prices, term reductions, scope, and founder descriptions.
- In `script.js`, change the `hello@revenuxdesign.com` address if inquiries should go to a different inbox.
- The contact form opens a prefilled email draft. It does not send or store form data itself.
