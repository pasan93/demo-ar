# AR Furniture Viewer

A modern web application for viewing furniture in 3D and Augmented Reality, built with Next.js and Google's model-viewer.

## ✨ Features

- 🎯 **Cross-Platform AR Support**
  - iOS: Native AR Quick Look (requires USDZ)
  - Android: Scene Viewer with ARCore
  - Desktop: Interactive 3D viewer

- 📱 **Mobile-Optimized**
  - Touch gestures for rotation and zoom
  - Responsive design
  - Camera integration for AR

- 🎨 **Modern UI**
  - Clean, minimalist design
  - Feather icons
  - White background with black elements (Kiwi vibe)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser (Chrome, Safari, Firefox)
- For AR: Mobile device with ARCore (Android) or iOS 15+

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Testing AR

### On iOS (iPhone/iPad)
1. Open the site in Safari
2. Tap the "🎯 View in AR" button
3. Allow camera permissions
4. Point at a flat surface
5. Tap to place the furniture

### On Android
1. Open the site in Chrome
2. Ensure ARCore is installed
3. Tap the "🎯 View in AR" button
4. Allow camera permissions
5. Point at a flat surface
6. Tap to place the furniture

### On Desktop
- Use mouse to rotate and zoom the 3D model
- Open on mobile for full AR experience

## 📂 Project Structure

```
ar-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Home page with model viewer
│   │   ├── viewer/
│   │   │   └── page.tsx      # Full-screen 3D viewer
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── ModelViewer.tsx   # Google model-viewer wrapper
│   └── lib/
│       └── sofa-data.ts      # Product data
├── public/
│   ├── models/
│   │   ├── sofa.glb          # 3D model (22MB compressed)
│   │   └── sofa.usdz         # iOS AR model (30MB compressed)
│   └── images/
│       └── sofa-thumbnail.jpg
└── scripts/
    └── convert-to-usdz.sh    # Conversion helper script
```

## 🔄 Converting GLB to USDZ

For iOS AR support, you need to convert the GLB model to USDZ format:

### Option 1: Using Reality Converter (Mac - Recommended)
1. Download [Reality Converter](https://developer.apple.com/augmented-reality/tools/) from Apple
2. Open the app and drag `public/models/sofa.glb` into it
3. Export as `sofa.usdz` to `public/models/`

### Option 2: Using Online Converters
Run the conversion script which will open an online converter:
```bash
./scripts/convert-to-usdz.sh
```

Or manually visit:
- [Meshy AI Converter](https://www.meshy.ai/3d-tools/file-converter/glb/to/usdz)
- [iLove3DM](https://www.ilove3dm.com/glb-to-usdz)
- [Vectary](https://app.vectary.com/3d-modeling-blog/usdz-converter-convert-usdz-files-online-with-vectary/)

After conversion, save the file as `public/models/sofa.usdz`.

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **3D/AR:** @google/model-viewer
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Deployment:** Vercel/Netlify ready

## 📋 Browser Support

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| 3D Viewer | ✅ | ✅ | ✅ | ✅ |
| AR (Mobile) | ✅ Android | ✅ iOS 15+ | ❌ | ✅ Android |

## 🔧 Configuration

### Adding New Models

1. Add your GLB file to `public/models/`
2. Convert to USDZ for iOS support
3. Update `src/lib/sofa-data.ts`:

```typescript
export const sofa: Sofa = {
  id: "your-model-id",
  name: "Your Model Name",
  price: 1299,
  dimensions: { width: 210, depth: 90, height: 85 },
  modelPath: "/models/your-model.glb",
  thumbnail: "/images/your-thumbnail.jpg",
  description: "Your model description",
  material: "Material type",
};
```

## 🚨 Important Notes

- **HTTPS Required:** AR features require HTTPS or localhost
- **File Size:** The GLB model is 62MB. Consider optimizing or using Git LFS
- **Mobile Required:** AR features only work on mobile devices
- **Camera Permissions:** Users must grant camera access for AR

## 🌐 Deployment

### 3D Model Hosting
The 3D models are served via **GitHub Raw URLs** to work around Vercel's Git LFS limitations. This ensures:
- ✅ Fast loading on all platforms
- ✅ No additional storage costs
- ✅ Automatic HTTPS and CORS headers
- ✅ Reliable CDN distribution

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
.next
```

**Note:** Ensure HTTPS is enabled for AR features to work.

## 📝 Development Notes

- Model-viewer is loaded client-side only (SSR disabled)
- Dynamic imports prevent server-side rendering issues
- AR modes: `webxr scene-viewer quick-look`
- Auto-rotation enabled by default

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both iOS and Android if modifying AR features
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own furniture AR applications.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [model-viewer Documentation](https://modelviewer.dev)
- [AR Quick Look (iOS)](https://developer.apple.com/augmented-reality/quick-look/)
- [Scene Viewer (Android)](https://developers.google.com/ar/develop/scene-viewer)

## 🐛 Troubleshooting

### AR not working on iOS
- Ensure you're using Safari browser
- Check that the USDZ file exists in `public/models/`
- Verify iOS version is 15 or higher
- Allow camera permissions when prompted

### AR not working on Android
- Ensure Chrome browser is up to date
- Check that ARCore is installed and updated
- Allow camera permissions when prompted

### 3D model not loading
- Check browser console for errors
- Verify GLB file path is correct
- Ensure file size isn't causing timeout issues

---

Built with ❤️ using Next.js and model-viewer
