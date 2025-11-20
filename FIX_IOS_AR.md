# Fix iOS AR "Object Not Loading" Issue

## Quick Test First! 🧪

1. **Go to test page:** `http://YOUR_IP:3000/test-ar`
2. **Try Test 2 first:** "Apple Sample (Teacup)" 
   - If this works ✅ → Your iOS AR Quick Look is functional, issue is with sofa.usdz
   - If this fails ❌ → Issue is with iOS/Safari/network setup

---

## If Apple Sample Works But Sofa Doesn't

### Issue: USDZ File Too Large or Incorrectly Formatted

Your `sofa.usdz` is **126 MB** which may cause:
- Timeout on cellular networks
- Memory issues on older iPhones
- Safari refusing to download large files

### Solution Options:

#### Option 1: Optimize the USDZ File (Recommended)

The USDZ contains a 129MB text file (model.usda). We need to:
1. Convert to binary format (USDC)
2. Reduce polygon count
3. Compress textures

**Using Blender (Free):**

```bash
# 1. Install Blender and USD plugin
brew install blender

# 2. Open Blender, import your GLB:
# File > Import > glTF 2.0 (.glb/.gltf) > select sofa.glb

# 3. Optimize:
# - Select mesh
# - Modifiers > Add Modifier > Decimate
# - Set Ratio to 0.5 (reduces polygons by 50%)
# - Apply modifier

# 4. Optimize textures:
# - UV Editing tab
# - Select each texture in Shader Editor
# - Image > Pack/Unpack > Unpack
# - Use image editing software to reduce size
# - Reimport at 2K or 1K resolution

# 5. Export as USD:
# File > Export > Universal Scene Description (.usd/.usdc)
# Format: Binary (USDC)
# Save as: sofa-optimized.usdc
```

**Convert USDC to USDZ (Mac):**

```bash
# If you have Xcode Command Line Tools:
xcrun usdz_converter sofa-optimized.usdc public/models/sofa.usdz

# Replace the old file
mv public/models/sofa.usdz public/models/sofa-old.usdz
mv sofa-optimized.usdz public/models/sofa.usdz
```

#### Option 2: Use Online USDZ Optimizer

1. **Vectary (Recommended):**
   - Go to: https://www.vectary.com/
   - Upload your GLB
   - Use "Optimize" feature
   - Reduce polygon count (try 50K-100K polygons)
   - Export as USDZ

2. **Sketchfab:**
   - Upload GLB to https://sketchfab.com/
   - Download Settings > Select USDZ
   - Download optimized version

#### Option 3: Use Apple’s Hosted Sample Temporarily

Point your `iosSrc` (or the `/test-ar` page link) to Apple&apos;s known-good USDZ file:

- `https://developer.apple.com/augmented-reality/quick-look/models/teapot/teapot.usdz`

If that loads, Quick Look and your headers are correct—the issue is with your custom USDZ payload.

---

## If Apple Sample Also Fails

### Check These iOS Settings:

1. **Safari Settings:**
   - Settings > Safari > Camera
   - Ensure "Ask" or "Allow"

2. **Network Issues:**
   - Try on WiFi instead of cellular
   - Large files may not load on slow connections
   - Check Safari > Settings > Downloads

3. **iOS Version:**
   - Check: Settings > General > About > iOS Version
   - Required: iOS 12+
   - Recommended: iOS 15+

4. **Clear Safari Cache:**
   ```
   Settings > Safari > Clear History and Website Data
   ```

5. **Try Different Browser:**
   - AR Quick Look only works in Safari on iOS
   - NOT Chrome, NOT Firefox
   - Must be Safari

---

## Common USDZ Issues & Fixes

### Issue: USDZ Not Valid

**Check validity:**
```bash
cd public/models
unzip -t sofa.usdz
```

**Should see:**
```
Archive:  sofa.usdz
    testing: model.usda               OK
    testing: textures/...             OK
No errors detected
```

### Issue: Wrong File Format

**USDZ Requirements:**
- Must be uncompressed ZIP
- Must contain .usd, .usda, or .usdc file at root
- Textures in subdirectories
- No encryption

**Fix compression:**
```bash
# Extract
unzip sofa.usdz -d sofa_extracted

# Recompress without compression
cd sofa_extracted
zip -0 -r ../sofa-fixed.usdz *

# Test
mv ../sofa-fixed.usdz ../sofa.usdz
```

### Issue: File Too Complex

**Check USD file size:**
```bash
unzip -l sofa.usdz
```

If model.usda is > 50MB, it's probably too complex.

**Fix:**
- Reduce polygon count in Blender
- Convert ASCII (.usda) to Binary (.usdc)
- Reduce texture resolution

---

## Testing Checklist

- [ ] Test page works: `http://localhost:3000/test-ar`
- [ ] Apple sample (teapot.usdz) loads in AR
- [ ] Using Safari on iPhone (not Chrome)
- [ ] iOS 15 or higher
- [ ] Camera permissions granted
- [ ] On stable WiFi network
- [ ] USDZ file < 50MB (recommended)
- [ ] File accessible: `http://YOUR_IP:3000/models/sofa.usdz`

---

## Debug Log

Check browser console on iPhone:
1. Safari > Settings > Advanced > Web Inspector: ON
2. Connect iPhone to Mac via USB
3. Mac Safari > Develop > [Your iPhone] > [Your Page]
4. Check Console for errors

---

## Quick Wins

### 1. Test with Smaller File
Download a working USDZ from Apple's gallery:
https://developer.apple.com/augmented-reality/quick-look/models/

### 2. Simplify Current Model

```python
# Python script to check USD file
import zipfile

with zipfile.ZipFile('public/models/sofa.usdz', 'r') as z:
    for info in z.filelist:
        print(f"{info.filename}: {info.file_size / 1024 / 1024:.2f} MB")
```

### 3. Use External Hosting

Upload USDZ to a CDN (Cloudflare, AWS S3) with:
- Proper content-type headers
- Fast download speeds
- No file size restrictions

Update ModelViewer:
```typescript
iosSrc="https://your-cdn.com/sofa.usdz"
```

---

## Still Not Working?

Create an issue with:
1. iPhone model and iOS version
2. Browser (must be Safari)
3. Network type (WiFi/Cellular)
4. Error message from console
5. Screenshot of test-ar page results
6. USDZ file size and structure (`unzip -l sofa.usdz`)

---

**Next Step:** Go to http://YOUR_IP:3000/test-ar and test!
