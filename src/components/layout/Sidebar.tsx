import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, BarChart3, Users, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
    id: string;
    label: string;
    icon: React.ElementType;
    path: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "progress", label: "Progresso", icon: BarChart3, path: "/progress" },
    { id: "community", label: "Comunidade", icon: Users, path: "/community" },
    { id: "settings", label: "Configurações", icon: Settings, path: "/settings" },
];

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleExpanded = () => setIsExpanded(!isExpanded);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMobile}
                className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg bg-carbon/95 backdrop-blur-md border border-white/5 flex items-center justify-center text-white hover:border-cyan/50 transition-colors"
            >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleMobile}
                        className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isMobileOpen ? "280px" : isExpanded ? "280px" : "80px",
                    x: isMobileOpen ? 0 : 0,
                }}
                className={`
                    fixed left-0 top-0 h-screen bg-[#050505]/95 backdrop-blur-md border-r border-white/5 z-50
                    transition-all duration-300 ease-in-out
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                        <AnimatePresence mode="wait">
                            {(isExpanded || isMobileOpen) ? (
                                <motion.div
                                    key="expanded"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                                    <span className="font-heading text-lg text-white tracking-widest">
                                        PROTOCOLO
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="collapsed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-2 h-2 bg-cyan rounded-full animate-pulse mx-auto"
                                />
                            )}
                        </AnimatePresence>

                        {/* Desktop Toggle Button */}
                        <button
                            onClick={toggleExpanded}
                            className="hidden md:flex w-6 h-6 items-center justify-center text-gray-500 hover:text-cyan transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronLeft className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 py-8 px-4 space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.path)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        w-full flex items-center gap-4 px-4 py-3 rounded-lg
                                        transition-all duration-300 group relative overflow-hidden
                                        ${isActive
                                            ? "bg-cyan/10 border border-cyan/30 text-cyan"
                                            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        }
                                    `}
                                >
                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-cyan rounded-r-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-cyan" : ""}`} />

                                    {/* Label */}
                                    <AnimatePresence mode="wait">
                                        {(isExpanded || isMobileOpen) && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="font-mono text-sm tracking-wide whitespace-nowrap"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5">
                        <div className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5
                            ${(isExpanded || isMobileOpen) ? "justify-start" : "justify-center"}
                        `}>
                            <div className="w-2 h-2 bg-gold rounded-full animate-pulse-slow" />
                            <AnimatePresence mode="wait">
                                {(isExpanded || isMobileOpen) && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-xs text-gray-500 font-mono"
                                    >
                                        SISTEMA ONLINE
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Spacer for Desktop */}
            <div className={`hidden md:block transition-all duration-300 ${isExpanded ? "w-[280px]" : "w-[80px]"}`} />
        </>
    );
};
