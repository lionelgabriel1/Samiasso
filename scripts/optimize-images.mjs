import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const imageRoot = path.join(publicDir, 'images');
const outputRoot = path.join(imageRoot, 'optimized');
const manifestPath = path.resolve('src/generated/imageVariants.json');
const supported = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);
const targetWidths = [480, 768, 1200, 1600];

async function walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return []; }
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'optimized') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (supported.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

await fs.mkdir(path.dirname(manifestPath), { recursive: true });
const manifest = {};
const files = await walk(imageRoot);

for (const file of files) {
  const metadata = await sharp(file, { failOn: 'none' }).metadata();
  if (!metadata.width || !metadata.height) continue;
  const relative = path.relative(imageRoot, file).split(path.sep).join('/');
  const key = `/images/${relative}`;
  const base = path.basename(file, path.extname(file)).replace(/[^a-zA-Z0-9_-]+/g, '-') + '-' + path.extname(file).slice(1);
  const folder = path.join(outputRoot, path.dirname(relative));
  await fs.mkdir(folder, { recursive: true });
  const widths = targetWidths.filter((width) => width < metadata.width);
  if (widths.length === 0) widths.push(metadata.width);
  const avif = [];
  const webp = [];

  for (const width of widths) {
    const stem = `${base}-${width}`;
    const avifName = `${stem}.avif`;
    const webpName = `${stem}.webp`;
    const pipeline = sharp(file, { failOn: 'none' }).rotate().resize({ width, withoutEnlargement: true });
    await pipeline.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(folder, avifName));
    await pipeline.clone().webp({ quality: 78, effort: 4 }).toFile(path.join(folder, webpName));
    const urlPrefix = `/images/optimized/${path.dirname(relative) === '.' ? '' : path.dirname(relative) + '/'}`;
    avif.push({ src: urlPrefix + avifName, width });
    webp.push({ src: urlPrefix + webpName, width });
  }
  manifest[key] = { width: metadata.width, height: metadata.height, avif, webp };
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Optimized ${Object.keys(manifest).length} images into AVIF/WebP responsive variants.`);
