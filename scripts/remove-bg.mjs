import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, "../public/images/logo.jpg");
const output = path.join(__dirname, "../public/images/logo.png");

// Load image, get raw pixel data
const img = sharp(input);
const meta = await img.metadata();
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const buf = Buffer.from(data);

// White-removal: for every pixel, if R,G,B are all >= 230, make it transparent
for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
    if (r >= 220 && g >= 220 && b >= 220) {
        buf[idx + 3] = 0; // fully transparent
    }
}

await sharp(buf, { raw: { width, height, channels } })
    .png()
    .toFile(output);

console.log(`✅  Saved transparent logo → ${output}`);
