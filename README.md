# RevenUX Design

A responsive, static website for RevenUX. Built with semantic HTML, CSS, and vanilla JavaScript so it can be hosted directly on GitHub Pages without a build step or platform watermark.

## Run locally

Open `index.html` in a browser, or run a local static server from this directory:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish with GitHub Pages

This repository includes a GitHub Actions workflow in `.github/workflows/pages.yml`. In the repository’s **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**. Pushes to `main` deploy the site.

Once the default `https://<username>.github.io/<repository>/` URL works, add your custom domain under **Settings → Pages → Custom domain**. GitHub will show the DNS records to enter at your registrar. The repository must be public when using GitHub Free.

## Before launch

- In `script.js`, change the `mailto:hello@revenuxdesign.com` address in the contact form submit handler to the inbox you want to receive inquiries.
- Review the sample pricing, term discounts, business descriptions, and founder bios for accuracy before sharing publicly.
- The contact form opens a prefilled email draft. It does not send or store form data itself.

## Project files

- `index.html` — page structure and content
- `styles.css` — responsive visual design and components
- `script.js` — tier showcase, pricing calculator, chart, mobile navigation, and email-draft form
- `favicon.svg` — site icon
