# Expose

This is a command line tool for creating high-dymanic-range. The output file is a .tiff with a bit-depth of 96, floating point linear RGB encoded with lossless compression applied (deflate).

## Installation

```bash
npm install -g https://github.com/Keve1227/expose.git
```

## Usage

```
expose [<exposure> | 1/<exposure>]
```

Run this command in a folder containing the images with all your exposure levels. Each image needs to be labeled with its exposure, eg. a photo taken with an exposure of 1 second might have a name like ``20210914-E1.jpg``, where ``E1`` is its exposure label. Supported file formats include PNG, JPEG, TIFF, WebP and AVIF.

Valid exposure labels:
- ``...-E1-`` (1 s)
- ``... (e_5)`` (0.2 s or 1/5 s)
- ``E5_1-...`` (5 s)
- ``...-e_20-...`` (0.05 s or 1/20 s)
- ``... e20_2 ...`` (10 s or 20/2 s)
- etc.

The output is named ``out.tiff`` and is put in the same directory as the command is run from.
