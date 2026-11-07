import nodemailer, { type Mail } from "nodemailer";

export interface SendPasswordResetEmailParams {
    to: string;
    userName?: string;
    resetUrl: string;
    token: string;
}

export interface SendVerificationEmailParams {
    to: string;
    userName?: string;
    verificationUrl: string;
    token?: string;
}

export interface SendStaffInviteEmailParams {
    to: string;
    userName: string;
    role: "TIM_KURIKULUM" | "SUPERADMIN";
    inviterName?: string;
    loginUrl: string;
    forgotPasswordUrl?: string;
}

export function escapeHtml(raw: string): string {
    return raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function isSmtpConfigured(): boolean {
    const smtpUser = (process.env.SMTP_USER || "").trim();
    const smtpPassword = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "").trim();
    return Boolean(smtpUser && smtpPassword);
}

let cachedTransporter: Mail | null = null;
let cachedCredKey = "";

function getMailTransporter(): Mail | null {
    const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
    const smtpUser = (process.env.SMTP_USER || "").trim();
    const rawPassword = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || "").trim();
    const smtpPassword = smtpHost.toLowerCase().includes("gmail")
        ? rawPassword.replace(/\s+/g, "")
        : rawPassword;

    if (!smtpUser || !smtpPassword) {
        return null;
    }

    const credKey = `${smtpHost}:${smtpPort}:${smtpSecure}:${smtpUser}:${smtpPassword}`;
    if (!cachedTransporter || cachedCredKey !== credKey) {
        cachedTransporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
        });
        cachedCredKey = credKey;
    }

    return cachedTransporter;
}

export function generatePasswordResetEmailHtml(userName: string, resetUrl: string): string {
    const safeName = escapeHtml(userName);
    const safeUrl = escapeHtml(resetUrl);
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Atur Ulang Kata Sandi Akun AGRA</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-tag {
      display: inline-block;
      margin-top: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background-color: rgba(255, 255, 255, 0.2);
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .content {
      padding: 36px 32px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .text-p {
      font-size: 14px;
      color: #475569;
      margin-bottom: 20px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn-cta {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .info-box {
      background-color: #f1f5f9;
      border-left: 4px solid #2563eb;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 24px 0;
      font-size: 12px;
      color: #475569;
    }
    .fallback-link {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background-color: #f8fafc;
      padding: 12px;
      border-radius: 10px;
      border: 1px dashed #cbd5e1;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-name">AGRA</h1>
        <span class="brand-tag">TKA PINTAR SMP FASE D</span>
      </div>
      <div class="content">
        <h2 class="greeting">Halo, ${safeName}!</h2>
        <p class="text-p">
          Kami menerima permintaan untuk mengatur ulang kata sandi akun belajar AGRA Anda. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:
        </p>

        <div class="cta-container">
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn-cta">
            Atur Ulang Kata Sandi
          </a>
        </div>

        <div class="info-box">
          <strong>Perhatian:</strong> Tautan pemulihan ini hanya berlaku selama <strong>1 jam</strong> dan hanya dapat digunakan <strong>1 (satu) kali</strong> demi keamanan akun Anda.
        </div>

        <p class="text-p" style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
          Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke peramban (browser) Anda:
        </p>
        <div class="fallback-link">
          <a href="${safeUrl}" style="color: #2563eb; text-decoration: none;">${safeUrl}</a>
        </div>

        <p class="text-p" style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          Jika Anda tidak merasa pernah meminta pemulihan kata sandi ini, Anda dapat mengabaikan email ini dengan aman. Kata sandi akun Anda tidak akan berubah.
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0;">&copy; 2026 AGRA Platform. Ruang Belajar & Simulasi TKA Terstandar Nasional.</p>
        <p style="margin: 4px 0 0 0;">Email otomatis, mohon tidak membalas ke alamat email ini.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generatePasswordResetEmailText(userName: string, resetUrl: string): string {
    return `Halo, ${userName}!

Kami menerima permintaan untuk mengatur ulang kata sandi akun belajar AGRA Anda.
Silakan buka tautan berikut untuk membuat kata sandi baru:

${resetUrl}

Catatan Keamanan:
- Tautan pemulihan ini hanya berlaku selama 1 jam dan hanya dapat digunakan 1 kali.
- Jika Anda tidak pernah meminta pengaturan ulang kata sandi ini, abaikan email ini. Akun Anda tetap aman.

Salam,
Tim Platform AGRA`;
}

export function generateVerificationEmailHtml(userName: string, verificationUrl: string): string {
    const safeName = escapeHtml(userName);
    const safeUrl = escapeHtml(verificationUrl);
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikasi Email Akun Belajar AGRA</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-tag {
      display: inline-block;
      margin-top: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background-color: rgba(255, 255, 255, 0.2);
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .content {
      padding: 36px 32px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .text-p {
      font-size: 14px;
      color: #475569;
      margin-bottom: 20px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn-cta {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .info-box {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 24px 0;
      font-size: 12px;
      color: #475569;
    }
    .fallback-link {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background-color: #f8fafc;
      padding: 12px;
      border-radius: 10px;
      border: 1px dashed #cbd5e1;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-name">AGRA</h1>
        <span class="brand-tag">VERIFIKASI AKUN SISWA</span>
      </div>
      <div class="content">
        <h2 class="greeting">Halo, ${safeName}!</h2>
        <p class="text-p">
          Terima kasih telah mendaftar pada Ruang Belajar &amp; Simulasi TKA SMP AGRA. Silakan klik tombol di bawah ini untuk memverifikasi alamat email Anda dan mengaktifkan akun belajar:
        </p>

        <div class="cta-container">
          <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn-cta">
            Verifikasi Email &amp; Aktifkan Akun
          </a>
        </div>

        <div class="info-box">
          <strong>Langkah Berikutnya:</strong> Setelah klik tombol verifikasi, silakan kembali ke <strong>tab pendaftaran/login awal Anda</strong>—halaman tersebut akan mendeteksi status verifikasi dan masuk secara otomatis. Tautan ini berlaku selama <strong>1 jam</strong>.
        </div>

        <p class="text-p" style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
          Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke peramban (browser) Anda:
        </p>
        <div class="fallback-link">
          <a href="${safeUrl}" style="color: #2563eb; text-decoration: none;">${safeUrl}</a>
        </div>

        <p class="text-p" style="font-size: 12px; color: #94a3b8; margin-top: 24px;">
          Jika Anda tidak merasa pernah mendaftarkan akun di AGRA, silakan abaikan email ini dengan aman.
        </p>
      </div>

      <div class="footer">
        <p style="margin: 0;">&copy; 2026 AGRA Platform. Ruang Belajar &amp; Simulasi TKA Terstandar Nasional.</p>
        <p style="margin: 4px 0 0 0;">Email otomatis, mohon tidak membalas ke alamat email ini.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateVerificationEmailText(userName: string, verificationUrl: string): string {
    return `Halo, ${userName}!

Terima kasih telah mendaftar pada Ruang Belajar & Simulasi TKA SMP AGRA.
Silakan buka tautan berikut untuk memverifikasi alamat email dan mengaktifkan akun Anda:

${verificationUrl}

Catatan:
- Tautan verifikasi ini berlaku selama 1 jam.
- Setelah terverifikasi, kembali ke tab pendaftaran/login awal Anda—halaman tersebut akan masuk secara otomatis.
- Jika Anda tidak merasa pernah mendaftar di AGRA, abaikan pesan ini.

Salam,
Tim Platform AGRA`;
}

export async function sendPasswordResetEmail(params: SendPasswordResetEmailParams): Promise<boolean> {
    const { to, userName = "Siswa AGRA", resetUrl } = params;
    const transporter = getMailTransporter();
    const emailFrom =
        process.env.EMAIL_FROM ||
        (process.env.SMTP_USER ? `AGRA Platform <${process.env.SMTP_USER}>` : "AGRA Platform <no-reply@agra.sch.id>");

    if (!transporter) {
        console.warn(
            `\n================================================================================\n` +
            `[EMAIL NOTICE] Kredensial SMTP belum diisi di .env (SMTP_USER / SMTP_PASSWORD).\n` +
            `Email reset password TIDAK dapat dikirim ke server mail nyata.\n` +
            `\nTarget Penerima : ${to}\n` +
            `URL Reset Sandi : ${resetUrl}\n` +
            `================================================================================\n`
        );
        return false;
    }

    try {
        const html = generatePasswordResetEmailHtml(userName, resetUrl);
        const text = generatePasswordResetEmailText(userName, resetUrl);

        const info = await transporter.sendMail({
            from: emailFrom,
            to,
            subject: "Atur Ulang Kata Sandi Akun AGRA",
            text,
            html,
        });

        console.log(`[EMAIL] Berhasil mengirim email pemulihan kata sandi ke ${to} (MessageId: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`[EMAIL ERROR] Gagal mengirim email reset kata sandi ke ${to}:`, error);
        console.warn(`[EMAIL FALLBACK URL] ${resetUrl}`);
        return false;
    }
}

export async function sendVerificationEmail(params: SendVerificationEmailParams): Promise<boolean> {
    const { to, userName = "Siswa AGRA", verificationUrl } = params;
    const transporter = getMailTransporter();
    const emailFrom =
        process.env.EMAIL_FROM ||
        (process.env.SMTP_USER ? `AGRA Platform <${process.env.SMTP_USER}>` : "AGRA Platform <no-reply@agra.sch.id>");

    if (!transporter) {
        console.warn(
            `\n================================================================================\n` +
            `[EMAIL NOTICE] Kredensial SMTP belum diisi di .env (SMTP_USER / SMTP_PASSWORD).\n` +
            `Email verifikasi akun TIDAK dapat dikirim ke server mail nyata.\n` +
            `\nTarget Penerima   : ${to}\n` +
            `URL Verifikasi    : ${verificationUrl}\n` +
            `================================================================================\n`
        );
        return false;
    }

    try {
        const html = generateVerificationEmailHtml(userName, verificationUrl);
        const text = generateVerificationEmailText(userName, verificationUrl);

        const info = await transporter.sendMail({
            from: emailFrom,
            to,
            subject: "Verifikasi Alamat Email Akun Belajar AGRA",
            text,
            html,
        });

        console.log(`[EMAIL] Berhasil mengirim email verifikasi akun ke ${to} (MessageId: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`[EMAIL ERROR] Gagal mengirim email verifikasi ke ${to}:`, error);
        console.warn(`[EMAIL FALLBACK URL] ${verificationUrl}`);
        return false;
    }
}

export function generateStaffInviteEmailHtml(params: SendStaffInviteEmailParams): string {
    const safeName = escapeHtml(params.userName || "Rekan Tim AGRA");
    const safeEmail = escapeHtml(params.to);
    const safeInviter = escapeHtml(params.inviterName || "SuperAdmin Platform AGRA");
    const safeLoginUrl = escapeHtml(params.loginUrl);
    const safeForgotUrl = escapeHtml(params.forgotPasswordUrl || params.loginUrl.replace(/\?.*$/, "").replace(/\/login$/, "/forgot-password"));
    const roleLabel =
        params.role === "SUPERADMIN"
            ? "SuperAdmin (Pengelola Utama Platform)"
            : "Tim Kurikulum (Penulis & Kurator Bank Soal TKA)";

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Undangan Akses Tim Platform AGRA</title>
  <style>
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 560px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #581c87 0%, #7e22ce 50%, #9333ea 100%);
      padding: 32px 30px;
      text-align: center;
      color: #ffffff;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #ffffff;
    }
    .brand-tag {
      display: inline-block;
      margin-top: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background-color: rgba(255, 255, 255, 0.2);
      padding: 4px 10px;
      border-radius: 9999px;
    }
    .content {
      padding: 36px 32px 32px;
      line-height: 1.6;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .text-p {
      font-size: 14px;
      color: #475569;
      margin-bottom: 20px;
    }
    .role-badge {
      display: inline-block;
      background-color: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #d8b4fe;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 10px;
      margin: 4px 0 16px;
    }
    .cta-container {
      text-align: center;
      margin: 30px 0;
    }
    .btn-cta {
      display: inline-block;
      background-color: #7e22ce;
      color: #ffffff !important;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(126, 34, 206, 0.25);
    }
    .info-box {
      background-color: #faf5ff;
      border-left: 4px solid #7e22ce;
      border-radius: 8px;
      padding: 14px 16px;
      margin: 24px 0;
      font-size: 12px;
      color: #475569;
    }
    .fallback-link {
      font-size: 12px;
      color: #64748b;
      word-break: break-all;
      background-color: #f8fafc;
      padding: 12px;
      border-radius: 10px;
      border: 1px dashed #cbd5e1;
      margin-top: 10px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #f1f5f9;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="brand-name">AGRA</h1>
        <span class="brand-tag">UNDANGAN PORTAL TIM &amp; ADMIN</span>
      </div>
      <div class="content">
        <h2 class="greeting">Halo, ${safeName}!</h2>
        <p class="text-p">
          Anda telah diundang oleh <strong>${safeInviter}</strong> untuk bergabung mengelola Ruang Belajar &amp; Simulasi TKA SMP AGRA dengan otoritas peran:
        </p>
        <div>
          <span class="role-badge">${escapeHtml(roleLabel)}</span>
        </div>
        <p class="text-p">
          Alamat email <strong>${safeEmail}</strong> kini telah terdaftar dan terverifikasi. Silakan klik tombol di bawah ini lalu pilih <strong>Masuk dengan Akun Google</strong> menggunakan alamat email ini:
        </p>

        <div class="cta-container">
          <a href="${safeLoginUrl}" target="_blank" rel="noopener noreferrer" class="btn-cta">
            Buka Portal Login Tim &amp; Masuk dengan Google
          </a>
        </div>

        <div class="info-box">
          <strong>Informasi Akses:</strong><br>
          &bull; <strong>Tanpa Batas Waktu:</strong> Undangan akses ini aktif tanpa batas kedaluwarsa selama akun Anda terdaftar.<br>
          &bull; <strong>Ingin masuk dengan kata sandi lokal?</strong> Anda juga dapat membuat kata sandi lokal kapan saja melalui halaman <a href="${safeForgotUrl}" style="color: #7e22ce; font-weight: 700;">Atur Kata Sandi</a>.
        </div>

        <p class="text-p" style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
          Jika tombol di atas tidak dapat diklik, salin dan tempel tautan berikut ke peramban (browser) Anda:
        </p>
        <div class="fallback-link">
          <a href="${safeLoginUrl}" style="color: #7e22ce; text-decoration: none;">${safeLoginUrl}</a>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0;">&copy; 2026 AGRA Platform. Ruang Belajar &amp; Simulasi TKA Terstandar Nasional.</p>
        <p style="margin: 4px 0 0 0;">Email otomatis, mohon tidak membalas ke alamat email ini.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function generateStaffInviteEmailText(params: SendStaffInviteEmailParams): string {
    const roleLabel =
        params.role === "SUPERADMIN"
            ? "SuperAdmin (Pengelola Utama Platform)"
            : "Tim Kurikulum (Penulis & Kurator Bank Soal TKA)";
    const forgotUrl =
        params.forgotPasswordUrl ||
        params.loginUrl.replace(/\?.*$/, "").replace(/\/login$/, "/forgot-password");

    return `Halo, ${params.userName || "Rekan Tim AGRA"}!

Anda telah diundang oleh ${params.inviterName || "SuperAdmin Platform AGRA"} untuk bergabung di Platform AGRA sebagai:
${roleLabel}

Alamat email ${params.to} telah terdaftar dan siap digunakan.
Silakan buka tautan Portal Login Tim berikut dan masuk menggunakan tombol "Masuk dengan Akun Google":

${params.loginUrl}

Catatan:
- Undangan ini aktif tanpa batas waktu.
- Jika Anda ingin mengatur kata sandi lokal, gunakan halaman: ${forgotUrl}

Salam,
Tim Platform AGRA`;
}

export async function sendStaffInviteEmail(params: SendStaffInviteEmailParams): Promise<boolean> {
    const { to, role, loginUrl } = params;
    const transporter = getMailTransporter();
    const emailFrom =
        process.env.EMAIL_FROM ||
        (process.env.SMTP_USER ? `AGRA Platform <${process.env.SMTP_USER}>` : "AGRA Platform <no-reply@agra.sch.id>");

    if (!transporter) {
        console.warn(
            `\n================================================================================\n` +
            `[EMAIL NOTICE] Kredensial SMTP belum diisi di .env (SMTP_USER / SMTP_PASSWORD).\n` +
            `Email undangan ${role} TIDAK dapat dikirim ke server mail nyata.\n` +
            `\nTarget Penerima : ${to}\n` +
            `Peran Diundang  : ${role}\n` +
            `URL Login Staf  : ${loginUrl}\n` +
            `================================================================================\n`
        );
        return false;
    }

    try {
        const html = generateStaffInviteEmailHtml(params);
        const text = generateStaffInviteEmailText(params);
        const roleSubject = role === "SUPERADMIN" ? "SuperAdmin" : "Tim Kurikulum";

        const info = await transporter.sendMail({
            from: emailFrom,
            to,
            subject: `Undangan Akses ${roleSubject} - Platform AGRA TKA SMP`,
            text,
            html,
        });

        console.log(`[EMAIL] Berhasil mengirim email undangan ${role} ke ${to} (MessageId: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`[EMAIL ERROR] Gagal mengirim email undangan ${role} ke ${to}:`, error);
        console.warn(`[EMAIL FALLBACK URL] ${loginUrl}`);
        return false;
    }
}
