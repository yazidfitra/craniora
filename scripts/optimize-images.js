const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const images = ['logo-crania.jpg', 'logo.jpg'];

async function convertToWebP() {
  for (const image of images) {
    const inputPath = path.join(publicDir, image);
    const outputPath = path.join(publicDir, image.replace('.jpg', '.webp'));
    
    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);
        console.log(`✓ Converted ${image} to WebP`);
      } catch (error) {
        console.error(`✗ Failed to convert ${image}:`, error.message);
      }
    }
  }
}

convertToWebP().then(() => {
  console.log('Image optimization complete!');
}).catch(console.error);
