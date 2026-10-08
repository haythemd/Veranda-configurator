const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function processPlant(srcJpg, outPng) {
  console.log(`Processing plant: ${srcJpg} -> ${outPng}`);
  const tmpRgba = `/tmp/${path.basename(srcJpg, '.jpg')}.rgba`;
  execSync(`convert "${srcJpg}" -depth 8 "${tmpRgba}"`);
  
  const size = execSync(`identify -format "%w %h" "${srcJpg}"`).toString().trim().split(' ');
  const w = parseInt(size[0]), h = parseInt(size[1]);
  const buf = fs.readFileSync(tmpRgba);

  // Plants have green foliage / brown wood.
  // Any neutral light pixel is background.
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const delta = maxVal - minVal;

    // Background is near white or light grey with low saturation
    const isPureWhite = (minVal >= 235);
    const isLightNeutral = (minVal >= 195 && delta <= 28);
    const isVeryLight = (minVal >= 215 && delta <= 35);

    if (isPureWhite || isLightNeutral || isVeryLight) {
      buf[i + 3] = 0; // 100% transparent
    } else if (minVal >= 180 && delta <= 22) {
      // Soft edge feathering
      const alphaFactor = Math.max(0, Math.min(1, (215 - minVal) / 35));
      buf[i + 3] = Math.round(alphaFactor * 255);
    } else {
      buf[i + 3] = 255;
    }
  }

  const outRgba = `/tmp/out_${path.basename(srcJpg, '.jpg')}.rgba`;
  fs.writeFileSync(outRgba, buf);
  execSync(`convert -size ${w}x${h} -depth 8 "${outRgba}" -trim +repage "${outPng}"`);
  console.log(`Saved ${outPng}`);
}

function processPot(srcJpg, outPng, isWhitePot = false) {
  console.log(`Processing pot: ${srcJpg} -> ${outPng}`);
  const tmpRgba = `/tmp/${path.basename(srcJpg, '.jpg')}.rgba`;
  execSync(`convert "${srcJpg}" -depth 8 "${tmpRgba}"`);

  const size = execSync(`identify -format "%w %h" "${srcJpg}"`).toString().trim().split(' ');
  const w = parseInt(size[0]), h = parseInt(size[1]);
  const buf = fs.readFileSync(tmpRgba);

  if (isWhitePot) {
    // Breadth-first search / floodfill from edges for white alabaster pot
    const visited = new Uint8Array(w * h);
    const queue = [];
    // Seed all 4 border edges
    for (let x = 0; x < w; x++) {
      queue.push(x);
      queue.push((h - 1) * w + x);
    }
    for (let y = 0; y < h; y++) {
      queue.push(y * w);
      queue.push(y * w + (w - 1));
    }

    let head = 0;
    while (head < queue.length) {
      const idx = queue[head++];
      if (visited[idx]) continue;
      visited[idx] = 1;

      const pi = idx * 4;
      const r = buf[pi], g = buf[pi + 1], b = buf[pi + 2];
      const isBg = (r > 230 && g > 230 && b > 230);
      if (!isBg) continue;

      buf[pi + 3] = 0; // transparent

      const x = idx % w;
      const y = Math.floor(idx / w);
      if (x > 0 && !visited[idx - 1]) queue.push(idx - 1);
      if (x < w - 1 && !visited[idx + 1]) queue.push(idx + 1);
      if (y > 0 && !visited[idx - w]) queue.push(idx - w);
      if (y < h - 1 && !visited[idx + w]) queue.push(idx + w);
    }
  } else {
    // Dark/Terracotta/Sandstone pot: any light pixel is background
    for (let i = 0; i < buf.length; i += 4) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const isLightBg = (r > 220 && g > 220 && b > 220);
      if (isLightBg) {
        buf[i + 3] = 0;
      } else {
        buf[i + 3] = 255;
      }
    }
  }

  const outRgba = `/tmp/out_${path.basename(srcJpg, '.jpg')}.rgba`;
  fs.writeFileSync(outRgba, buf);
  execSync(`convert -size ${w}x${h} -depth 8 "${outRgba}" -trim +repage "${outPng}"`);
  console.log(`Saved ${outPng}`);
}

// 1. Process 4 Plants
processPlant(
  'src/assets/images/clean_olive_tree_white_1791496674514.jpg',
  'src/assets/images/plant_olive_perfect.png'
);
processPlant(
  'src/assets/images/clean_monstera_plant_white_1791496683687.jpg',
  'src/assets/images/plant_monstera_perfect.png'
);
processPlant(
  'src/assets/images/clean_ficus_lyrata_white_1791496693362.jpg',
  'src/assets/images/plant_ficus_perfect.png'
);
processPlant(
  'src/assets/images/clean_snake_plant_white_1791496703999.jpg',
  'src/assets/images/plant_snake_perfect.png'
);

// 2. Process 4 Pots
processPot(
  'src/assets/images/clean_alabaster_pot_white_1791496603396.jpg',
  'src/assets/images/pot_alabaster_perfect.png',
  true
);
processPot(
  'src/assets/images/clean_basalt_pot_white_1791496611891.jpg',
  'src/assets/images/pot_basalt_perfect.png',
  false
);
processPot(
  'src/assets/images/clean_terracotta_pot_white_1791496621225.jpg',
  'src/assets/images/pot_terracotta_perfect.png',
  false
);
processPot(
  'src/assets/images/clean_sandstone_pot_white_1791496631680.jpg',
  'src/assets/images/pot_sandstone_perfect.png',
  false
);

console.log('All 8 assets processed perfectly!');
