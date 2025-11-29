import { useAuth } from "../context/AuthContext";
import { MODULES } from "../lib/modules";
import { ModuleCard } from "../components/modules/ModuleCard";
import { Sidebar } from "../components/layout/Sidebar";
import { LogOut, User, Play, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useProgress } from "../hooks/useProgress";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const { userData, logout } = useAuth();
    const { progress } = useProgress();
    const navigate = useNavigate();

    // Calculate global progress
    const totalLessons = MODULES.reduce((acc, module) => acc + module.lessons.length, 0);
    const completedLessons = Object.keys(progress).length;
    const globalProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Find last watched lesson (mock data for now)
    const lastLesson = {
        title: "Aula 02: A Matemática do Submundo",
        moduleTitle: "O BRIEFING",
        lessonId: "m1_l2"
    };

    // Check if module is "SINDICATO"
    const isSindicato = (moduleId: string) => moduleId === "sindicato";

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 min-h-screen pb-20">
                {/* Header */}
                <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 bg-cyan rounded-full animate-pulse" />
                            <h2 className="font-heading text-xl text-white tracking-widest">PROTOCOLO DARK</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                                <p className="text-white font-bold text-sm flex items-center gap-2">
                                    <User className="w-4 h-4 text-cyan" />
                                    {userData?.displayName || "OPERADOR"}
                                </p>
                                <p className="text-xs text-cyan font-mono">
                                    NÍVEL: {userData?.accessLevel?.toUpperCase() || "PADRÃO"}
                                </p>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="text-gray-500 hover:text-alert transition-colors flex items-center gap-2 font-mono text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">LOGOUT</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 pt-12">
                    {/* Mission Status Panel */}
                    <motion.section
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        {/* Greeting */}
                        <h1 className="font-heading text-4xl md:text-6xl text-white mb-2 tracking-tight">
                            OLÁ, OPERADOR{" "}
                            <span className="text-cyan">
                                {userData?.displayName?.toUpperCase() || ""}
                            </span>
                            .
                        </h1>
                        <p className="text-gray-400 font-mono text-sm mb-8">
                            SISTEMA OPERACIONAL ONLINE. STATUS: ATIVO.
                        </p>

                        {/* Global Progress Bar */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-cyan" />
                                    <span className="text-white font-mono text-sm tracking-wide">
                                        PROGRESSO GLOBAL
                                    </span>
                                </div>
                                <span className="text-cyan font-heading text-2xl">{globalProgress}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan via-[#00D9A3] to-[#00FF88] shadow-glow-cyan"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${globalProgress}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 font-mono mt-2">
                                {completedLessons} de {totalLessons} aulas concluídas
                            </p>
                        </div>

                        {/* Continue Where You Left Off Card */}
                        {completedLessons > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => navigate(`/lesson/${lastLesson.lessonId}`)}
                                className="group relative overflow-hidden rounded-2xl border border-cyan/30 bg-gradient-to-br from-cyan/10 via-carbon to-carbon p-8 cursor-pointer hover:border-cyan/60 transition-all duration-500 hover:shadow-glow-cyan"
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,174,239,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-scanline" />
                                </div>

                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <p className="text-cyan font-mono text-xs tracking-widest mb-2">
                                            CONTINUAR DE ONDE PAROU
                                        </p>
                                        <h3 className="font-heading text-3xl md:text-4xl text-white mb-1 group-hover:text-cyan transition-colors">
                                            {lastLesson.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-mono">
                                            {lastLesson.moduleTitle}
                                        </p>
                                    </div>
                                    <div className="w-16 h-16 rounded-full bg-cyan/20 backdrop-blur-md border border-cyan/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-8 h-8 text-cyan fill-cyan" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.section>

                    {/* Section Title */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-8"
                    >
                        <h2 className="font-heading text-2xl text-white tracking-wide mb-2">
                            MÓDULOS DISPONÍVEIS
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-cyan to-transparent rounded-full" />
                    </motion.div>

                    {/* Module Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MODULES.map((module, index) => (
                            <ModuleCard
                                key={module.id}
                                module={module}
                                index={index}
                                isSindicato={isSindicato(module.id)}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};
