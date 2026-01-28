import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '../public');
const imagesDir = join(publicDir, 'images');

async function generateFavicons() {
  const iconPath = join(imagesDir, 'icon.jpg');

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
    { name: 'og-image.png', size: 1200, height: 630 },
  ];

  for (const { name, size, height } of sizes) {
    const outputPath = join(imagesDir, name);
    if (height) {
      await sharp(iconPath)
        .resize(size, height, { fit: 'contain', background: { r: 31, g: 41, b: 55, alpha: 1 } })
        .png()
        .toFile(outputPath);
    } else {
      await sharp(iconPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
    }
    console.log(`Generated: ${name}`);
  }

  // Generate ICO file (use 32x32 PNG as favicon.ico alternative)
  await sharp(iconPath)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.png'));
  console.log('Generated: favicon.png');

  console.log('All favicons generated successfully!');
}

generateFavicons().catch(console.error);
