import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(__dirname, '../public/images/logo.png');
const outputPath = path.join(__dirname, '../public/images/logo-transparent.png');

async function makeTransparent() {
  try {
    // Read the image
    const image = sharp(inputPath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    // Create new buffer with transparency
    const newData = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0; i < info.width * info.height; i++) {
      const r = data[i * info.channels];
      const g = data[i * info.channels + 1];
      const b = data[i * info.channels + 2];

      // Check if pixel is dark purple background (various shades)
      const isDarkPurple = (
        r < 40 && g < 25 && b < 50 && // Very dark purple
        (r + g + b) < 80 // Total darkness threshold
      );

      newData[i * 4] = r;
      newData[i * 4 + 1] = g;
      newData[i * 4 + 2] = b;
      newData[i * 4 + 3] = isDarkPurple ? 0 : 255; // Alpha: 0 = transparent, 255 = opaque
    }

    await sharp(newData, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .png()
    .toFile(outputPath);

    console.log('Transparent logo created:', outputPath);
  } catch (error) {
    console.error('Error:', error);
  }
}

makeTransparent();
