#!/bin/bash

# GLB to USDZ Conversion Script
# This script provides instructions for converting GLB to USDZ

echo "============================================"
echo "GLB to USDZ Conversion for iOS AR Support"
echo "============================================"
echo ""
echo "Your GLB file: public/models/sofa.glb (62MB)"
echo ""
echo "Option 1: Use Reality Converter (Mac App - Recommended)"
echo "  1. Download Reality Converter from Apple:"
echo "     https://developer.apple.com/augmented-reality/tools/"
echo "  2. Drag sofa.glb into Reality Converter"
echo "  3. Export as sofa.usdz to public/models/"
echo ""
echo "Option 2: Use Online Converter"
echo "  • Vectary: https://app.vectary.com/3d-modeling-blog/usdz-converter-convert-usdz-files-online-with-vectary/"
echo "  • iLove3DM: https://www.ilove3dm.com/glb-to-usdz"
echo "  • Meshy AI: https://www.meshy.ai/3d-tools/file-converter/glb/to/usdz"
echo ""
echo "After conversion, save the file as: public/models/sofa.usdz"
echo ""
echo "============================================"

# Check if Reality Converter is installed
if [ -d "/Applications/Reality Converter.app" ]; then
    echo ""
    echo "✓ Reality Converter detected!"
    echo "Opening Reality Converter..."
    open -a "Reality Converter" public/models/sofa.glb
else
    echo ""
    echo "Reality Converter not found. Please use an online converter."
    echo "Opening browser to online converter..."
    open "https://www.meshy.ai/3d-tools/file-converter/glb/to/usdz"
fi

