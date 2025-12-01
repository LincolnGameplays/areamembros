# 📄 SECURE PDF VIEWER INTEGRATION GUIDE

## 🎯 OVERVIEW

The **SecurePDFViewer** component provides a secure, immersive PDF viewing experience with the "Classified Document Terminal" aesthetic for the Protocolo Dark Member Area.

---

## 📦 INSTALLATION

### Step 1: Install react-pdf Library

```bash
npm install react-pdf
```

### Step 2: Install PDF.js Worker (Automatic via CDN)

The component automatically loads the PDF.js worker from CDN:

```javascript
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

---

## 🔐 SECURITY FEATURES

### 1. **Anti-Theft Layer**

- ✅ **Right-Click Disabled**: `onContextMenu={(e) => e.preventDefault()}`
- ✅ **Drag Prevention**: Transparent overlay intercepts drag attempts
- ✅ **User Selection Disabled**: `userSelect: "none"`

### 2. **User Watermark**

- User's email is overlaid across the document at **5% opacity**
- Repeated 20 times in diagonal pattern
- Discourages unauthorized sharing/leaking

### 3. **No Download Button**

- PDF is rendered as Canvas (not embedded iframe)
- No native browser download controls exposed

---

## 🎨 VISUAL DESIGN ("BUNKER" STYLE)

### Container

- Dark border with **cyan/30** accent
- Rounded corners (`rounded-xl`)
- Inner shadow with cyan glow
- Glassmorphism backdrop blur

### Loading State

- **"Scanning Document..."** radar animation
- Pulsing cyan circles
- FileText icon in center

### Control Bar (Glassmorphism)

- Gradient background: `from-black/90 via-black/70 to-transparent`
- Backdrop blur effect
- Cyan-themed buttons and indicators

---

## 📋 COMPONENT API

### Props

```typescript
interface SecurePDFViewerProps {
  url: string; // PDF file URL
  title: string; // Document title
}
```

### Example Usage

```tsx
import { SecurePDFViewer } from "../components/modules/SecurePDFViewer";

<SecurePDFViewer
  url="https://example.com/manifesto.pdf"
  title="Manifesto Dark - PDF Completo"
/>;
```

---

## 🎮 CONTROLS

### Navigation

- **< ANTERIOR**: Go to previous page (disabled on page 1)
- **PRÓXIMA >**: Go to next page (disabled on last page)

### Zoom

- **Zoom In** (+): Increase scale up to 200%
- **Zoom Out** (-): Decrease scale down to 60%
- **Current Zoom**: Displayed as percentage (e.g., "100%")

### Page Counter

- **PÁGINA X DE Y**: Shows current page and total pages

---

## 🔗 INTEGRATION IN LESSONVIEW

The PDF viewer is automatically integrated when a lesson contains PDF materials:

```tsx
{
  /* INLINE PDF VIEWER SECTION */
}
{
  lesson.materials &&
    lesson.materials.some((m) => m.type === "pdf") &&
    !isSpecialLesson && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        {lesson.materials
          .filter((material) => material.type === "pdf")
          .map((material, index) => (
            <div key={index} className="mb-8 last:mb-0">
              <SecurePDFViewer url={material.url} title={material.title} />
            </div>
          ))}
      </motion.div>
    );
}
```

---

## 📝 ADDING PDF MATERIALS TO LESSONS

Update `src/lib/modules.ts`:

```typescript
{
    id: "m1_l1",
    title: "O Manifesto Dark",
    duration: "03:12",
    videoUrl: "https://www.youtube.com/watch?v=...",
    materials: [
        {
            title: "Manifesto Dark - PDF Completo",
            url: "https://example.com/manifesto.pdf",  // ← PDF URL
            type: "pdf"  // ← Important: Set type to "pdf"
        },
        {
            title: "Checklist de Mindset",
            url: "https://example.com/checklist",
            type: "link"  // ← External link (not PDF)
        }
    ]
}
```

---

## 🎯 FEATURES CHECKLIST

- ✅ PDF rendering via Canvas (react-pdf)
- ✅ Page navigation (Previous/Next)
- ✅ Zoom controls (60% - 200%)
- ✅ Loading state with radar animation
- ✅ Error handling with user-friendly message
- ✅ Right-click protection
- ✅ Drag prevention overlay
- ✅ User email watermark (5% opacity)
- ✅ Glassmorphism control bar
- ✅ Tactical cyan theme
- ✅ Responsive design
- ✅ Smooth page transitions (Framer Motion)
- ✅ Security badge indicator

---

## 🚨 TROUBLESHOOTING

### Issue: "Cannot find module 'react-pdf'"

**Solution**: Run `npm install react-pdf`

### Issue: PDF not loading

**Solution**:

1. Check if the PDF URL is accessible
2. Verify CORS headers allow cross-origin requests
3. Check browser console for errors

### Issue: Worker not loading

**Solution**: The component uses CDN worker automatically. If issues persist, check internet connection.

---

## 🎬 DEMO

When a user opens a lesson with PDF materials:

1. Video player appears at the top
2. Lesson description below (if available)
3. **PDF viewer renders inline** with full controls
4. User can navigate, zoom, and read the document
5. Watermark protects against unauthorized sharing

---

## 🔒 SECURITY NOTES

⚠️ **Important**: While this component adds friction to downloading/sharing:

- Determined users can still screenshot or use browser dev tools
- For maximum security, consider:
  - Server-side PDF watermarking
  - DRM-protected PDFs
  - Time-limited signed URLs
  - IP-based access restrictions

This component is designed to **discourage casual sharing**, not prevent sophisticated attacks.

---

## 📚 REFERENCES

- [react-pdf Documentation](https://github.com/wojtekmaj/react-pdf)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**STATUS**: ✅ READY FOR DEPLOYMENT
