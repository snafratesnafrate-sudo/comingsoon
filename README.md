# SnaFrate — Coming Soon Page

Animated coming soon page with email capture via SMTP.

## Structure

```
snafrate-coming-soon/
├── index.html              # Main page
├── vercel.json             # Vercel config
├── package.json            # nodemailer dependency
├── .env.example            # Env variable template
├── .gitignore
├── api/
│   └── notify.js           # Serverless function — handles email
└── assets/
    ├── css/
    │   └── style.css
    └── js/
        ├── canvas.js       # Particle animation
        └── notify.js       # Form submit handler
```

## Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Add environment variables in Vercel Dashboard
Go to your project → **Settings → Environment Variables** and add:

| Key        | Value                  |
|------------|------------------------|
| SMTP_HOST  | smtp.hostinger.com     |
| SMTP_PORT  | 465                    |
| SMTP_USER  | support@snafrate.com   |
| SMTP_PASS  | your_password_here     |

### 3. Deploy
```bash
cd snafrate-coming-soon
vercel --prod
```

### 4. Add your domain
In Vercel Dashboard → **Settings → Domains** → add `snafrate.com`

## How it works

- User enters email → hits `/api/notify`
- Serverless function sends two emails via Hostinger SMTP:
  1. Alert to `support@snafrate.com` with the lead
  2. Confirmation email to the user
# comingsoon
