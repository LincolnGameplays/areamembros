// ============================================
// SECURE PDF VIEWER - QUICK INTEGRATION SNIPPET
// ============================================

// 1. IMPORT THE COMPONENT
import { SecurePDFViewer } from "../components/modules/SecurePDFViewer";

// 2. USE IN YOUR LESSON VIEW (Already integrated in LessonView.tsx)
// The PDF viewer automatically renders when lesson.materials contains PDF files

// 3. EXAMPLE: Adding PDF to a Lesson in modules.ts
const exampleLesson = {
    id: "m1_l1",
    title: "O Manifesto Dark",
    duration: "03:12",
    videoUrl: "https://www.youtube.com/watch?v=...",
    description: "A filosofia por trás do Protocolo Dark",
    materials: [
        {
            title: "Manifesto Dark - PDF Completo",
            url: "https://example.com/manifesto.pdf",  // ← Your PDF URL
            type: "pdf"  // ← IMPORTANT: Set type to "pdf"
        },
        {
            title: "Checklist de Mindset",
            url: "https://example.com/checklist",
            type: "link"  // ← External links remain as before
        }
    ]
};

// 4. STANDALONE USAGE (if needed outside LessonView)
function MyCustomPage() {
    return (
        <div>
            <SecurePDFViewer
                url="https://example.com/document.pdf"
                title="My Classified Document"
            />
        </div>
    );
}

// ============================================
// SECURITY FEATURES INCLUDED
// ============================================
// ✅ Right-click disabled
// ✅ Drag prevention overlay
// ✅ User email watermark (5% opacity, repeated 20x)
// ✅ No download button exposed
// ✅ Canvas rendering (not iframe)

// ============================================
// CONTROLS PROVIDED
// ============================================
// ✅ Page navigation (Previous/Next)
// ✅ Zoom In/Out (60% - 200%)
// ✅ Page counter (PÁGINA X DE Y)
// ✅ Loading state with radar animation
// ✅ Error handling

// ============================================
// STYLING
// ============================================
// ✅ "Bunker" aesthetic with cyan accents
// ✅ Glassmorphism control bar
// ✅ Dark theme with borders and shadows
// ✅ Smooth animations via Framer Motion
// ✅ Responsive design

// ============================================
// NOTES
// ============================================
// - PDF.js worker loads automatically from CDN
// - User's email from AuthContext is used for watermark
// - PDFs render inline, not as downloads
// - Multiple PDFs in one lesson are supported
