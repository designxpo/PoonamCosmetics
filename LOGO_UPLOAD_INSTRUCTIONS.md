# Logo Upload Instructions

## 📁 Where to Place Your Logo

Place your PNG logo file here:
```
/Users/scaletrix/Documents/Poonam_Cosmetics/public/images/branding/logo.png
```

## 📝 Steps to Upload Your Logo:

### Option 1: Using Finder (Easiest)
1. Open Finder
2. Navigate to: `Documents/Poonam_Cosmetics/public/images/branding/`
3. Drag and drop your logo PNG file
4. Rename it to: `logo.png`
5. Refresh your browser at http://localhost:3000

### Option 2: Using Terminal
```bash
# Copy your logo from Downloads (adjust path as needed)
cp ~/Downloads/your-logo.png /Users/scaletrix/Documents/Poonam_Cosmetics/public/images/branding/logo.png
```

### Option 3: Using VS Code
1. In VS Code, open the Explorer (left sidebar)
2. Navigate to: `public/images/branding/`
3. Right-click → "Reveal in Finder"
4. Copy your logo.png file there

## ✅ Requirements:

- **File name**: Must be exactly `logo.png`
- **Format**: PNG (transparent background recommended)
- **Recommended size**: 
  - Width: 400-800px
  - Height: 100-200px
  - Aspect ratio: 4:1 or similar
- **File size**: Keep under 500KB for fast loading

## 🔄 After Uploading:

The website will automatically use your logo once you:
1. Place the file at the correct location
2. Refresh your browser (Cmd + R or F5)
3. Hard refresh if needed (Cmd + Shift + R)

## 🎨 Current Logo Path:

The Header component is now configured to use:
```
/images/branding/logo.png
```

This maps to the file system path:
```
/Users/scaletrix/Documents/Poonam_Cosmetics/public/images/branding/logo.png
```

---

**Once you upload your logo.png file to the branding folder, it will automatically appear on your website!**
