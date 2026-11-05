import { mkdir, readdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "resources");
const destination = path.join(root, "public", "media");
await mkdir(path.join(destination, "images"), { recursive: true });
await mkdir(path.join(destination, "qr"), { recursive: true });
await mkdir(path.join(destination, "sound"), { recursive: true });

let originalBytes = 0;
let optimizedBytes = 0;
for (const name of (await readdir(path.join(source, "images"))).sort()) {
  if (!/\.jpe?g$/i.test(name)) continue;
  const original = path.join(source, "images", name);
  const output = path.join(destination, "images", name.replace(/\.jpe?g$/i, ".webp"));
  // Auto-orient from EXIF; cap resolution and strip camera/GPS metadata.
  await sharp(original).rotate().resize({ width: 1600, height: 2000, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 83, effort: 5 }).toFile(output);
  originalBytes += (await stat(original)).size;
  optimizedBytes += (await stat(output)).size;
}
for (const name of ["QR_groom.png", "QR_bride.png"]) {
  // Keep QR pixels lossless and preserve the full quiet zone.
  await sharp(path.join(source, "qr", name)).png({ compressionLevel: 9 })
    .toFile(path.join(destination, "qr", name));
}
await copyFile(path.join(source, "sound", "Music.mp3"), path.join(destination, "sound", "Music.mp3"));
console.log(`Wedding photos: ${(originalBytes / 1024 / 1024).toFixed(1)} MB → ${(optimizedBytes / 1024 / 1024).toFixed(1)} MB. QR and music prepared.`);
