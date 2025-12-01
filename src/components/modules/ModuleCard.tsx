import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, CheckCircle, Crown, Lock, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Module } from "../../lib/types";
import { useProgress } from "../../hooks/useProgress";
import { useAuth } from "../../context/AuthContext";

interface ModuleCardProps {
    module: Module;
    index: number;
    isSindicato?: boolean;
}

export const ModuleCard = ({ module, index, isSindicato = false }: ModuleCardProps) => {
    const navigate = useNavigate();
    const { progress } = useProgress();
    const { userData } = useAuth();
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [jitterOffset, setJitterOffset] = useState(0);

    // Calculate completion percentage
    const completedLessons = module.lessons.filter(lesson => progress[lesson.id]).length;
    const totalLessons = module.lessons.length;
    const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    // DRIP CONTENT LOGIC
    const calculateTimeRemaining = (): number => {
        if (!userData?.createdAt) return 0;
        
        // Handle Firebase Timestamp
        const createdAtDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
        const now = new Date();

        // Check hour-based lock first
        if (module.releaseDelayHours) {
            const unlockTime = new Date(createdAtDate.getTime() + module.releaseDelayHours * 60 * 60 * 1000);
            const remaining = unlockTime.getTime() - now.getTime();
            return Math.max(0, remaining);
        }

        // Fall back to day-based lock
        const diffTime = Math.abs(now.getTime() - createdAtDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysUntilUnlock = module.releaseDelayDays - diffDays;
        
        if (daysUntilUnlock > 0) {
            return daysUntilUnlock * 24 * 60 * 60 * 1000; // Convert to milliseconds
        }
        
        return 0;
    };

    // Live countdown timer
    useEffect(() => {
        if (module.releaseDelayHours) {
            const updateTimer = () => {
                setTimeRemaining(calculateTimeRemaining());
            };

            updateTimer();
            const interval = setInterval(updateTimer, 1000); // Update every second

            return () => clearInterval(interval);
        }
    }, [module.releaseDelayHours, userData]);

    // Jitter effect for countdown
    useEffect(() => {
        if (isLocked && module.releaseDelayHours) {
            const jitterInterval = setInterval(() => {
                setJitterOffset(Math.random() * 4 - 2); // Random offset between -2 and 2
            }, 3000); // Jitter every 3 seconds

            return () => clearInterval(jitterInterval);
        }
    }, [module.releaseDelayHours]);

    const isLocked = timeRemaining > 0 || calculateTimeRemaining() > 0;

    // Format time remaining for display
    const formatTimeRemaining = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleClick = () => {
        if (isLocked) return; // Prevent navigation if locked
        
        if (module.lessons.length > 0) {
            navigate(`/lesson/${module.lessons[0].id}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={handleClick}
            className={`
                group relative aspect-[2/3] rounded-xl overflow-hidden 
                transition-all duration-500
                ${isLocked 
                    ? "cursor-not-allowed opacity-70" 
                    : "cursor-pointer"
                }
                ${isSindicato
                    ? "border-2 border-gold/50 hover:border-gold shadow-glow-gold animate-pulse-slow"
                    : isLocked
                        ? "border-2 border-alert/30"
                        : "border border-white/5 hover:border-cyan/50"
                }
            `}
        >
            {/* Background Image */}
            <img
                src={module.coverImage}
                alt={module.title}
                className={`
                    absolute inset-0 w-full h-full object-cover transition-all duration-700
                    ${isLocked 
                        ? "grayscale blur-[2px] group-hover:scale-100" 
                        : "group-hover:scale-105"
                    }
                `}
            />

            {/* Enhanced Gradient Overlay for Better Readability */}
            <div className={`
                absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent 
                ${isLocked ? "opacity-95" : "opacity-90"}
            `} />

            {/* Heavy Noise Overlay for Locked State */}
            {isLocked && (
                <div className="absolute inset-0 opacity-30">
                    <div 
                        className="absolute inset-0 bg-repeat"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                            backgroundSize: '200px 200px',
                        }}
                    />
                </div>
            )}

            {/* Sindicato Special Glow Effect */}
            {isSindicato && !isLocked && (
                <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent opacity-50" />
            )}

            {/* LOCKED STATE OVERLAY */}
            {isLocked && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="text-center"
                    >
                        {/* Padlock Icon */}
                        <div className="mb-6 relative">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.1, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 bg-alert/20 blur-2xl rounded-full"
                            />
                            <div className="relative w-20 h-20 mx-auto rounded-full bg-alert/10 backdrop-blur-md border-2 border-alert/50 flex items-center justify-center">
                                <Lock className="w-10 h-10 text-alert" />
                            </div>
                        </div>

                        {/* Live Countdown Timer (for hour-based locks) */}
                        {module.releaseDelayHours ? (
                            <div className="bg-alert/10 backdrop-blur-md border-2 border-alert/50 rounded-lg px-8 py-4 mb-2">
                                <div className="flex items-center gap-2 justify-center mb-2">
                                    <Clock className="w-5 h-5 text-alert" />
                                    <p className="text-alert font-heading text-sm tracking-widest">
                                        DESBLOQUEIO EM
                                    </p>
                                </div>
                                
                                {/* HH:MM:SS Countdown */}
                                <motion.div
                                    animate={{
                                        x: jitterOffset,
                                    }}
                                    transition={{
                                        duration: 0.1,
                                    }}
                                    className="font-mono text-5xl text-white tracking-wider"
                                    style={{
                                        textShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)',
                                        fontVariantNumeric: 'tabular-nums'
                                    }}
                                >
                                    {formatTimeRemaining(timeRemaining)}
                                </motion.div>

                                {/* Glitch effect on numbers */}
                                <motion.div
                                    animate={{
                                        opacity: [0, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 2.8,
                                    }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="font-mono text-5xl text-cyan tracking-wider" style={{ mixBlendMode: 'screen' }}>
                                        {formatTimeRemaining(timeRemaining)}
                                    </div>
                                </motion.div>
                            </div>
                        ) : (
                            /* Day-based countdown */
                            <div className="bg-alert/10 backdrop-blur-md border-2 border-alert/50 rounded-lg px-6 py-3 mb-2">
                                <div className="flex items-center gap-2 justify-center mb-1">
                                    <Clock className="w-4 h-4 text-alert" />
                                    <p className="text-alert font-heading text-sm tracking-widest">
                                        LIBERADO EM
                                    </p>
                                </div>
                                <p className="text-white font-heading text-3xl">
                                    {Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))} DIAS
                                </p>
                            </div>
                        )}
                        
                        <p className="text-gray-400 font-mono text-xs mt-3">
                            ACESSO RESTRITO
                        </p>
                    </motion.div>
                </div>
            )}

            {/* Completion Badge */}
            {completionPercentage === 100 && !isLocked && (
                <div className="absolute top-4 right-4 bg-gold/20 backdrop-blur-md border border-gold/50 rounded-full p-2 z-10">
                    <CheckCircle className="w-5 h-5 text-gold" />
                </div>
            )}

            {/* Sindicato Crown Badge */}
            {isSindicato && !isLocked && (
                <div className="absolute top-4 left-4 bg-gold/20 backdrop-blur-md border border-gold/50 rounded-full p-2 z-10">
                    <Crown className="w-5 h-5 text-gold" />
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                <p className={`font-mono text-xs tracking-widest mb-2 ${isSindicato ? "text-gold" : "text-cyan"}`}>
                    {isSindicato ? "EXCLUSIVO" : `MÓDULO ${String(index + 1).padStart(2, '0')}`}
                </p>
                <h3 className={`
                    font-heading text-3xl text-white mb-1 transition-colors duration-300
                    ${isSindicato && !isLocked ? "group-hover:text-gold" : !isLocked ? "group-hover:text-cyan" : ""}
                `}>
                    {module.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 drop-shadow-lg">{module.subtitle}</p>

                {/* Enhanced Progress Bar with Glow (or Countdown for locked hour-based) */}
                {!isLocked && (
                    <>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            <motion.div
                                className={`
                                    h-full 
                                    ${isSindicato
                                        ? "bg-gradient-to-r from-gold via-yellow-400 to-gold shadow-glow-gold"
                                        : "bg-gradient-to-r from-[#00FF88] via-cyan to-[#00D9A3] shadow-glow-cyan"
                                    }
                                `}
                                initial={{ width: 0 }}
                                animate={{ width: `${completionPercentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                            />
                        </div>

                        <p className="text-xs text-gray-400 font-mono mt-2 drop-shadow-md">
                            {completedLessons}/{totalLessons} AULAS CONCLUÍDAS
                        </p>
                    </>
                )}
            </div>

            {/* Play Icon Hover with Enhanced Glow */}
            {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className={`
                        w-16 h-16 rounded-full backdrop-blur-md border flex items-center justify-center
                        ${isSindicato
                            ? "bg-gold/20 border-gold/50 shadow-glow-gold"
                            : "bg-cyan/20 border-cyan/50 shadow-glow-cyan"
                        }
                    `}>
                        <Play className={`w-8 h-8 ${isSindicato ? "text-gold fill-gold" : "text-cyan fill-cyan"}`} />
                    </div>
                </div>
            )}

            {/* Hover Border Glow Effect */}
            {!isLocked && (
                <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    ${isSindicato ? "shadow-[inset_0_0_30px_rgba(255,215,0,0.3)]" : "shadow-[inset_0_0_30px_rgba(0,174,239,0.3)]"}
                `} />
            )}
        </motion.div>
    );
};
