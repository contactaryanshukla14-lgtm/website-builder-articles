# Publishing Access Checklist

Use this checklist to provide access for automated publishing and the final Google Sheet.

## Best API-first platforms

### 1. DEV Community

What I need:

- `DEVTO_API_KEY`

Where to get it:

- Log in to DEV.
- Open account settings.
- Go to Extensions / DEV API Keys.
- Create a key for this automation.

Why:

- DEV / Forem supports article creation through its API using an `api-key` header.

### 2. WordPress

Choose one path.

For WordPress.com:

- `WORDPRESS_COM_ACCESS_TOKEN`
- `WORDPRESS_COM_SITE_ID`

For self-hosted WordPress:

- `WORDPRESS_SITE_URL`
- `WORDPRESS_USERNAME`
- `WORDPRESS_APPLICATION_PASSWORD`

Where to get it:

- WordPress.com: create an app/API token or connected application token.
- Self-hosted WordPress: user profile -> Application Passwords.

Why:

- WordPress supports creating posts through REST endpoints when authenticated.

### 3. Blogger

What I need:

- `BLOGGER_BLOG_ID`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `GOOGLE_OAUTH_REFRESH_TOKEN`

Where to get it:

- Google Cloud project with Blogger API enabled.
- OAuth client for Desktop App.
- A refresh token generated after authorizing the Blogger account.

Why:

- Blogger publishing requires OAuth 2.0.

### 4. Google Sheets final tracker

Preferred option:

- `GOOGLE_SERVICE_ACCOUNT_JSON_PATH`
- `GOOGLE_SHEET_SHARE_WITH_EMAIL`
- Set `GOOGLE_SHEET_SHARE_PUBLIC=true` only if you want anyone with the link to view.

Where to get it:

- Google Cloud project.
- Enable Google Sheets API and Google Drive API.
- Create a service account and JSON key.

Why:

- This lets the automation create/update the final Google Sheet and share the link.

## Platforms with restrictions

### Medium

What I need:

- Existing `MEDIUM_INTEGRATION_TOKEN`, if your account already has one.

Important:

- Medium currently says it is not issuing new integration tokens or allowing new integrations. If you do not already have an integration token, publishing needs interactive login/browser workflow.

### Hashnode

What I need:

- `HASHNODE_TOKEN`
- `HASHNODE_PUBLICATION_ID`

Important:

- Hashnode API availability may depend on account/plan/API access.

### LinkedIn, Substack, Quora, Vocal, HubPages, editorial sites

What I need:

- Logged-in account access through the in-app browser.
- Any 2FA/CAPTCHA/manual approval steps completed by you when prompted.

Important:

- These are not safe to promise as fully unattended API publishing. Some reject promotional backlink-heavy articles or require editorial review.

## Security notes

- Do not send main passwords if an app password/API token is available.
- Use a dedicated email/account for this campaign if possible.
- Keep tokens in a local `.env` file copied from `.env.example`.
- Revoke tokens after the campaign if they are no longer needed.
