// Supabase Edge Function: send-download-link
//
// Emails the Broken Key Remapper download link after a successful crypto
// payment. Invoked from the client via supabase.functions.invoke after the
// onchain transfer is verified. Uses Resend (https://resend.com) for delivery.
//
// Required env (set via `supabase secrets set` or the Vercel/Supabase
// dashboard):
//   RESEND_API_KEY     — your Resend API key (re_xxx).
//   FROM_EMAIL         — sender address, e.g. "Broken Key Remapper
//                        <noreply@brokenkeyremapper.xyz>". Domain must be
//                        verified in Resend.
//   DOWNLOAD_URL       — the Google Drive (or other) link to email out.
//                        Mirrors src/lib/downloads.ts so it's easy to rotate.
//
// CORS is open to any origin since the same code runs on a custom domain
// (brokenkeyremapper.xyz) and on Vercel preview URLs.

// deno-lint-ignore-file no-explicit-any
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json",
      ...CORS_HEADERS,
      ...(init.headers ?? {}),
    },
  });
}

const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, { status: 405 });
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = String(payload?.email ?? "").trim();
  const txHash = String(payload?.txHash ?? "").trim();
  const network = String(payload?.network ?? "tempo-mainnet").trim();
  const explorerUrl =
    typeof payload?.explorerUrl === "string" ? payload.explorerUrl : null;

  if (!EMAIL_RE.test(email)) {
    return json({ error: "Invalid email." }, { status: 400 });
  }
  if (!TX_HASH_RE.test(txHash)) {
    return json({ error: "Invalid tx hash." }, { status: 400 });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const FROM_EMAIL = Deno.env.get("FROM_EMAIL");
  const DOWNLOAD_URL = Deno.env.get("DOWNLOAD_URL");

  if (!RESEND_API_KEY || !FROM_EMAIL || !DOWNLOAD_URL) {
    return json(
      {
        error:
          "Email delivery not configured. Set RESEND_API_KEY, FROM_EMAIL, DOWNLOAD_URL.",
      },
      { status: 500 },
    );
  }

  const subject = "Your Broken Key Remapper download link";
  const explorerLine = explorerUrl
    ? `<p style="margin:0 0 12px;color:#475569;">View payment on the explorer: <a href="${explorerUrl}">${explorerUrl}</a></p>`
    : "";
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a;">
      <h1 style="margin:0 0 12px;font-size:22px;">Thanks for your payment</h1>
      <p style="margin:0 0 16px;color:#334155;">
        Your payment on <strong>${network}</strong> has been confirmed.
        Use the link below to download Broken Key Remapper v1.1.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${DOWNLOAD_URL}"
           style="display:inline-block;padding:12px 20px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Download Broken Key Remapper
        </a>
      </p>
      <p style="margin:0 0 12px;color:#475569;">
        Or copy this link into your browser:<br />
        <a href="${DOWNLOAD_URL}">${DOWNLOAD_URL}</a>
      </p>
      ${explorerLine}
      <p style="margin:24px 0 0;color:#64748b;font-size:12px;">
        Transaction hash: <code>${txHash}</code><br />
        Save this hash &mdash; you can paste it into the &ldquo;Already paid?&rdquo; box on
        brokenkeyremapper.xyz to re-download anytime.
      </p>
    </div>
  `;
  const text = [
    "Thanks for your payment.",
    `Your payment on ${network} has been confirmed.`,
    "",
    "Download Broken Key Remapper v1.1:",
    DOWNLOAD_URL,
    "",
    explorerUrl ? `Payment explorer: ${explorerUrl}` : "",
    `Transaction hash: ${txHash}`,
  ]
    .filter(Boolean)
    .join("\n");

  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject,
      html,
      text,
    }),
  });

  if (!resendRes.ok) {
    const errBody = await resendRes.text().catch(() => "");
    return json(
      { error: "Resend delivery failed.", detail: errBody.slice(0, 500) },
      { status: 502 },
    );
  }

  return json({ ok: true });
});
