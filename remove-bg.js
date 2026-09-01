const { Jimp, intToRGBA, rgbaToInt } = require('jimp');

async function removeWhiteBg() {
  const imagePath = 'd:\\Startup India\\Startup India\\demo websites\\Khavyn\\Khavyn\\public\\logo.png';
  console.log('Reading image...');
  const image = await Jimp.read(imagePath);
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  console.log(`Image size: ${width}x${height}`);
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const hex = image.getPixelColor(x, y);
      const rgba = intToRGBA(hex);
      
      const isWhiteish = rgba.r > 210 && rgba.g > 210 && rgba.b > 210;
      
      if (isWhiteish) {
        // Soft alpha blending
        const avg = (rgba.r + rgba.g + rgba.b) / 3;
        let alpha = 255 - Math.floor(((avg - 210) / 45) * 255);
        if (alpha < 0) alpha = 0;
        if (alpha > 255) alpha = 255;
        
        image.setPixelColor(rgbaToInt(rgba.r, rgba.g, rgba.b, alpha), x, y);
      }
    }
  }
  
  await new Promise((resolve, reject) => {
    image.write('d:\\Startup India\\Startup India\\demo websites\\Khavyn\\Khavyn\\public\\logo.png', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  console.log('Saved transparent logo.');
}

removeWhiteBg().catch(console.error);
