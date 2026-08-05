# Undangan Pernikahan Digital — Gonjol & Liyot

A self-contained, mobile-first wedding invitation site with a live RSVP
wall backed by Google Sheets. No build step, no framework — plain
HTML/CSS/JS, so it's easy to host and easy to edit later.

```
index.html              ← the whole page
css/style.css           ← all styling (the "Kingdom" theme)
js/config.js            ← ★ EDIT THIS to change any wedding detail
js/script.js            ← behaviour (countdown, RSVP, wishes, music) — rarely needs edits
assets/                 ← optimized photos + background music
apps-script/Code.gs     ← Google Apps Script backend (RSVP → Sheets)
```

---

## 1. What I could and couldn't do myself

I don't have the ability to log into your Google account or your GitHub
account from this environment — there's no browser, no OAuth flow, and
no network access available to me here. So:

- ✅ **Done for you**: every line of frontend code, all the design, all
  image/audio optimization, and the complete Apps Script backend.
- ⚠️ **You need to do** (5–10 minutes, one-time): create the Google
  Sheet, paste in the script, deploy it, and push these files to
  GitHub. Exact steps below — no coding involved, just clicking.

---

## 2. Set up the Google Sheets RSVP database

1. Go to [sheets.google.com](https://sheets.google.com) and create a
   new blank spreadsheet. Name it whatever you like, e.g. "Wedding
   RSVP — Gonjol & Liyot".
2. Open **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in the entire
   contents of `apps-script/Code.gs` from this project.
4. Click **Save** (the disk icon), then **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Fill in:
   - Description: `Wedding RSVP`
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**. The first time, Google will ask you to authorize
   the script — click through the "Advanced" / "Go to (unsafe)"
   prompts (this warning appears because it's your own unpublished
   script, not because anything is wrong).
8. Copy the **Web app URL** it gives you (ends in `/exec`).
9. Open `js/config.js` in this project and paste that URL into:
   ```js
   scriptURL: "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
   ```
10. The sheet will auto-create an "RSVP" tab with headers the first
    time someone submits the form (or you can trigger it once by
    visiting `YOUR_URL?action=wishes` in a browser).

**Sheet structure** (auto-created, do not reorder the columns):

| Timestamp | Name | Attendance | Guests | Message |
|---|---|---|---|---|
| 2027-05-01 10:22:00 | Ade Fitriyani | Attending | 2 | Selamat menempuh hidup baru! |

You can filter/sort/export this tab exactly like any Google Sheet —
File → Download → CSV/Excel any time you want a copy.

> **If you ever edit Code.gs again**, you must create a **new
> deployment version** (Deploy → Manage deployments → edit → New
> version) for the changes to take effect — saving alone isn't enough.

---

## 3. Deploy to GitHub Pages

1. Create a new repository on GitHub (public or private — Pages works
   for both, private repos need GitHub Pro/Team/Enterprise for Pages).
2. Upload/push everything in this folder (`index.html`, `css/`, `js/`,
   `assets/`, `.nojekyll`) to the repo root — keep the folder structure
   exactly as-is.
   ```bash
   git init
   git add .
   git commit -m "Wedding invitation site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   branch **main**, folder **/ (root)**. Save.
5. Wait 1–2 minutes, then your site is live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

To personalize a link per guest (shows their name on the cover and
pre-fills the RSVP name field), share:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/?to=Ade%20Fitriyani
```

---

## 4. Editing wedding details later

Open **`js/config.js`** — every editable value lives there with
comments: couple's names/parents, date & time, venue + Maps link,
bank/gift info, and the Apps Script URL. Nothing else in the project
needs to change for normal edits.

To swap photos or the music track, replace the files in `assets/`
with the same filenames (`groom.jpg`, `bride.jpg`, `couple.jpg`,
`music.mp3`), or add new files and update the paths in `config.js`.

---

## 5. Requirements checklist

| Requirement | Status |
|---|---|
| RSVP form (name, attendance, guest count, message) | ✅ |
| RSVP syncs to Google Sheets in real time, new row per submission | ✅ (via Apps Script) |
| Wishes appear below RSVP, auto-refreshing | ✅ (polls every 15s, configurable) |
| Countdown — days / hours / minutes / seconds | ✅ |
| Clickable venue address → Google Maps | ✅ |
| Clickable date/time → Google Calendar with title/date/venue/description | ✅ |
| Editable placeholders for names, parents, venue, date | ✅ (`js/config.js`) |
| Gift section: "Wanna give us some gifts?", account number, delivery address | ✅ |
| Mobile-first, responsive, smooth scroll | ✅ |
| Opening cover / couple / countdown / event / maps / RSVP / wishes / gift / closing sections | ✅ |
| Subtle animations, floating music button, fade-in reveals | ✅ |
| Optimized pre-wedding photos & background music | ✅ (images ~70–180KB, audio compressed to 128kbps mp3) |
| GitHub Pages deployment setup | ✅ (`.nojekyll` included; steps above) |
| Google Sheets + Apps Script integration | ✅ (`apps-script/Code.gs`) |

---

## 6. Notes on the CORS approach used

Google Apps Script web apps don't reliably send
`Access-Control-Allow-Origin` headers for preflighted requests, so:
- RSVP submissions are sent as `POST` with `Content-Type:
  text/plain;charset=utf-8` (not `application/json`) — this avoids
  triggering a CORS preflight, which Apps Script can't answer.
- The wishes wall uses a plain `GET` request, which also avoids
  preflight.

If you ever see RSVP submissions failing in the browser console with
a CORS error, double check the deployment's "Who has access" is set
to **Anyone**, not "Anyone with a Google account".
