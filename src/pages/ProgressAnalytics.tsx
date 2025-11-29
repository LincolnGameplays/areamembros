import { motion } from "framer-motion";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../hooks/useProgress";
import { MODULES } from "../lib/modules";
import { TrendingUp, Clock, Award, Flame, Target, Trophy } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock activity data for the chart
const mockActivityData = [
    { day: "Seg", lessons: 2 },
    { day: "Ter", lessons: 3 },
    { day: "Qua", lessons: 1 },
    { day: "Qui", lessons: 4 },
    { day: "Sex", lessons: 2 },
    { day: "Sáb", lessons: 0 },
    { day: "Dom", lessons: 1 },
];

export const ProgressAnalytics = () => {
    const { userData } = useAuth();
    const { calculateGlobalProgress, getCompletedCount, getTotalLessonsCount } = useProgress();

    const globalProgress = calculateGlobalProgress();
    const completedLessons = getCompletedCount();
    const totalLessons = getTotalLessonsCount();

    // Calculate mock stats
    const modulesUnlocked = MODULES.length;
    const currentStreak = 5; // Mock data
    const hoursWatched = Math.round(completedLessons * 0.25); // Mock: ~15min per lesson

    // Circular progress calculation
    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (globalProgress / 100) * circumference;

    return (
        <div className="min-h-screen flex">
            <Sidebar />

            <div className="flex-1 min-h-screen pb-20">
                {/* Header */}
                <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-cyan" />
                            <h1 className="font-heading text-2xl text-white tracking-widest">DATA CENTER</h1>
                        </div>
                        <p className="text-gray-400 font-mono text-xs mt-1">
                            ANÁLISE DE PERFORMANCE // OPERADOR: {userData?.displayName?.toUpperCase() || "DESCONHECIDO"}
                        </p>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 pt-12">
                    {/* Hero Stat - Circular Progress */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 flex justify-center"
                    >
                        <div className="relative">
                            {/* SVG Circular Progress */}
                            <svg className="transform -rotate-90" width="200" height="200">
                                {/* Background Circle */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    stroke="rgba(255, 255, 255, 0.1)"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                {/* Progress Circle */}
                                <motion.circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    stroke="url(#goldGradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    initial={{ strokeDashoffset: circumference }}
                                    animate={{ strokeDashoffset }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                />
                                <defs>
                                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FFD700" />
                                        <stop offset="100%" stopColor="#FFA500" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Trophy className="w-8 h-8 text-gold mb-2" />
                                <p className="text-5xl font-heading text-white">{globalProgress}%</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">CONCLUSÃO GLOBAL</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Grid Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Hours Watched */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-cyan/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-cyan" />
                                </div>
                                <p className="text-gray-400 font-mono text-sm">HORAS ASSISTIDAS</p>
                            </div>
                            <p className="text-4xl font-heading text-white">{hoursWatched}h</p>
                            <p className="text-xs text-gray-500 font-mono mt-2">
                                {completedLessons}/{totalLessons} aulas concluídas
                            </p>
                        </motion.div>

                        {/* Modules Unlocked */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-gold/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-gold" />
                                </div>
                                <p className="text-gray-400 font-mono text-sm">MÓDULOS DESBLOQUEADOS</p>
                            </div>
                            <p className="text-4xl font-heading text-white">{modulesUnlocked}</p>
                            <p className="text-xs text-gray-500 font-mono mt-2">
                                Acesso total ao arsenal
                            </p>
                        </motion.div>

                        {/* Current Streak */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 hover:border-alert/30 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-alert/10 border border-alert/30 flex items-center justify-center">
                                    <Flame className="w-5 h-5 text-alert" />
                                </div>
                                <p className="text-gray-400 font-mono text-sm">SEQUÊNCIA ATUAL</p>
                            </div>
                            <p className="text-4xl font-heading text-white">{currentStreak}</p>
                            <p className="text-xs text-gray-500 font-mono mt-2">
                                Dias consecutivos
                            </p>
                        </motion.div>
                    </div>

                    {/* Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6 mb-12"
                    >
                        <h3 className="text-white font-heading text-xl mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan" />
                            ATIVIDADE SEMANAL
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={mockActivityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="day"
                                    stroke="#666"
                                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                                <YAxis
                                    stroke="#666"
                                    style={{ fontSize: '12px', fontFamily: 'monospace' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid rgba(0, 174, 239, 0.3)',
                                        borderRadius: '8px',
                                        fontFamily: 'monospace',
                                    }}
                                    labelStyle={{ color: '#00AEEF' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="lessons"
                                    stroke="#00AEEF"
                                    strokeWidth={3}
                                    dot={{ fill: '#00AEEF', r: 5 }}
                                    activeDot={{ r: 8, fill: '#FFD700' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Certificates Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-xl p-6"
                    >
                        <h3 className="text-white font-heading text-xl mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-gold" />
                            CERTIFICADOS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MODULES.map((module) => {
                                const isUnlocked = globalProgress === 100;
                                return (
                                    <div
                                        key={module.id}
                                        className={`
                                            p-4 rounded-lg border transition-all
                                            ${isUnlocked
                                                ? "bg-gold/5 border-gold/30 hover:border-gold/50"
                                                : "bg-white/5 border-white/10 opacity-50"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isUnlocked ? (
                                                <Award className="w-6 h-6 text-gold" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20" />
                                            )}
                                            <div>
                                                <p className="text-white font-mono text-sm">{module.title}</p>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    {isUnlocked ? "DESBLOQUEADO" : "BLOQUEADO"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
};
