import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ChevronLeft, 
    ChevronRight, 
    ZoomIn, 
    ZoomOut, 
    FileText,
    Shield
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ============================================
// PDF.JS WORKER SETUP (CDN STRATEGY)
// ============================================
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`;

interface SecurePDFViewerProps {
    url: string;
    title: string;
}

// ============================================
// CUSTOM HOOK: RESPONSIVE CONTAINER WIDTH
// ============================================
const useContainerWidth = (ref: React.RefObject<HTMLDivElement>) => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        if (!ref.current) return;

        // Initial measurement
        const updateWidth = () => {
            if (ref.current) {
                setWidth(ref.current.offsetWidth);
            }
        };

        updateWidth();

        // ResizeObserver for dynamic updates
        const resizeObserver = new ResizeObserver(() => {
            updateWidth();
        });

        resizeObserver.observe(ref.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [ref]);

    return width;
};

// ============================================
// SECURE PDF VIEWER COMPONENT
// ============================================
export const SecurePDFViewer = ({ url, title }: SecurePDFViewerProps) => {
    const { user } = useAuth();
    
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const containerWidth = useContainerWidth(containerRef);
    
    // State
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [zoomMultiplier, setZoomMultiplier] = useState(1.0); // Manual zoom on top of responsive width
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ============================================
    // RESPONSIVE WIDTH CALCULATION
    // ============================================
    const getPageWidth = () => {
        if (!containerWidth) return undefined;

        // Mobile: Fit to container width with padding
        if (containerWidth < 600) {
            return (containerWidth - 32) * zoomMultiplier; // 32px = 16px padding on each side
        }

        // Desktop: Cap at reasonable max width
        const baseWidth = Math.min(containerWidth - 64, 800);
        return baseWidth * zoomMultiplier;
    };

    // ============================================
    // PDF LOAD HANDLERS
    // ============================================
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error("PDF Load Error:", error);
        setError("FALHA AO CARREGAR DOCUMENTO");
        setIsLoading(false);
    };

    // ============================================
    // NAVIGATION HANDLERS
    // ============================================
    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(numPages || 1, prev + 1));
    };

    const zoomIn = () => {
        setZoomMultiplier((prev) => Math.min(2.5, prev + 0.2));
    };

    const zoomOut = () => {
        setZoomMultiplier((prev) => Math.max(0.5, prev - 0.2));
    };

    // ============================================
    // SECURITY: PREVENT RIGHT CLICK & DRAG
    // ============================================
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    return (
        <div className="relative">
            {/* ============================================ */}
            {/* MAIN CONTAINER */}
            {/* ============================================ */}
            <div 
                className="relative bg-carbon/80 backdrop-blur-md border-2 border-cyan/30 rounded-xl overflow-hidden shadow-2xl shadow-cyan/20"
                onContextMenu={handleContextMenu}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan/10 via-cyan/5 to-transparent border-b border-cyan/20 px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="relative">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.1, 0.3],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 bg-cyan/20 blur-xl rounded-full"
                                />
                                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg bg-cyan/10 backdrop-blur-md border border-cyan/30 flex items-center justify-center">
                                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-cyan" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-white font-heading text-sm md:text-lg tracking-wide">
                                    {title}
                                </h3>
                                <p className="text-cyan/70 font-mono text-[10px] md:text-xs tracking-widest">
                                    DOCUMENTO CLASSIFICADO
                                </p>
                            </div>
                        </div>
                        
                        {/* Security Badge */}
                        <div className="flex items-center gap-1 md:gap-2 bg-cyan/10 backdrop-blur-md border border-cyan/30 rounded-lg px-2 md:px-3 py-1 md:py-1.5">
                            <Shield className="w-3 h-3 text-cyan" />
                            <span className="hidden md:inline text-cyan font-mono text-xs tracking-wider">
                                PROTEGIDO
                            </span>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* PDF VIEWER AREA */}
                {/* ============================================ */}
                <div 
                    ref={containerRef}
                    className="relative bg-void/50 min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-auto"
                    style={{ 
                        touchAction: 'pan-x pan-y',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {/* Loading State */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-void/80 backdrop-blur-sm"
                            >
                                {/* Radar Animation */}
                                <div className="relative w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-0 border-4 border-cyan rounded-full"
                                    />
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [0.5, 0, 0.5],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.5,
                                        }}
                                        className="absolute inset-0 border-4 border-cyan rounded-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <FileText className="w-10 h-10 md:w-12 md:h-12 text-cyan" />
                                    </div>
                                </div>

                                <motion.p
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-cyan font-mono text-xs md:text-sm tracking-widest"
                                >
                                    SCANNING DOCUMENT...
                                </motion.p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error State */}
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-void/80 backdrop-blur-sm px-4">
                            <div className="text-center">
                                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-alert/10 backdrop-blur-md border-2 border-alert/50 flex items-center justify-center">
                                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-alert" />
                                </div>
                                <h3 className="text-alert font-heading text-lg md:text-xl mb-2">
                                    {error}
                                </h3>
                                <p className="text-gray-400 font-mono text-xs">
                                    VERIFIQUE A CONEXÃO E TENTE NOVAMENTE
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ============================================ */}
                    {/* PDF DOCUMENT RENDERER */}
                    {/* ============================================ */}
                    <div className="relative py-4 md:py-8">
                        {/* Anti-Theft Transparent Overlay */}
                        <div 
                            className="absolute inset-0 z-10 cursor-default"
                            onContextMenu={handleContextMenu}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ userSelect: "none" }}
                        />

                        {/* User Watermark Overlay */}
                        {user?.email && (
                            <div 
                                className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
                                style={{ 
                                    opacity: 0.05,
                                    userSelect: "none",
                                }}
                            >
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="text-white font-mono text-[10px] md:text-xs transform rotate-[-45deg] whitespace-nowrap"
                                        style={{
                                            position: "absolute",
                                            top: `${(i * 8) % 100}%`,
                                            left: `${(i * 15) % 100}%`,
                                        }}
                                    >
                                        {user.email} • {user.email} • {user.email}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* PDF Page */}
                        <Document
                            file={url}
                            onLoadSuccess={onDocumentLoadSuccess}
                            onLoadError={onDocumentLoadError}
                            loading=""
                            error=""
                        >
                            <motion.div
                                key={pageNumber}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    width={getPageWidth()}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="shadow-2xl"
                                />
                            </motion.div>
                        </Document>
                    </div>
                </div>

                {/* ============================================ */}
                {/* CONTROL BAR (RESPONSIVE GLASSMORPHISM) */}
                {/* ============================================ */}
                {numPages && (
                    <div className="bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md border-t border-cyan/20 px-3 md:px-6 py-3 md:py-4">
                        <div className="flex items-center justify-between gap-2">
                            {/* Left: Navigation */}
                            <div className="flex items-center gap-1.5 md:gap-3">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    className="group flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-cyan/10 hover:bg-cyan/20 disabled:bg-white/5 border border-cyan/30 disabled:border-white/10 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                    aria-label="Página Anterior"
                                >
                                    <ChevronLeft className="w-4 h-4 text-cyan group-disabled:text-gray-600" />
                                    <span className="hidden md:inline text-cyan group-disabled:text-gray-600 font-mono text-sm tracking-wider">
                                        ANTERIOR
                                    </span>
                                </button>

                                <button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="group flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-cyan/10 hover:bg-cyan/20 disabled:bg-white/5 border border-cyan/30 disabled:border-white/10 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                    aria-label="Próxima Página"
                                >
                                    <span className="hidden md:inline text-cyan group-disabled:text-gray-600 font-mono text-sm tracking-wider">
                                        PRÓXIMA
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-cyan group-disabled:text-gray-600" />
                                </button>
                            </div>

                            {/* Center: Page Counter */}
                            <div className="bg-cyan/10 backdrop-blur-md border border-cyan/30 rounded-lg px-3 md:px-6 py-1.5 md:py-2">
                                <p className="text-cyan font-mono text-xs md:text-sm tracking-widest whitespace-nowrap">
                                    <span className="hidden md:inline">PÁGINA </span>
                                    <span className="text-white font-bold text-sm md:text-lg mx-0.5 md:mx-1">
                                        {pageNumber}
                                    </span>
                                    <span className="hidden md:inline"> DE </span>
                                    <span className="md:hidden">/</span>
                                    <span className="text-white font-bold text-sm md:text-lg mx-0.5 md:mx-1">
                                        {numPages}
                                    </span>
                                </p>
                            </div>

                            {/* Right: Zoom Controls */}
                            <div className="flex items-center gap-1.5 md:gap-3">
                                <button
                                    onClick={zoomOut}
                                    disabled={zoomMultiplier <= 0.5}
                                    className="group p-1.5 md:p-2 bg-cyan/10 hover:bg-cyan/20 disabled:bg-white/5 border border-cyan/30 disabled:border-white/10 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                    title="Diminuir Zoom"
                                    aria-label="Diminuir Zoom"
                                >
                                    <ZoomOut className="w-4 h-4 md:w-5 md:h-5 text-cyan group-disabled:text-gray-600" />
                                </button>

                                <div className="hidden md:flex bg-cyan/10 backdrop-blur-md border border-cyan/30 rounded-lg px-3 py-1">
                                    <span className="text-cyan font-mono text-sm">
                                        {Math.round(zoomMultiplier * 100)}%
                                    </span>
                                </div>

                                <button
                                    onClick={zoomIn}
                                    disabled={zoomMultiplier >= 2.5}
                                    className="group p-1.5 md:p-2 bg-cyan/10 hover:bg-cyan/20 disabled:bg-white/5 border border-cyan/30 disabled:border-white/10 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                    title="Aumentar Zoom"
                                    aria-label="Aumentar Zoom"
                                >
                                    <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-cyan group-disabled:text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ============================================ */}
            {/* SECURITY NOTICE BELOW */}
            {/* ============================================ */}
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-500 font-mono text-[10px] md:text-xs text-center px-4">
                <Shield className="w-3 h-3 flex-shrink-0" />
                <span className="break-all">
                    DOCUMENTO PROTEGIDO • ACESSO RESTRITO A{" "}
                    <span className="text-cyan">{user?.email}</span>
                </span>
            </div>
        </div>
    );
};
