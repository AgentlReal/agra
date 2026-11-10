import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { AllowedImageExtension } from "@/shared/utils/image-validator";

const MIME_TYPE: Record<AllowedImageExtension, string> = {
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
};

/**
 * Singleton R2 client menggunakan S3-compatible API Cloudflare.
 * Kredensial dibaca dari environment variables — jangan pernah hardcode.
 */
function createR2Client(): S3Client {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
        throw new Error(
            "Konfigurasi R2 tidak lengkap. Pastikan R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, dan R2_SECRET_ACCESS_KEY sudah diset di environment variables."
        );
    }

    return new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
    });
}

/**
 * Upload buffer gambar ke Cloudflare R2 dan kembalikan public URL-nya.
 *
 * @param buffer    - Raw buffer isi berkas gambar
 * @param filename  - Nama berkas unik (tanpa prefix folder)
 * @param ext       - Ekstensi berkas yang sudah tervalidasi via magic bytes
 * @returns         - URL publik gambar di R2 (mis. https://pub-xxx.r2.dev/question-images/img-xxx.png)
 */
export async function uploadToR2(
    buffer: Buffer,
    filename: string,
    ext: AllowedImageExtension
): Promise<string> {
    const bucket = process.env.R2_BUCKET_NAME;
    const publicUrl = process.env.R2_PUBLIC_URL;

    if (!bucket || !publicUrl) {
        throw new Error(
            "Konfigurasi R2 tidak lengkap. Pastikan R2_BUCKET_NAME dan R2_PUBLIC_URL sudah diset di environment variables."
        );
    }

    const r2 = createR2Client();
    const key = `question-images/${filename}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: buffer,
            ContentType: MIME_TYPE[ext],
            CacheControl: "public, max-age=31536000, immutable",
        })
    );

    // Hilangkan trailing slash dari publicUrl jika ada
    return `${publicUrl.replace(/\/$/, "")}/${key}`;
}

/**
 * Ekstrak R2 object key dari public URL.
 * Contoh: "https://pub-xxx.r2.dev/question-images/img-123.png" → "question-images/img-123.png"
 * Mengembalikan null jika URL bukan milik R2 (mis. path lokal /assets/...).
 */
export function extractR2Key(url: string): string | null {
    const publicUrl = process.env.R2_PUBLIC_URL;
    if (!publicUrl) return null;

    const base = publicUrl.replace(/\/$/, "");
    if (!url.startsWith(base + "/")) return null;

    return url.slice(base.length + 1); // hapus "https://...r2.dev/"
}

/**
 * Hapus object dari Cloudflare R2 berdasarkan public URL-nya.
 * Jika URL bukan milik R2 (mis. path lokal /assets/...), operasi di-skip secara diam-diam.
 *
 * @param url - Public URL gambar yang ingin dihapus
 */
export async function deleteFromR2(url: string): Promise<void> {
    const key = extractR2Key(url);
    if (!key) return; // bukan URL R2, skip

    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) throw new Error("R2_BUCKET_NAME tidak diset di environment variables.");

    const r2 = createR2Client();
    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

