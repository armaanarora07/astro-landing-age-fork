import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const FAVICON_DIR = path.join(process.cwd(), 'public', 'favicon');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const LOGO_PATH = path.join(process.cwd(), 'public', 'images', 'icon', 'logo.png');
const ORIGINAL_PATH = fs.existsSync(LOGO_PATH) ? LOGO_PATH : path.join(FAVICON_DIR, 'original.png');

// Ensure favicon directory exists
if (!fs.existsSync(FAVICON_DIR)) {
  fs.mkdirSync(FAVICON_DIR, { recursive: true });
}

// Define all the favicons to generate
const FAVICONS = [
  { name: 'favicon.ico', size: 32, format: 'ico' },
  { name: 'favicon-16x16.png', size: 16, format: 'png' },
  { name: 'favicon-32x32.png', size: 32, format: 'png' },
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
  { name: 'android-chrome-512x512.png', size: 512, format: 'png' },
];

// Check if the source image is newer than the target file
function isSourceNewer(sourcePath, targetPath) {
  if (!fs.existsSync(targetPath)) {
    return true; // Target doesn't exist, needs to be generated
  }

  const sourceStats = fs.statSync(sourcePath);
  const targetStats = fs.statSync(targetPath);
  
  return sourceStats.mtimeMs > targetStats.mtimeMs;
}

async function generateFavicons() {
  try {
    // Check if original image exists
    if (!fs.existsSync(ORIGINAL_PATH)) {
      console.error('Original image not found at:', ORIGINAL_PATH);
      return;
    }

    // Generate the main SVG favicon in the public directory
    const svgFaviconPath = path.join(PUBLIC_DIR, 'favicon.svg');
    if (!fs.existsSync(svgFaviconPath) || isSourceNewer(ORIGINAL_PATH, svgFaviconPath)) {
      console.log('Generating favicon.svg in public directory...');
      await generateSvgFavicon(ORIGINAL_PATH, svgFaviconPath, 32);
      console.log('Generated favicon.svg in public directory');
    } else {
      console.log('Skipping favicon.svg (already up to date)');
    }

    // Process each favicon
    for (const favicon of FAVICONS) {
      const outputPath = path.join(FAVICON_DIR, favicon.name);
      
      // Check if file needs to be regenerated
      if (!fs.existsSync(outputPath) || isSourceNewer(ORIGINAL_PATH, outputPath)) {
        console.log(`Generating ${favicon.name}...`);
        
        // Create resized image
        let processor = sharp(ORIGINAL_PATH)
          .resize(favicon.size, favicon.size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          });
          
        // Convert to the appropriate format
        if (favicon.format === 'ico') {
          processor = processor.toFormat('png');
          await processor.toFile(outputPath + '.temp.png');
          // For ico files, we need a special handling as sharp doesn't support ico directly
          // Use the PNG we just created and rename it to .ico
          fs.renameSync(outputPath + '.temp.png', outputPath);
        } else {
          processor = processor.toFormat(favicon.format);
          await processor.toFile(outputPath);
        }

        console.log(`Generated ${favicon.name}`);
      } else {
        console.log(`Skipping ${favicon.name} (already up to date)`);
      }
    }

    // Create manifest.json
    const manifestPath = path.join(FAVICON_DIR, 'site.webmanifest');
    
    // Use company name from env if available
    const appName = process.env.APP_NAME || 'Your Company';
    const shortName = appName.split(' ')[0] || 'App';
    
    const manifestContent = {
      name: appName,
      short_name: shortName,
      icons: [
        {
          src: '/favicon/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/favicon/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      theme_color: '#4f46e5',
      background_color: '#ffffff',
      display: 'standalone'
    };
    
    if (!fs.existsSync(manifestPath) || isSourceNewer(ORIGINAL_PATH, manifestPath)) {
      fs.writeFileSync(
        manifestPath,
        JSON.stringify(manifestContent, null, 2)
      );
      console.log('Generated site.webmanifest');
    } else {
      console.log('Skipping site.webmanifest (already up to date)');
    }
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Function to create an SVG favicon that wraps the logo image
async function generateSvgFavicon(inputImagePath, outputPath, size) {
  try {
    // Get image dimensions
    const metadata = await sharp(inputImagePath).metadata();
    const aspectRatio = metadata.width / metadata.height;
    
    // Create a base64 version of the image to embed in SVG
    const base64Image = await sharp(inputImagePath)
      .resize(size, Math.round(size / aspectRatio))
      .toBuffer()
      .then(buffer => `data:image/png;base64,${buffer.toString('base64')}`);
    
    // Create SVG with embedded image
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <image width="${size}" height="${size}" xlink:href="${base64Image}"/>
</svg>`;
    
    fs.writeFileSync(outputPath, svgContent);
  } catch (error) {
    console.error('Error generating SVG favicon:', error);
    throw error;
  }
}

generateFavicons(); 