#!/usr/bin/env node

import sharp from "sharp";
import fs from "fs";
import path from "path";

const outputExposure = 1 / Number(/^(?:1\/)?(.*)$/.exec(process.argv[2])[1]);

if (!Number.isFinite(outputExposure)) {
    process.stdout.write(await fs.promises.readFile(new URL("help.txt", import.meta.url)));
    process.exit(1);
}

console.log(`Output Exposure: ${Math.round(outputExposure * 1000) / 1000} s (1/${1 / outputExposure} s)`);
console.log();

const dirents = await fs.promises.readdir(process.cwd(), { withFileTypes: true });

console.log("Processing...");
const result = {};
for (const dirent of dirents) {
    if (!dirent.isFile()) continue;
    if (!/.(?:jpe?g|png|webp|tiff?|avif)$/i.test(dirent.name)) continue;

    const file = path.join(process.cwd(), dirent.name);
    const match = /\be_*(\d+)(?:_+(\d+))?\b/i.exec(dirent.name);

    if (!match) {
        console.log(`Skipping (${file}): Missing or invalid exposure label.`);
        continue;
    }

    const [, dividend, divisor = 1] = match;
    const exposure = dividend / divisor;

    const image = sharp(file, { failOnError: false }).removeAlpha().raw({ depth: "float" });

    const metadata = await image.metadata();
    const { data, info } = await image.toBuffer({ resolveWithObject: true });
    const bpp = info.size / info.width / info.height / info.channels;

    result.metadata ??= metadata;
    result.pixels ??= Array(data.length / bpp).fill(0);
    result.info ??= info;
    result.ref ??= file;

    if (info.width != result.info.width || info.height != result.info.height) {
        console.log(`Skipping (${file}): Width and height not matching (${result.ref}).`);
        continue;
    }

    for (let i = 0; i < info.size / bpp; i++) {
        let v = data.readFloatLE(i * bpp) / 0xff;
        v = v <= 0.01 ? 0 : (v - 0.01) / 0.99;
        v = v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 / exposure;

        result.pixels[i] = Math.max(result.pixels[i], v);
    }

    console.log(" + " + dirent.name);
}

console.log();
console.log("Saving...");

if (result.pixels) {
    const data = new Float32Array(result.pixels.length);

    for (let i = 0; i < result.pixels.length; i++) {
        data[i] = result.pixels[i] * outputExposure;
    }

    const out = sharp(data, {
        raw: {
            channels: 3,
            width: result.info.width,
            height: result.info.height,
        },
    }).withMetadata({ orientation: result.metadata.orientation });

    const fileOut = path.join(process.cwd(), "out.tiff");
    await out.tiff({ compression: "deflate", predictor: "float" }).toFile(fileOut);

    console.log(">> out.tiff");
}
