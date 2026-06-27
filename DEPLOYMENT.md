# Auto-deploy: GitHub → Namecheap (cPanel shared hosting)

Every push to the `main` branch automatically uploads the site to your Namecheap
hosting via FTP, using the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## One-time setup

### 1. Create a dedicated FTP account in cPanel
1. Log into cPanel → **Files → FTP Accounts**.
2. Create a new account, e.g. **Login:** `deploy` (it becomes `deploy@yourdomain.com`).
3. Set **Directory** to `public_html` (so the account is scoped to your live site root).
   - If the site is an **addon/secondary domain**, set it to that domain's folder
     instead, e.g. `public_html/compassclaw.com`.
4. Save the username and password.

### 2. Find your FTP server hostname
In **FTP Accounts → Configure FTP Client** (next to the account), note the
**FTP Server** value. It's usually your server hostname (e.g. `serverNNN.web-hosting.com`)
or `ftp.yourdomain.com`.

### 3. Add the credentials as GitHub secrets
In the GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**,
add these three:

| Secret name    | Value                                            |
|----------------|--------------------------------------------------|
| `FTP_SERVER`   | the FTP server hostname from step 2              |
| `FTP_USERNAME` | the full FTP username, e.g. `deploy@yourdomain.com` |
| `FTP_PASSWORD` | the FTP account password                         |

### 4. Deploy
Push any change to `main` (or open **Actions → Deploy to Namecheap → Run workflow**).
The site uploads in seconds and only changed files are transferred on later runs.

## Notes
- The workflow uses secure **FTPS**. If your host rejects it, change `protocol: ftps`
  to `protocol: ftp` in the workflow file.
- The FTP account root must be your document root (`public_html`), because the
  workflow uploads to `./` on the server. If you used a different folder, change
  `server-dir` in the workflow accordingly.
- Repo/tooling files (`.github/`, `.claude/`, `README.md`, etc.) are excluded from upload.
