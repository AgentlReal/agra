import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const MIME_MAP: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
};

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ filename: string[] }> }
) {
    const { filename } = await params;
    const filePath = path.join(process.cwd(), "public", "uploads", ...filename);

    if (!fs.existsSync(filePath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    const ext = path.extname(filePath).slice(1).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
