# TSAGAAN GARID — Stay & Explore

A six-page HTML/CSS/JavaScript site for international independent travellers, couples, families and groups. The design combines calm countryside accommodation with personal travel experiences. English is the default on a first visit; EN / MN switches the entire interface.

## Open the site

Open `index.html` directly, or serve the project:

```sh
python3 -m http.server 8000
```

Visit http://localhost:8000. Upload all six HTML files, `styles.css`, `script.js`, `config.js` and `assets/` to any static hosting service. No build step is needed. Do not upload `tests/` unless you want the test harness publicly accessible. `emailjs.txt` is a local setup note and is not needed for deployment.

## Pages

- `index.html`: introduction, accommodation overview, experiences.
- `stay.html`: gers, A-frame cabins, practical accommodation information.
- `experiences.html`: personal itineraries, herding-family visits, nature experiences, inquiry process.
- `about.html`: camp introduction and approach to hospitality.
- `getting-here.html`: supplied address, general-area map link, FAQs.
- `contact.html`: trip inquiry form. Availability, price, payment/cancellation terms and arrangements are discussed directly; submitting is not a booking confirmation.

## Languages and content

Each translated text node has `data-en` and `data-mn` attributes and English fallback content. Edit both attributes and the default text. Translated image alt text, placeholders, page titles, metadata and accessible labels are included. Dynamic form/validation messages are in `script.js`.

The language choice is stored locally; internal page links also include `?lang=en` or `?lang=mn` so navigation works when storage is unavailable. No contact details are saved in local storage. Switching languages preserves form values.

## Activate EmailJS

Your **serviceId**, **publicKey** and **templateId** have been copied from `emailjs.txt` into `config.js`. The local configuration is complete. Paste `emailjs/template.html` into the matching EmailJS dashboard template and follow `emailjs/SETUP.md`. Open `emailjs/preview.html` to view the design with fictional sample data. Never add a private API key. Set the recipient email in the EmailJS template dashboard, and use `{{reply_to}}` for Reply-To.

Suggested template:

```
Name: {{from_name}}
Email: {{reply_to}}
Phone: {{phone}}
Preferred arrival: {{arrival_date}}
Nights: {{nights}}
Guests: {{guests}}
Travelling as: {{traveller_type}}
Accommodation: {{accommodation}}
Message: {{message}}
Preferred language: {{language}}
```

Accommodation and traveller type values are stable English identifiers in both interface languages. Configure allowed domains for your deployed site and localhost if applicable. Send a real test inquiry to your own inbox after setup to verify delivery.

Without credentials, the form explicitly says the inquiry was not sent and gives the phone number. On failure, entered details remain. Duplicate submissions are blocked while a request is pending. Real email delivery has not been tested; dashboard template content and recipient configuration must be saved there first.

Official API documentation: https://www.emailjs.com/docs/sdk/send/

## Images and placeholders

- `assets/hero.jpg`, `assets/ger.jpg`, `assets/cabin.jpg` are AI-generated concepts, not actual camp photographs. They were generated with the built-in image generation tool in the first version and reused here. Original PNGs and full prompts in `assets/prompts.txt` are retained.
- All five social buttons open an explicitly labelled coming-soon dialog. Replace them with actual links when available.
- The map searches the general Tariat area; it is not an exact camp pin.
- No unprovided prices, bed capacities, private bathroom claims, travel times or transfer services are invented.
- Google Fonts and the contact page EmailJS SDK need internet access. System fonts provide a fallback.

## Verification

`tests/browser.html` runs browser checks with mocked email responses; it never sends a real inquiry. Run over the local HTTP server and inspect `#test-results` after completion. The local-file Chrome test used `--allow-file-access-from-files` for same-origin iframe access, a temporary profile and a virtual time budget.

146 checks passed across all six pages:

- 320, 390, 768 and 1440 CSS pixel widths, English and Mongolian: no horizontal page overflow and translated text matches the selected language.
- Mobile menu, Escape key, demo social dialogs and FAQ expansion.
- Language in page links and accommodation selection carried into the inquiry form.
- Unconfigured, failure, pending, success and duplicate-submit behavior with mock EmailJS responses.
- Form values retained on failure/language changes, inquiry details passed to the mock, reset only after success, past-date validation.

Local assets and internal anchors were also checked. Desktop and mobile visual screenshots were inspected in headless Chrome. These checks do not constitute physical iPhone/Android or Safari testing. See `tests/last-results.json` for the recorded checks.

## GitHub and Vercel

Repository: https://github.com/togosmaabaatar/camp

Vercel builds with `npm run build` and serves `dist/`. The build copies only the six pages, CSS/JavaScript, public EmailJS browser configuration and website image assets. Local configuration notes, email template examples, original PNGs and browser tests are not published in the website output. `config.js` intentionally contains public browser identifiers, not private API keys.

For future deployments, push changes to the connected repository's `main` branch, or run `vercel --prod` after logging in and linking the project.
