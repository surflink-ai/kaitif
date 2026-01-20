#!/usr/bin/env node

/**
 * Generate PWA icons from SVG source
 * Run with: node scripts/generate-icons.mjs
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../apps/web/public/icons');

// Icon sizes needed for PWA
const MAIN_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SHORTCUT_ICON_SIZE = 192;

async function generateIcons() {
  console.log('Generating PWA icons...');

  // Read the main SVG icon
  const mainSvg = await fs.readFile(path.join(ICONS_DIR, 'icon.svg'));
  
  // Generate main icons at all sizes
  for (const size of MAIN_ICON_SIZES) {
    const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    
    await sharp(mainSvg)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`  Created: icon-${size}x${size}.png`);
  }

  // Generate shortcut icons
  const shortcuts = ['pass-icon', 'events-icon'];
  
  for (const shortcut of shortcuts) {
    try {
      const svgPath = path.join(ICONS_DIR, `${shortcut}.svg`);
      const svg = await fs.readFile(svgPath);
      const outputPath = path.join(ICONS_DIR, `${shortcut}.png`);
      
      await sharp(svg)
        .resize(SHORTCUT_ICON_SIZE, SHORTCUT_ICON_SIZE)
        .png()
        .toFile(outputPath);
      
      console.log(`  Created: ${shortcut}.png`);
    } catch (err) {
      console.warn(`  Warning: Could not process ${shortcut}.svg:`, err.message);
    }
  }

  // Generate Apple Touch Icon
  const appleTouchIconPath = path.join(ICONS_DIR, 'apple-touch-icon.png');
  await sharp(mainSvg)
    .resize(180, 180)
    .png()
    .toFile(appleTouchIconPath);
  console.log('  Created: apple-touch-icon.png');

  // Generate favicon
  const faviconPath = path.join(__dirname, '../apps/web/public/favicon.ico');
  await sharp(mainSvg)
    .resize(32, 32)
    .png()
    .toFile(faviconPath.replace('.ico', '.png'));
  console.log('  Created: favicon.png');

  console.log('\nDone! PWA icons generated successfully.');
}

generateIcons().catch(console.error);
