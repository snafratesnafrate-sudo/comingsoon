const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Sanitise — strip any HTML
    const safeEmail = String(email).replace(/<[^>]*>/g, '').trim().slice(0, 254);

    // SMTP transporter using env vars
    const transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   parseInt(process.env.SMTP_PORT || '465'),
        secure: true,           // port 465 = SSL
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        // ── 1. Internal alert to support@snafrate.com ──
        await transporter.sendMail({
            from:    `"SnaFrate" <${process.env.SMTP_USER}>`,
            to:      process.env.SMTP_USER,
            subject: '🔔 New Early Access Signup — SnaFrate',
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px">
                    <h2 style="color:#1E56B0;margin-bottom:8px">New Early Access Signup</h2>
                    <p style="color:#64748b;margin-bottom:24px">Someone just signed up on the coming soon page.</p>
                    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:24px">
                        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:4px">Email</p>
                        <p style="font-size:18px;font-weight:600;color:#0f172a">${safeEmail}</p>
                    </div>
                    <p style="color:#94a3b8;font-size:12px">SnaFrate Coming Soon · ${new Date().toUTCString()}</p>
                </div>
            `,
        });

        // ── 2. Confirmation email to the user ──
        await transporter.sendMail({
            from:    `"SnaFrate" <${process.env.SMTP_USER}>`,
            to:      safeEmail,
            subject: "You're on the list — SnaFrate is launching soon 🚀",
            html: `
                <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#080d1a;color:#fff;padding:48px 40px;border-radius:20px">

                    <!-- Logo -->
                    <h1 style="font-size:28px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;
                                background:linear-gradient(90deg,#1E56B0,#60a5fa);
                                -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                                margin-bottom:6px">
                        SnaFrate
                    </h1>
                    <p style="color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:40px">
                        Ghana's Wholesale Marketplace
                    </p>

                    <!-- Body -->
                    <h2 style="font-size:24px;font-weight:700;margin-bottom:16px">
                        You're on the list 🎉
                    </h2>
                    <p style="color:rgba(255,255,255,0.55);line-height:1.75;font-size:15px;margin-bottom:32px">
                        Thanks for signing up. We'll email you the moment SnaFrate launches —
                        Ghana's first B2B wholesale marketplace connecting retailers with verified
                        local suppliers and factory-direct prices from China.
                    </p>

                    <!-- Feature hint -->
                    <div style="background:rgba(30,86,176,0.12);border:1px solid rgba(30,86,176,0.3);
                                border-radius:12px;padding:24px;margin-bottom:40px">
                        <p style="color:#93c5fd;font-size:13px;line-height:1.7;margin:0">
                            <strong style="color:#60a5fa">What's coming:</strong><br/>
                            📦 Bulk wholesale pricing &nbsp;·&nbsp; 🛡️ Escrow-protected payments<br/>
                            🇬🇭 Local Ghana stock &nbsp;·&nbsp; 🚢 China direct imports<br/>
                            💰 Save up to 40% vs retail
                        </p>
                    </div>

                    <!-- Footer -->
                    <p style="color:rgba(255,255,255,0.2);font-size:12px;line-height:1.6">
                        © 2026 SnaFrate Ltd. &nbsp;·&nbsp;
                        <a href="mailto:support@snafrate.com"
                           style="color:#1E56B0;text-decoration:none">support@snafrate.com</a><br/>
                        You're receiving this because you signed up at snafrate.com
                    </p>
                </div>
            `,
        });

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('SMTP error:', err.message);
        return res.status(500).json({ error: 'Failed to send email. Please try again.' });
    }
}
