# For Amal, with love ♥ — Netlify starter

A responsive romantic microsite for Amal, with a custom passcode screen, protected love page, letter, memory cards, mini quiz, random love notes, and a music toggle placeholder.

## Important privacy note

The login is checked server-side by a Netlify Function; the password is not embedded in browser JavaScript. An Edge Function checks a signed, HttpOnly session cookie before serving `/love.html` or the protected memories endpoint. Protected memory data is read from `LOVE_MEMORIES_JSON` only after authorization. Keep private images out of the public site folder.

The requested date (`2026-05-14`) is guessable. For real privacy, use a longer secret instead, or use Netlify's built-in whole-site password protection if your plan supports it. The login page, CSS, and JavaScript assets are public by design; the actual love page is served only when the server-side session is valid. Any files placed in the public site folder (such as photos) can still be downloaded if their paths are known, so do not put private photos there.

## Deploy from an iPhone or computer

1. Download and unzip `amal-love-site.zip`.
2. Create/log in to a Netlify account at https://app.netlify.com/.
3. Because this project uses Netlify Functions and an Edge Function, connect a Git repository (recommended) or deploy with Netlify CLI from a computer; simple drag-and-drop may not deploy the server-side pieces.
4. Recommended reliable flow: create a GitHub repository, upload these project files, then in Netlify choose **Add new project → Import an existing project**, select the repository, and deploy. No build command is needed; publish directory is `.`.
5. In Netlify: **Project configuration → Environment variables**, add:
   - `LOVE_PASSWORD` = `2026-05-14` (the requested date; consider choosing a stronger secret)
   - `LOVE_SESSION_SECRET` = a long random secret, ideally 32+ random bytes. Generate one with a password manager or a cryptographically secure generator. Never put it in the HTML/JS files.
   - `LOVE_MEMORIES_JSON` = optional JSON array, example below.
6. Redeploy after setting variables so the functions use the latest configuration.
7. Open the deployed URL on a phone and test the password and the Lock button.

### Example `LOVE_MEMORIES_JSON`

Set this environment variable to one line of valid JSON. Replace examples with your own details. Use publicly reachable HTTPS image URLs only if you are comfortable with that image host's privacy settings.

[
  {"date":"May 14, 2026","title":"Our first date","story":"Add what happened on our first date here.","image":""},
  {"date":"June 2026","title":"A favourite memory","story":"Write your own story here.","image":"https://example.com/your-photo.jpg"}
]

## Music

The site doesn't bundle copyrighted music. Add a music file you have permission to use as `music.mp3` in the published root, then in `app.js`, replace `audio.src` setup by adding this line near the top:

`audio.src = "/music.mp3";`

Browsers generally require a user tap before playing audio.

## Add photos

The hero photo is currently a placeholder. To use a photo in the hero, replace the `.photo-placeholder` element in `index.html` with an `<img>` tag and set its `src` to your photo path. Note: files in the public folder are public. Do not put private photos there if public access would be a problem. To keep photo files private, store them behind an authenticated endpoint or private object storage and serve them only after authorization.

## Netlify whole-site protection

Netlify's built-in shared password protection may require a paid plan depending on the account's plan type. On credit-based Free/Personal plans, shared password protection isn't available; project privacy restricts access to the owner/team rather than giving Amal a shared passcode. See official docs:
- https://docs.netlify.com/manage/security/secure-access-to-sites/password-protection/
- https://docs.netlify.com/build/functions/environment-variables/

## Project files

- `index.html` — pages and content
- `style.css` — responsive romantic styling
- `app.js` — login UI and interactive games
- `netlify/functions/auth.mjs` — server-side password verification and session creation
- `netlify/functions/memories.mjs` — protected memory API
- `netlify.toml` — security headers


## Files and access control

- `index.html` is the public passcode page.
- `love.html` is gated by `netlify/edge-functions/gate.js`.
- `netlify/functions/auth.mjs` verifies the passcode and issues a signed HttpOnly cookie.
- `netlify/functions/memories.mjs` serves the private memory JSON only to a valid session.
- `LOVE_PASSWORD` is the passcode; `LOVE_SESSION_SECRET` signs session cookies.
