import { motion } from "framer-motion";
import { Play, CheckCircle, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Module } from "../../lib/types";
import { useProgress } from "../../hooks/useProgress";

interface ModuleCardProps {
    module: Module;
    index: number;
    isSindicato?: boolean;
}

export const ModuleCard = ({ module, index, isSindicato = false }: ModuleCardProps) => {
    const navigate = useNavigate();
    const { progress } = useProgress();

    // Calculate completion percentage
    const completedLessons = module.lessons.filter(lesson => progress[lesson.id]).length;
    const totalLessons = module.lessons.length;
    const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    const handleClick = () => {
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
                group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer 
                transition-all duration-500
                ${isSindicato
                    ? "border-2 border-gold/50 hover:border-gold shadow-glow-gold animate-pulse-slow"
                    : "border border-white/5 hover:border-cyan/50"
                }
            `}
        >
            {/* Background Image */}
            <img
                src={module.coverImage}
                alt={module.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Enhanced Gradient Overlay for Better Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90" />

            {/* Sindicato Special Glow Effect */}
            {isSindicato && (
                <div className="absolute inset-0 bg-gradient-to-t from-gold/20 via-transparent to-transparent opacity-50" />
            )}

            {/* Completion Badge */}
            {completionPercentage === 100 && (
                <div className="absolute top-4 right-4 bg-gold/20 backdrop-blur-md border border-gold/50 rounded-full p-2 z-10">
                    <CheckCircle className="w-5 h-5 text-gold" />
                </div>
            )}

            {/* Sindicato Crown Badge */}
            {isSindicato && (
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
                    ${isSindicato ? "group-hover:text-gold" : "group-hover:text-cyan"}
                `}>
                    {module.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 drop-shadow-lg">{module.subtitle}</p>

                {/* Enhanced Progress Bar with Glow */}
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
            </div>

            {/* Play Icon Hover with Enhanced Glow */}
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

            {/* Hover Border Glow Effect */}
            <div className={`
                absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                ${isSindicato ? "shadow-[inset_0_0_30px_rgba(255,215,0,0.3)]" : "shadow-[inset_0_0_30px_rgba(0,174,239,0.3)]"}
            `} />
        </motion.div>
    );
};
