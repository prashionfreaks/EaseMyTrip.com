import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeadersFor, escapeHtml, requireUser } from '../_shared/cors.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_EMAIL = 'LetsWander <noreply@letswander.space>';

const ALLOWED_LINK_HOSTS = new Set([
  'letswander.space',
  'www.letswander.space',
  'localhost',
]);

// RFC5322-lite — permissive enough for real addresses, strict enough to block
// header injection attempts like "foo\r\nBcc: attacker@x".
const EMAIL_RE = /^[^\s<>"'\\,;()]+@[^\s<>"'\\,;()@]+\.[^\s<>"'\\,;()@]+$/;

serve(async (req) => {
  const cors = corsHeadersFor(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  if (!RESEND_API_KEY) {
    return json({ error: 'Email not configured' }, 503, cors);
  }

  const user = await requireUser(req);
  if (!user) return json({ error: 'Unauthorized' }, 401, cors);

  let email = '';
  let tripName = '';
  let inviterName = '';
  let inviteLink = '';
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim().slice(0, 254);
    tripName = String(body?.tripName ?? '').trim().slice(0, 120);
    inviterName = String(body?.inviterName ?? '').trim().slice(0, 80);
    inviteLink = String(body?.inviteLink ?? '').trim().slice(0, 500);
  } catch {
    return json({ error: 'Invalid JSON' }, 400, cors);
  }

  if (!email || !tripName || !inviterName || !inviteLink) {
    return json({ error: 'Missing required fields' }, 400, cors);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email address' }, 400, cors);
  }
  if (!isAllowedLink(inviteLink)) {
    return json({ error: 'Invite link must point to letswander.space' }, 400, cors);
  }

  const safeTripName = escapeHtml(tripName);
  const safeInviterName = escapeHtml(inviterName);
  const safeInviteLink = escapeHtml(inviteLink);
  // Plain-text fields used in the Resend subject line — stripped of control chars
  // to prevent header injection.
  const subjectTripName = tripName.replace(/[\r\n\t]/g, ' ');
  const subjectInviter = inviterName.replace(/[\r\n\t]/g, ' ');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1e3a8a,#4c1d95);padding:36px 40px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:44px;height:44px;background:rgba(255,255,255,0.15);border-radius:12px;display:flex;align-items:center;justify-content:center;">
                <span style="font-size:24px;">🧭</span>
              </div>
            </div>
            <h1 style="color:white;font-size:22px;font-weight:800;margin:14px 0 0;letter-spacing:-0.3px;">LetsWander</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="font-size:22px;font-weight:800;color:#0f172a;margin:0 0 12px;letter-spacing:-0.3px;">
              You're invited! ✈️
            </h2>
            <p style="font-size:15px;color:#475569;line-height:1.7;margin:0 0 24px;">
              <strong style="color:#0f172a;">${safeInviterName}</strong> has invited you to join the trip
              <strong style="color:#2563eb;">"${safeTripName}"</strong> on LetsWander — where groups plan trips together effortlessly.
            </p>

            <!-- CTA Button -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${safeInviteLink}"
                style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#2563eb,#7c3aed);color:white;text-decoration:none;border-radius:12px;font-size:16px;font-weight:700;letter-spacing:0.1px;">
                Join the Trip →
              </a>
            </div>

            <p style="font-size:13px;color:#94a3b8;line-height:1.6;margin:0;">
              Or copy and paste this link into your browser:<br>
              <a href="${safeInviteLink}" style="color:#2563eb;word-break:break-all;">${safeInviteLink}</a>
            </p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><div style="height:1px;background:#f1f5f9;"></div></td></tr>

        <!-- Features -->
        <tr>
          <td style="padding:28px 40px;">
            <p style="font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 16px;">What you can do on LetsWander</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:0 8px 12px 0;vertical-align:top;">
                  <p style="margin:0;font-size:13px;color:#475569;">💬 <strong>Group Chat</strong> — Plan in real-time</p>
                </td>
                <td width="50%" style="padding:0 0 12px 8px;vertical-align:top;">
                  <p style="margin:0;font-size:13px;color:#475569;">🗳️ <strong>Polls</strong> — Vote on decisions</p>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
                  <p style="margin:0;font-size:13px;color:#475569;">💰 <strong>Expenses</strong> — Split costs fairly</p>
                </td>
                <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
                  <p style="margin:0;font-size:13px;color:#475569;">📸 <strong>Photos</strong> — Share memories</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:20px 40px;border-top:1px solid #f1f5f9;">
            <p style="font-size:12px;color:#94a3b8;margin:0;text-align:center;">
              This invite was sent by ${safeInviterName} via LetsWander.<br>
              If you didn't expect this, you can safely ignore this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject: `${subjectInviter} invited you to join "${subjectTripName}" on LetsWander ✈️`,
        html,
      }),
    });

    // Resend's response may leak rate-limit or account detail — return a
    // minimal body instead of forwarding verbatim.
    if (!res.ok) {
      return json({ error: 'Failed to send invite' }, 502, cors);
    }
    return json({ ok: true }, 200, cors);
  } catch (_err) {
    return json({ error: 'Failed to send invite' }, 500, cors);
  }
});

function isAllowedLink(link: string): boolean {
  try {
    const u = new URL(link);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    if (u.protocol === 'http:' && u.hostname !== 'localhost') return false;
    return ALLOWED_LINK_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
