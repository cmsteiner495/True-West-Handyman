# Admin Setup (Decap CMS / Netlify Identity)

Follow these steps to enable the owner-facing admin panel:

1. In the Netlify dashboard for this site, enable **Identity**.
2. Enable **Git Gateway** under Identity settings.
3. Set Identity registration to **Invite only**.
4. Invite Dustin's email address as a user.
5. (Optional) Enable any preferred external Identity providers.
6. Access the admin panel at `https://<site-domain>/admin`.

> Note: Decap CMS login requires Netlify Identity and Git Gateway. For local development, authentication only works when running with **Netlify Dev**; the public projects gallery still works locally without Identity.
