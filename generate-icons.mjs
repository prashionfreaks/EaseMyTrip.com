// Generates PNG icons for PWA from the SVG source using sharp
// Run: node generate-icons.mjs
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function generate() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    // sharp not available — create minimal valid PNGs via canvas fallback
    await generateWithCanvas();
    return;
  }

  const svg = readFileSync(join(__dirname, 'public/icons/icon.svg'));
  mkdirSync(join(__dirname, 'public/icons'), { recursive: true });

  for (const size of [192, 512]) {
    await sharp(svg).resize(size, size).png().toFile(join(__dirname, `public/icons/icon-${size}.png`));
    console.log(`✓ icon-${size}.png`);
  }
}

async function generateWithCanvas() {
  const { createCanvas, loadImage } = await import('canvas').catch(() => null) || {};
  if (!createCanvas) {
    console.log('⚠ Neither sharp nor canvas found. Creating placeholder icons.');
    await createPlaceholderPNGs();
    return;
  }
  const svgPath = join(__dirname, 'public/icons/icon.svg');
  mkdirSync(join(__dirname, 'public/icons'), { recursive: true });
  for (const size of [192, 512]) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    const img = await loadImage(svgPath);
    ctx.drawImage(img, 0, 0, size, size);
    const { writeFileSync } = await import('fs');
    writeFileSync(join(__dirname, `public/icons/icon-${size}.png`), canvas.toBuffer('image/png'));
    console.log(`✓ icon-${size}.png`);
  }
}

async function createPlaceholderPNGs() {
  // Minimal valid 1x1 PNG, scaled up — browsers will use SVG anyway
  // Real icons generated at deploy time via CI
  const { writeFileSync } = await import('fs');
  mkdirSync(join(__dirname, 'public/icons'), { recursive: true });

  // Minimal 192x192 solid PNG (header + IDAT + IEND)
  // Using a pre-encoded minimal valid PNG to avoid binary issues
  const png1x1Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  const buf = Buffer.from(png1x1Base64, 'base64');
  writeFileSync(join(__dirname, 'public/icons/icon-192.png'), buf);
  writeFileSync(join(__dirname, 'public/icons/icon-512.png'), buf);
  console.log('⚠ Placeholder icons created. Install sharp for proper icons: npm i -D sharp');
}

generate().catch(console.error);
