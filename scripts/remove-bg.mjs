import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function removeBg(inputPath, outputPath, threshold = 235) {
    const img = sharp(inputPath);
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;
    const buf = Buffer.from(data);

    for (let i = 0; i < width * height; i++) {
        const idx = i * channels;
        const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
        // Remove near-white pixels
        if (r >= threshold && g >= threshold && b >= threshold) {
            buf[idx + 3] = 0; // fully transparent
        }
    }

    await sharp(buf, { raw: { width, height, channels } })
        .png({ compressionLevel: 9 })
        .toFile(outputPath);

    console.log(`✅  Saved → ${outputPath}`);
}

// Process both logos
await removeBg(
    path.join(__dirname, "../public/images/logo-hd.png"),
    path.join(__dirname, "../public/images/logo-hd-transparent.png"),
    230
);

await removeBg(
    path.join(__dirname, "../public/images/logo.jpg"),
    path.join(__dirname, "../public/images/logo.png"),
    220
);
