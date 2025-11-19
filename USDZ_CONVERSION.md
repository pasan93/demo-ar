# USDZ Conversion Guide

Your GLB model needs to be converted to USDZ format for iOS AR support.

## File Details
- **Source:** `public/models/sofa.glb` (62.21 MB)
- **Target:** `public/models/sofa.usdz`

## Conversion Methods

### Method 1: Reality Converter (Mac - Best Quality)

1. **Download Reality Converter**
   - Visit: https://developer.apple.com/augmented-reality/tools/
   - Click "Download Reality Converter"
   - Install the application

2. **Convert the Model**
   - Open Reality Converter
   - Drag `public/models/sofa.glb` into the window
   - Wait for conversion
   - Click "Export" and save as `sofa.usdz` in `public/models/`

### Method 2: Online Converters (All Platforms)

#### Meshy AI (Recommended for large files)
- URL: https://www.meshy.ai/3d-tools/file-converter/glb/to/usdz
- Features: Client-side conversion, fast, privacy-friendly
- Steps:
  1. Upload `sofa.glb`
  2. Wait for conversion
  3. Download as `sofa.usdz`
  4. Save to `public/models/`

#### iLove3DM
- URL: https://www.ilove3dm.com/glb-to-usdz
- Free, no account required
- May have file size limits

#### Vectary
- URL: https://app.vectary.com/3d-modeling-blog/usdz-converter-convert-usdz-files-online-with-vectary/
- Allows editing before conversion
- Requires account (free)

### Method 3: Command Line (Mac with Xcode)

If you have Xcode installed, you can use Apple's command-line tools:

```bash
# Check if usdzconvert is available
xcrun usdz_converter

# Convert GLB to USDZ
cd public/models
xcrun usdz_converter sofa.glb sofa.usdz
```

### Method 4: Blender + Xcode (Advanced)

1. **Export from Blender:**
   - Import GLB into Blender
   - File > Export > USD (.usd/.usda/.usdc)
   - Save as `sofa.usd`

2. **Convert to USDZ:**
   ```bash
   xcrun usdz_converter sofa.usd sofa.usdz
   ```

## Quick Start Script

Run the included script for automatic setup:

```bash
./scripts/convert-to-usdz.sh
```

This will:
- Check for Reality Converter on Mac
- Open it automatically or guide you to online converters
- Provide step-by-step instructions

## After Conversion

1. Verify the file exists: `public/models/sofa.usdz`
2. Check file size (should be similar to GLB)
3. Test on iPhone:
   - Open your site in Safari
   - Tap "View in AR"
   - Verify the model loads correctly

## Troubleshooting

### File too large for online converter
- Use Reality Converter (Mac)
- Or optimize the GLB first using Blender or glTF tools

### Conversion failed
- Check if GLB file is valid
- Try opening in Blender first
- Simplify mesh if too complex

### iOS AR not working after conversion
- Verify USDZ file is in correct location
- Check file isn't corrupted
- Test file size (should be reasonable)
- Ensure iOS device is 15+ and Safari

## Notes

- **Current Status:** USDZ file is a placeholder
- **GLB Size:** 62.21 MB (large - consider optimization)
- **Browser Support:** 
  - GLB: All browsers (3D view)
  - USDZ: iOS Safari only (native AR)
  - Android uses Scene Viewer with GLB (no USDZ needed)

## File Optimization (Optional)

If the file is too large, consider optimizing:

```bash
# Using gltf-pipeline
npm install -g gltf-pipeline
gltf-pipeline -i sofa.glb -o sofa-optimized.glb -d

# Using Blender
# 1. Import GLB
# 2. Decimate modifier to reduce polygons
# 3. Compress textures
# 4. Export with compression
```

---

**Need Help?** Check the main README or open an issue.

