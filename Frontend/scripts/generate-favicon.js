const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = path.join(
  process.env.USERPROFILE,
  ".cursor",
  "projects",
  "c-Users-HP-650-G9-Desktop-Business",
  "assets",
  "c__Users_HP_650_G9_AppData_Roaming_Cursor_User_workspaceStorage_4bf160981ea6263365521ba6ba355590_images_Medzoos_logo-removebg-preview__1_-e5abab72-0886-4278-b088-d8fbd9c99ce1.png"
);

const outDir = path.join(__dirname, "..", "public");

// Medzoos brand colors
const COLOR_Z = { r: 0x17, g: 0x61, b: 0x8e }; // #17618E
const COLOR_PLUS = { r: 0x0f, g: 0xa7, b: 0xe3 }; // #0FA7E3

async function prepareMark(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let a = data[i + 3];

      // transparent background
      if (a < 30 || (r < 42 && g < 42 && b < 42) || (r > 245 && g > 245 && b > 245)) {
        data[i + 3] = 0;
        continue;
      }

      // Brighter cyan pixels → plus; darker teal → Z
      const isPlus = g > 80 && b > 90;
      const c = isPlus ? COLOR_PLUS : COLOR_Z;
      data[i] = c.r;
      data[i + 1] = c.g;
      data[i + 2] = c.b;
      // keep soft anti-alias alpha
      data[i + 3] = a;

      if (a > 20) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) {
    return sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png()
      .toBuffer();
  }

  const pad = 4;
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const width = Math.min(info.width - left, maxX - minX + 1 + pad * 2);
  const height = Math.min(info.height - top, maxY - minY + 1 + pad * 2);

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left, top, width, height })
    .png()
    .toBuffer();
}

async function renderSquare(markBuf, size, { opaqueBg = false } = {}) {
  const inner = Math.round(size * 0.96);
  const resized = await sharp(markBuf)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const bg = opaqueBg
    ? { r: 8, g: 43, b: 63, alpha: 1 }
    : { r: 0, g: 0, b: 0, alpha: 0 };

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = [];
  for (const png of pngBuffers) {
    entries.push({ png, offset, size: png.length });
    offset += png.length;
  }
  const out = Buffer.alloc(offset);
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);
  let entryOffset = 6;
  const dims = [16, 32];
  for (let i = 0; i < count; i++) {
    const dim = dims[i] || 32;
    out.writeUInt8(dim, entryOffset);
    out.writeUInt8(dim, entryOffset + 1);
    out.writeUInt8(0, entryOffset + 2);
    out.writeUInt8(0, entryOffset + 3);
    out.writeUInt16LE(1, entryOffset + 4);
    out.writeUInt16LE(32, entryOffset + 6);
    out.writeUInt32LE(entries[i].size, entryOffset + 8);
    out.writeUInt32LE(entries[i].offset, entryOffset + 12);
    entries[i].png.copy(out, entries[i].offset);
    entryOffset += 16;
  }
  return out;
}

(async () => {
  if (!fs.existsSync(src)) {
    console.error("Source logo not found:", src);
    process.exit(1);
  }

  const mark = await prepareMark(src);
  fs.mkdirSync(path.join(outDir, "images"), { recursive: true });
  await sharp(mark).png().toFile(path.join(outDir, "images", "medzoos-favicon.png"));

  const outputs = [
    ["favicon-16.png", 16, false],
    ["favicon-32.png", 32, false],
    ["favicon-48.png", 48, false],
    ["icon.png", 512, false],
    ["apple-touch-icon.png", 180, true],
    ["apple-icon.png", 180, true],
  ];

  for (const [name, size, opaqueBg] of outputs) {
    fs.writeFileSync(path.join(outDir, name), await renderSquare(mark, size, { opaqueBg }));
  }

  const png16 = await renderSquare(mark, 16);
  const png32 = await renderSquare(mark, 32);
  fs.writeFileSync(path.join(outDir, "favicon.ico"), buildIco([png16, png32]));

  console.log("Favicon recolored: Z=#17618E + =#0FA7E3");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
