import { describe, it, expect, afterEach } from "vitest";
import {
    escapeHtml,
    isSmtpConfigured,
    generateVerificationEmailHtml,
    generatePasswordResetEmailHtml,
} from "./email";

describe("email utility", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    it("escapes HTML special characters in email templates", () => {
        expect(escapeHtml('<script>alert("xss")</script>')).toBe(
            "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
        );

        const verifyHtml = generateVerificationEmailHtml(
            "<b>Siswa</b>",
            "https://agra.sch.id/api/auth/verify-email?token=abc&callbackURL=%2Fverify-email-success"
        );
        expect(verifyHtml).toContain("&lt;b&gt;Siswa&lt;/b&gt;");
        expect(verifyHtml).toContain("token=abc&amp;callbackURL=%2Fverify-email-success");

        const resetHtml = generatePasswordResetEmailHtml(
            "Siswa",
            "https://agra.sch.id/api/auth/reset-password/xyz?callbackURL=%2Freset-password"
        );
        expect(resetHtml).toContain("reset-password/xyz?callbackURL=%2Freset-password");
    });

    it("detects SMTP configuration status accurately", () => {
        delete process.env.SMTP_USER;
        delete process.env.SMTP_PASSWORD;
        delete process.env.SMTP_PASS;
        expect(isSmtpConfigured()).toBe(false);

        process.env.SMTP_USER = "agra@gmail.com";
        process.env.SMTP_PASSWORD = "abcd efgh ijkl mnop";
        expect(isSmtpConfigured()).toBe(true);
    });
});

