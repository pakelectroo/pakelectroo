# pakelectroo: Cloudflare Pages setup guide

This puts your site online for free on Cloudflare Pages, with HTTPS included. Cloudflare's dashboard labels change now and then, so if a button name differs slightly, look for the closest match.

## What is in the folder

| File | What it does |
|---|---|
| `index.html` | The whole home page: header, services, how a job runs, FAQ, contact form |
| `styles.css` | All colours, fonts and layout |
| `script.js` | Mobile menu and the form that sends a WhatsApp message |
| `404.html` | Page shown for broken links (Cloudflare uses it automatically) |
| `favicon.svg` | Browser tab icon |
| `robots.txt`, `sitemap.xml` | Help Google find and index the site |
| `_headers` | Security headers Cloudflare applies to every page |

Keep every file in the same folder, with `index.html` at the top level. Do not put them inside another folder when you upload.

---

## Step 0: Preview it on your computer (optional)

Open the folder in a terminal and run:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. Opening `index.html` by double-click also works, but the CSS and script links start with `/`, so use the local server for a correct preview.

---

## Step 1: Create a free Cloudflare account

1. Go to <https://dash.cloudflare.com/sign-up> and sign up with your email.
2. Confirm your email address.

---

## Step 2 (easiest): Deploy by direct upload

1. In the Cloudflare dashboard, open **Workers & Pages**.
2. Click **Create application**, then choose the **Pages** option, then **Upload your static files** (also called **Direct Upload**).
3. Give the project a name, for example `pakelectroo`. Your site address will be `https://pakelectroo.pages.dev`.
4. Drag in the **folder** (or a **.zip** of its contents). Make sure `index.html` is at the top level.
5. Click **Deploy**.
6. When it finishes, open the `*.pages.dev` link. Your site is live.

**To update the site later:** open the project, go to **Deployments**, choose **Create new deployment**, and upload the changed folder again. The old version stays in the list, and you can roll back to it.

---

## Step 2 (alternative): Deploy from GitHub with automatic updates

Use this if you want every change you push to go live on its own.

1. Create a GitHub repository and upload all the files to it (top level, not in a subfolder).
2. In Cloudflare, open **Workers & Pages**, create a Pages project, and choose **Connect to Git**.
3. Authorise GitHub and select the repository.
4. Build settings:
   - Framework preset: **None**
   - Build command: leave **empty**
   - Build output directory: **/** (or leave empty)
5. Click **Save and Deploy**.

After this, every push to the main branch publishes automatically.

---

## Step 3: Use your own domain (for example pakelectroo.com)

You need a domain name first. Cloudflare Registrar only sells a limited set of extensions, so if you want a `.pk` domain, buy it from a Pakistani registrar and keep it there until Step 3B.

### 3A. Domain registered or already on Cloudflare

1. Open your Pages project, then **Custom domains**, then **Set up a domain**.
2. Enter your domain, for example `pakelectroo.com`, and continue.
3. Confirm. Cloudflare creates the DNS record and issues the HTTPS certificate for you. This can take a few minutes.
4. Repeat for `www.pakelectroo.com` if you want both to work. Set up a redirect from one to the other so Google sees a single address (**Rules, then Redirect Rules**).

### 3B. Domain bought somewhere else (including .pk)

For the main domain (`pakelectroo.com`, no `www`), Cloudflare needs to manage its DNS:

1. In the dashboard click **Add a domain**, enter your domain, and choose the **Free** plan.
2. Cloudflare shows you two nameservers.
3. Log in to the company where you bought the domain and replace its nameservers with those two. Changes can take from a few minutes to a day.
4. When Cloudflare shows the domain as **Active**, follow Step 3A.

If you only want a subdomain such as `www.pakelectroo.com` and prefer to keep your current DNS provider, add a **CNAME** record there pointing `www` to `your-project.pages.dev`, but only **after** you have added the domain in the Pages **Custom domains** screen. Adding the CNAME first can cause a 522 error.

---

## Step 4: Update the placeholders

Before you promote the site, change these:

**1. Your domain.** The files use `https://pakelectroo.com` in the canonical link, social tags, structured data, `robots.txt` and `sitemap.xml`. If your real address is different, find and replace it in `index.html`, `robots.txt` and `sitemap.xml`. On Mac or Linux:

```
sed -i 's#https://pakelectroo.com#https://YOUR-REAL-DOMAIN#g' index.html robots.txt sitemap.xml
```

(On macOS use `sed -i ''` instead of `sed -i`.)

**2. WhatsApp number.** It is set to `923008537376` (that is +92 300 8537376 without the plus sign). To change it, search for `923008537376` in `index.html` and `script.js`.

**3. More contact details.** In `index.html`, find the commented block in the contact section. Remove the `<!--` and `-->` lines and fill in your email, address and opening hours.

**4. Text and services.** All wording is plain HTML in `index.html`. Edit it with any text editor, then redeploy.

---

## Changing the colours

All colours are listed at the top of `styles.css`, under "Colour palette". Change the values there and the whole site follows. Current palette: deep teal (`--ink`, `--brand`), orange accent (`--accent`) and WhatsApp green (`--wa`).

Two other places hold colour: the `theme-color` line in `index.html` (browser bar on phones) and the two colours in `favicon.svg`. Keep white text readable: dark backgrounds with light text, and use a contrast checker such as <https://webaim.org/resources/contrastchecker/> if you pick new colours.

---

## Adding customer reviews

The "What customers say" section stays hidden until you add real reviews.

1. Ask the customer if you may show their words and first name (WhatsApp messages work well; keep a screenshot).
2. Open `reviews.json` and add each review. See `reviews.example.json` for the exact format:
   - `name`, `text` are required. `city`, `rating` (1 to 5) and `date` are optional.
   - `googleReviewsUrl` is optional. Paste your Google Business Profile review link and a "Read or write a review on Google" link appears.
3. Redeploy. The section appears on its own.

Only publish reviews that real customers wrote. Invented or edited reviews can get your Google listing penalised and may break consumer protection rules.

## Adding the intro video

1. Export your video as **MP4 (H.264)**, 16:9, ideally under 5 MB, and name it exactly `intro.mp4`.
2. Put it in the `video` folder (next to `images`).
3. Redeploy. A video band appears under the hero, plays muted on a loop (it will not autoplay for visitors who have reduced motion turned on) and shows play/pause controls.

If the file is not there, the band stays hidden.

## Adding photos of your work

The site already includes illustrative images (in the `images` folder) in the services list and photo strip. The footer says "Images on this site are illustrative." Keep that line unless every image is a real photo of your work.

The "Our work" section also stays hidden until you add photos.

1. Make an `images` folder next to `index.html` and put your own job photos in it (JPG or WebP, ideally under 300 KB each; resize large phone photos first, for example with <https://squoosh.app>).
2. Open `gallery.json` and list them:

```json
{
  "photos": [
    { "src": "/images/db-board-lahore.jpg", "alt": "Tidy distribution board with labelled breakers", "caption": "New DB board, Lahore" }
  ]
}
```

3. Redeploy.

Do not copy images from Google Search. Most belong to someone else, and using them on a business site can lead to copyright claims. Your own job photos are better anyway, because customers trust real work. If you want stock photos, use sources whose licence allows commercial use, such as Unsplash, Pexels or Wikimedia Commons, and check each photo's licence.

---

## Step 5: Get found on Google

1. Open <https://search.google.com/search-console> and add your domain.
2. Submit `https://YOUR-DOMAIN/sitemap.xml`.
3. Create a free **Google Business Profile** for pakelectroo with the same phone number. This matters most for local searches such as "electrician near me".

---

## Optional: Cloudflare Web Analytics

You can switch on free, privacy-friendly visitor stats from the Pages project settings. The security policy in `_headers` blocks outside scripts, so after enabling analytics, open `_headers` and change:

- `script-src 'self'` to `script-src 'self' https://static.cloudflareinsights.com`
- add `connect-src https://cloudflareinsights.com;` to the same Content-Security-Policy line

Then redeploy.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Site shows a blank page or 404 | `index.html` must be at the top level of the upload, not inside a subfolder |
| No styling | Check `styles.css` is in the same folder as `index.html`, then hard refresh (Ctrl+Shift+R) |
| Changes not showing | Deploy a new version, then hard refresh; your browser may be showing a cached copy |
| Error 522 on your domain | The CNAME was added before the domain was added in Pages. Remove it and add the domain from **Custom domains** |
| HTTPS certificate pending | Wait a few minutes. If it stays stuck, check your DNS has no CAA records blocking Cloudflare's certificate authorities |
| WhatsApp button does nothing | Check the number in `index.html` and `script.js` has no spaces or plus sign |
| Fonts look different | Fonts load from Google Fonts; the site falls back to system fonts if the load is blocked |

---

## Sources

- [Cloudflare Pages: custom domains](https://developers.cloudflare.com/pages/platform/custom-domains/)
