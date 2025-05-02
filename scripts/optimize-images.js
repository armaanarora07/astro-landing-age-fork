import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

// Configuration
const IMAGE_DIRS = [
  'public/images',
  'public/images/icon',
  'public/images/companies'
];
const OUTPUT_DIR_SUFFIX = 'optimized';
const SIZES = [192, 384, 512, 1024];
const FORMATS = ['webp', 'avif', 'png'];
const QUALITY = {
  webp: 80,
  avif: 60,
  png: 90,
  jpg: 85,
  jpeg: 85
};

// SVGO configuration
const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
          removeDesc: false
        }
      }
    },
    'removeDimensions',
    'sortAttrs',
    'removeStyleElement',
    'removeScriptElement'
  ]
};

// Ensure directories exist
function ensureDirectoryExistence(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Check if the source file is newer than the target file
function isSourceNewer(sourcePath, targetPath) {
  if (!fs.existsSync(targetPath)) {
    return true; // Target doesn't exist, needs to be generated
  }

  const sourceStats = fs.statSync(sourcePath);
  const targetStats = fs.statSync(targetPath);
  
  return sourceStats.mtimeMs > targetStats.mtimeMs;
}

// Process a single SVG file
async function processSVG(sourcePath, fileName, outputDir) {
  console.log(`Processing SVG: ${sourcePath}`);
  
  const outputPath = path.join(outputDir, fileName);
  
  // Skip if already exists and up to date
  if (fs.existsSync(outputPath) && !isSourceNewer(sourcePath, outputPath)) {
    console.log(`Skipping ${outputPath} (already up to date)`);
    return;
  }
  
  try {
    const svgContent = fs.readFileSync(sourcePath, 'utf8');
    const result = optimize(svgContent, svgoConfig);
    
    // Create output directory if it doesn't exist
    ensureDirectoryExistence(outputDir);
    
    // Write optimized SVG
    fs.writeFileSync(outputPath, result.data);
    console.log(`Optimized SVG: ${outputPath}`);
    
    // Log optimization results
    const originalSize = Buffer.byteLength(svgContent);
    const optimizedSize = Buffer.byteLength(result.data);
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    console.log(`SVG optimization: ${originalSize} bytes → ${optimizedSize} bytes (${savings}% savings)`);
  } catch (error) {
    console.error(`Error processing SVG ${sourcePath}:`, error);
  }
}

// Process a single image
async function processImage(sourcePath, fileName, outputDir) {
  console.log(`Processing: ${sourcePath}`);
  
  // Create base image processor
  const image = sharp(sourcePath);
  const metadata = await image.metadata();
  
  // Handle SVGs separately
  if (metadata.format === 'svg') {
    await processSVG(sourcePath, fileName, outputDir);
    return;
  }
  
  // Create output directories
  ensureDirectoryExistence(outputDir);
  
  // Get the file basename without extension
  const baseName = path.basename(fileName, path.extname(fileName));
  
  // Process image for each target size
  for (const size of SIZES) {
    // Skip sizes larger than the original
    if (size > metadata.width && size > metadata.height) {
      console.log(`Skipping size ${size}px for ${fileName} - original is smaller`);
      continue;
    }
    
    // For each format
    for (const format of FORMATS) {
      const outputPath = path.join(outputDir, `${baseName}-${size}.${format}`);
      
      // Skip if already exists and up to date
      if (fs.existsSync(outputPath) && !isSourceNewer(sourcePath, outputPath)) {
        console.log(`Skipping ${outputPath} (already up to date)`);
        continue;
      }
      
      try {
        // Resize and convert
        await image
          .clone()
          .resize({
            width: size,
            height: size,
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat(format, { quality: QUALITY[format] || 80 })
          .toFile(outputPath);
        
        console.log(`Generated: ${outputPath}`);
      } catch (error) {
        console.error(`Error processing ${sourcePath} to ${outputPath}:`, error);
      }
    }
  }
}

// Process all images in the directory
async function processDirectory(dirPath) {
  const outputDir = path.join(dirPath, OUTPUT_DIR_SUFFIX);
  ensureDirectoryExistence(outputDir);
  
  // Read all files in the directory
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);
    
    // Skip directories (except for recursive processing)
    if (fileStat.isDirectory() && file !== OUTPUT_DIR_SUFFIX) {
      // Skip optimization directories
      if (file === OUTPUT_DIR_SUFFIX) continue;
      
      // Process subdirectories
      await processDirectory(filePath);
    }
    // Process regular image files
    else if (fileStat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
        await processImage(filePath, file, outputDir);
      }
    }
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  for (const dir of IMAGE_DIRS) {
    if (fs.existsSync(dir)) {
      console.log(`Processing directory: ${dir}`);
      await processDirectory(dir);
    } else {
      console.warn(`Directory not found: ${dir}`);
    }
  }
  
  console.log('Image optimization complete!');
}

main().catch(error => {
  console.error('Error during image optimization:', error);
  process.exit(1);
}); 