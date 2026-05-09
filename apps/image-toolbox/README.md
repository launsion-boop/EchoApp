# Image Toolbox

Image Toolbox is a local-only image utility for EchoBraid — compress JPG/PNG/WEBP, convert raster to SVG, crop, and stitch images. All processing happens on-device; nothing is uploaded.

## Features

- Compress with quality + max-width controls
- Bitmap → SVG vectorization (ImageTracer)
- Crop with aspect lock and ratio presets
- Multi-image stitch (vertical / horizontal)
- Native save dialog via EchoBraid `fs.save` bridge
- Light / dark theme follows the EchoBraid host

## Update Source

```json
{
  "type": "github",
  "repo": "launsion-boop/EchoApp",
  "app_path": "apps/image-toolbox/app.json"
}
```
