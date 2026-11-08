import { describe, it, expect } from "vitest";
import { detectImageExtension } from "./image-validator";

describe("detectImageExtension", () => {
    it("mengenali JPEG, PNG, GIF, dan WebP dari magic bytes", () => {
        expect(detectImageExtension(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]))).toBe("jpg");
        expect(
            detectImageExtension(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))
        ).toBe("png");
        expect(detectImageExtension(Buffer.from("GIF89a....", "ascii"))).toBe("gif");
        expect(detectImageExtension(Buffer.from("RIFF\0\0\0\0WEBPVP8 ", "binary"))).toBe("webp");
    });

    it("menolak SVG, HTML, dan konten acak", () => {
        expect(detectImageExtension(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'))).toBeNull();
        expect(detectImageExtension(Buffer.from("<html><script>alert(1)</script></html>"))).toBeNull();
        expect(detectImageExtension(Buffer.alloc(0))).toBeNull();
    });
});

