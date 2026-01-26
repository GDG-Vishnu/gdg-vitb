import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_IMAGE = path.join(__dirname, "../src/assets/Logo.webp");
const PUBLIC_DIR = path.join(__dirname, "../public");
const APP_DIR = path.join(__dirname, "../src/app");

// Favicon sizes to generate
const FAVICON_SIZES = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 192, name: "icon-192x192.png" },
  { size: 512, name: "icon-512x512.png" },
];

const APPLE_ICON_SIZE = 180;

async function generateFavicons() {
  console.log("🎨 Generating favicons from:", SOURCE_IMAGE);

  // Check if source exists
  if (!fs.existsSync(SOURCE_IMAGE)) {
    console.error("❌ Source image not found:", SOURCE_IMAGE);
    process.exit(1);
  }

  // Ensure directories exist
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  try {
    // Generate PNG favicons for public folder
    for (const { size, name } of FAVICON_SIZES) {
      const outputPath = path.join(PUBLIC_DIR, name);
      await sharp(SOURCE_IMAGE)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);
      console.log(`✅ Generated: ${name} (${size}x${size})`);
    }

    // Generate Apple Touch Icon
    const appleIconPath = path.join(PUBLIC_DIR, "apple-touch-icon.png");
    await sharp(SOURCE_IMAGE)
      .resize(APPLE_ICON_SIZE, APPLE_ICON_SIZE, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(appleIconPath);
    console.log(
      `✅ Generated: apple-touch-icon.png (${APPLE_ICON_SIZE}x${APPLE_ICON_SIZE})`,
    );

    // Generate favicon.ico (multi-size ICO format) - using 32x32 PNG as base
    // Note: Sharp doesn't support ICO, so we'll create a 32x32 PNG and rename guidance
    const faviconPngPath = path.join(APP_DIR, "icon.png");
    await sharp(SOURCE_IMAGE)
      .resize(32, 32, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(faviconPngPath);
    console.log(
      `✅ Generated: src/app/icon.png (32x32) - This will be used as favicon`,
    );

    console.log("\n🎉 All favicons generated successfully!");
    console.log("\n📝 Next steps:");
    console.log(
      "1. The icon.png in src/app/ will automatically be used as favicon by Next.js",
    );
    console.log("2. Update your manifest.json with the new icon paths");
    console.log("3. Optionally delete the old favicon.ico if not needed");
  } catch (error) {
    console.error("❌ Error generating favicons:", error);
    process.exit(1);
  }
}

generateFavicons();
