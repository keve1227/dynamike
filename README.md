# Dynamike

This is a command line tool for creating high-dymanic-range images (HDRIs) for use in video editing or CGI software like [Blender](https://www.blender.org/). The output file is a .tiff with a bit-depth of 96, encoded in linear floating point RGB with lossless compression applied (deflate). Supported input file formats include PNG, JPEG, TIFF, WebP and AVIF.

> For use in Blender, set the color space to "Linear" on the Image Texture node.

## Installation

Use [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install the "dynamike" command line tool.

```bash
npm install -g dynamike
```

## Usage

To use this tool you will need to have a sequence of static photos with different [exposure levels](https://photographylife.com/what-is-exposure#what-is-exposure-in-cameras).

To get the photographs for the exposure levels that you need, you will need a tripod and a digital camera with manual shutter speed and ISO controls. Your mobile phone might have a "Pro" mode in its camera app where these controls are made available.

1. Lock the [ISO (sensor sensitivity)](https://photographylife.com/what-is-exposure#iso-not-part-of-exposure) to a value like 50 for sunlit outdoor scenes, 100 for well-lit indoor scenes and > 200 for darker scenes, and don't change it. Images will tend to be noisier the higher this value is set so the lower you can set it, the better.
2. Adjust the shutter speed / exposure time (lower = darker) until the brightest part of your image is not clipping (i.e. has detail) and take a photo.
3. Keep on doubling your exposure time, each time taking a photo until the *darkest* part of the image has clear details.
4. Transfer all your photos to their own folder on your computer and name them by their respective exposure levels.
   > Note that labeling the files are not necessary if your images have valid [Exif](https://en.wikipedia.org/wiki/Exif) data for the exposure times. If an image has both Exif data *and* a label for its exposure time, only the label is used.

Each image needs to be labeled by its exposure time in the format of ``e_<seconds>`` or ``e<seconds>`` (case-insensitive). These labels can only have integer (whole) numbers, as well as fractions in the form of ``e1_30`` for 1/30 second's exposure time. The exposure time label cannot directly "touch" any surrounding numbers, letters (A-Z) or '_' (underscores). For example, a photo taken with an exposure of 2 seconds might have a name like ``20210914-E_2.jpg``, where ``E_2`` is the exposure time label.

Examples of valid labels:
- ``...-E1-...`` (1 s)
- ``... (E1_5)`` (0.2 s or 1/5 s)
- ``E_5-...`` (5 s)
- ``...-e_1_20-...`` (0.05 s or 1/20 s)
- ``... e_20_2 ...`` (10 s or 20/2 s)
etc.

Lastly, in the command line, run this command in the folder containing all your images. Insert another value where the ``[...]`` is. The output will be named ``out.tiff`` and be put in the same directory that the command is run in.

```bash
dynamike [<exposure> | 1/<exposure>]
```

> The ``<exposure>`` argument is the divisor/denominator of the fraction of a second equivalent exposure time that the output image should use as its base exposure. A value of ``8`` or ``1/8`` means the output will emulate a 1/8 second's exposure time.

If you set up everything correctly, congratulations!

## Showcase

A table comparing the results of different Blender view transforms with a decently exposed source image and the final output/result.

![Table of comparisons](https://github.com/Keve1227/dynamike/blob/main/showcase/comparisons.webp)

Notice how the combination of an HDRI with the Filmic view transform produces much better details in areas where for example the thin branches meet the sky. The blue of the sky is also fully captured.

---

Animating the exposure makes it very clear the benefits of using HDRIs for realisting lighting.

![Sliding exposure](https://github.com/Keve1227/dynamike/blob/main/showcase/animation.webp)

Here are some still frames:

![Still frames](https://github.com/Keve1227/dynamike/blob/main/showcase/strip.webp)
