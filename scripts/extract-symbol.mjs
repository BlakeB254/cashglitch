import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../public/images/logo.png');

async function extractSymbol() {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log('Original image:', metadata.width, 'x', metadata.height);

    // The triangle symbol is roughly in the upper portion of the image
    // Crop to focus on just the triangle (top 60% of image, centered)
    const symbolWidth = Math.floor(metadata.width * 0.7);
    const symbolHeight = Math.floor(metadata.height * 0.55);
    const left = Math.floor((metadata.width - symbolWidth) / 2);
    const top = Math.floor(metadata.height * 0.05);

    // Extract and create transparent symbol
    const { data, info } = await sharp(inputPath)
      .extract({ left, top, width: symbolWidth, height: symbolHeight })
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log('Cropped to:', info.width, 'x', info.height);

    // Create new buffer with transparency for dark background pixels
    const newData = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0; i < info.width * info.height; i++) {
      const r = data[i * info.channels];
      const g = data[i * info.channels + 1];
      const b = data[i * info.channels + 2];

      // Calculate brightness and purple-ness
      const brightness = (r + g + b) / 3;
      const isPurplish = b > r && b > g;

      // Keep pixels that are bright enough or have significant color
      // Remove very dark background pixels
      const isBackground = (
        brightness < 25 && // Very dark
        r < 30 && g < 20 && b < 45 // Dark purple/black range
      );

      newData[i * 4] = r;
      newData[i * 4 + 1] = g;
      newData[i * 4 + 2] = b;
      newData[i * 4 + 3] = isBackground ? 0 : 255;
    }

    // Save navbar logo (symbol only, transparent)
    await sharp(newData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    })
    .png()
    .toFile(path.join(__dirname, '../public/images/symbol-transparent.png'));

    console.log('Created: symbol-transparent.png');

    // Create favicon versions
    const sizes = [16, 32, 180, 192, 512];

    for (const size of sizes) {
      await sharp(newData, {
        raw: { width: info.width, height: info.height, channels: 4 }
      })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(__dirname, `../public/images/favicon-${size}.png`));

      console.log(`Created: favicon-${size}.png`);
    }

    // Create main favicon.png
    await sharp(newData, {
      raw: { width: info.width, height: info.height, channels: 4 }
    })
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(__dirname, '../public/favicon.png'));

    console.log('Created: favicon.png');

    // Create OG image with symbol on dark purple background
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 15, g: 10, b: 26, alpha: 255 }
      }
    })
    .composite([{
      input: await sharp(newData, {
        raw: { width: info.width, height: info.height, channels: 4 }
      })
      .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(__dirname, '../public/images/og-image.png'));

    console.log('Created: og-image.png');

  } catch (error) {
    console.error('Error:', error);
  }
}

extractSymbol();
