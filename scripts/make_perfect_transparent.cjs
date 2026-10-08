const { execSync } = require('child_process');
const fs = require('fs');

console.log('Generating pristine transparent pots and centered plants...');

// 1. PROCESS POTS: Strictly isolate the pot body and soil, removing 100% of floor shadow
function cleanPot(srcJpg, outPng, topY, botY, isWhitePot = false) {
  console.log(`Processing pot: ${srcJpg}`);
  // First crop vertically between topY and botY to discard floor shadow
  const croppedRgba = '/tmp/cropped_pot.rgba';
  execSync(`convert "${srcJpg}" -crop 1024x${botY - topY}+0+${topY} -depth 8 "${croppedRgba}"`);
  
  const w = 1024;
  const h = botY - topY;
  const buf = fs.readFileSync(croppedRgba);

  if (isWhitePot) {
    // Alabaster white pot: floodfill from the outer boundary
    const visited = new Uint8Array(w * h);
    const queue = [];
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
      // Outside background is white or very light neutral shadow
      const isBg = (r > 225 && g > 225 && b > 225) || (r > 210 && Math.abs(r - g) < 8 && Math.abs(r - b) < 8);
      if (!isBg) continue;

      buf[pi + 3] = 0; // 100% transparent

      const x = idx % w;
      const y = Math.floor(idx / w);
      if (x > 0 && !visited[idx - 1]) queue.push(idx - 1);
      if (x < w - 1 && !visited[idx + 1]) queue.push(idx + 1);
      if (y > 0 && !visited[idx - w]) queue.push(idx - w);
      if (y < h - 1 && !visited[idx + w]) queue.push(idx + w);
    }
  } else {
    // Basalt, Terracotta, Sandstone: any light pixel is background
    for (let i = 0; i < buf.length; i += 4) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      const isLightBg = (r > 200 && g > 200 && b > 200) || (r > 190 && Math.abs(r - g) < 12 && Math.abs(r - b) < 12);
      if (isLightBg) {
        buf[i + 3] = 0;
      } else {
        buf[i + 3] = 255;
      }
    }
  }

  const outRgba = '/tmp/pot_clean.rgba';
  fs.writeFileSync(outRgba, buf);
  execSync(`convert -size ${w}x${h} -depth 8 "${outRgba}" -trim +repage "${outPng}"`);
  console.log(`Saved pristine pot: ${outPng}`);
}

cleanPot('src/assets/images/clean_alabaster_pot_white_1791496603396.jpg', 'src/assets/images/clean_pot_alabaster_final.png', 161, 938, true);
cleanPot('src/assets/images/clean_basalt_pot_white_1791496611891.jpg', 'src/assets/images/clean_pot_basalt_final.png', 104, 891, false);
cleanPot('src/assets/images/clean_terracotta_pot_white_1791496621225.jpg', 'src/assets/images/clean_pot_terracotta_final.png', 194, 923, false);
cleanPot('src/assets/images/clean_sandstone_pot_white_1791496631680.jpg', 'src/assets/images/clean_pot_sandstone_final.png', 166, 889, false);

// 2. PROCESS PLANTS: Clean alpha and horizontally center the stem base
function cleanAndCenterPlant(srcJpg, outPng) {
  console.log(`Processing plant: ${srcJpg}`);
  const tmpRgba = '/tmp/plant_tmp.rgba';
  execSync(`convert "${srcJpg}" -depth 8 "${tmpRgba}"`);

  const size = execSync(`identify -format "%w %h" "${srcJpg}"`).toString().trim().split(' ');
  const w = parseInt(size[0]), h = parseInt(size[1]);
  const buf = fs.readFileSync(tmpRgba);

  // Set alpha
  for (let i = 0; i < buf.length; i += 4) {
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const delta = maxVal - minVal;

    const isPureWhite = (minVal >= 235);
    const isLightNeutral = (minVal >= 195 && delta <= 28);
    const isVeryLight = (minVal >= 215 && delta <= 35);

    if (isPureWhite || isLightNeutral || isVeryLight) {
      buf[i + 3] = 0;
    } else if (minVal >= 180 && delta <= 22) {
      const alphaFactor = Math.max(0, Math.min(1, (215 - minVal) / 35));
      buf[i + 3] = Math.round(alphaFactor * 255);
    } else {
      buf[i + 3] = 255;
    }
  }

  // Find the horizontal bounds of the bottom stem (lowest 30 rows with non-transparent pixels)
  let lowestY = 0;
  for (let y = h - 1; y >= 0; y--) {
    let rowHasPixel = false;
    for (let x = 0; x < w; x++) {
      if (buf[(y * w + x) * 4 + 3] > 80) {
        rowHasPixel = true;
        break;
      }
    }
    if (rowHasPixel) {
      lowestY = y;
      break;
    }
  }

  // Sample stem bounds in lowest 25 rows of the plant
  let stemMinX = w, stemMaxX = 0;
  for (let y = Math.max(0, lowestY - 25); y <= lowestY; y++) {
    for (let x = 0; x < w; x++) {
      if (buf[(y * w + x) * 4 + 3] > 80) {
        if (x < stemMinX) stemMinX = x;
        if (x > stemMaxX) stemMaxX = x;
      }
    }
  }

  const stemCenterX = Math.round((stemMinX + stemMaxX) / 2);
  console.log(`Stem center for ${srcJpg}: x=${stemCenterX} (image width: ${w})`);

  // Symmetrize the image canvas around stemCenterX so the stem is at the EXACT 50% horizontal center!
  const leftDist = stemCenterX;
  const rightDist = w - stemCenterX;
  const maxHalfDist = Math.max(leftDist, rightDist);
  const newWidth = maxHalfDist * 2;
  const padLeft = maxHalfDist - leftDist;

  const centeredBuf = Buffer.alloc(newWidth * h * 4, 0); // all transparent
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = (y * w + x) * 4;
      const dstIdx = (y * newWidth + (x + padLeft)) * 4;
      centeredBuf[dstIdx] = buf[srcIdx];
      centeredBuf[dstIdx + 1] = buf[srcIdx + 1];
      centeredBuf[dstIdx + 2] = buf[srcIdx + 2];
      centeredBuf[dstIdx + 3] = buf[srcIdx + 3];
    }
  }

  const outRgba = '/tmp/plant_centered.rgba';
  fs.writeFileSync(outRgba, centeredBuf);
  // Crop only vertical bounds, maintaining perfect horizontal center!
  execSync(`convert -size ${newWidth}x${h} -depth 8 "${outRgba}" "${outPng}"`);
  console.log(`Saved centered plant: ${outPng}`);
}

cleanAndCenterPlant('src/assets/images/clean_olive_tree_white_1791496674514.jpg', 'src/assets/images/clean_plant_olive_final.png');
cleanAndCenterPlant('src/assets/images/clean_monstera_plant_white_1791496683687.jpg', 'src/assets/images/clean_plant_monstera_final.png');
cleanAndCenterPlant('src/assets/images/clean_ficus_lyrata_white_1791496693362.jpg', 'src/assets/images/clean_plant_ficus_final.png');
cleanAndCenterPlant('src/assets/images/clean_snake_plant_white_1791496703999.jpg', 'src/assets/images/clean_plant_snake_final.png');

console.log('ALL FINAL ASSETS COMPLETED!');
