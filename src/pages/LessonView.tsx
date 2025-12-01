import { useParams, useNavigate } from "react-router-dom";
import { findLessonById, MODULES } from "../lib/modules";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { SecurePDFViewer } from "../components/modules/SecurePDFViewer";
import { ArrowLeft, ArrowRight, Home, FileText, ExternalLink, Download, Radio, Shield, Lock } from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { useProgress } from "../hooks/useProgress";

export const LessonView = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();
    const { progress } = useProgress();

    if (!lessonId) {
        return <div className="text-white text-center mt-20">Aula não encontrada</div>;
    }

    const result = findLessonById(lessonId);

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-white font-heading text-2xl mb-4">AULA NÃO ENCONTRADA</h2>
                    <Button onClick={() => navigate("/dashboard")}>
                        VOLTAR AO QG
                    </Button>
                </div>
            </div>
        );
    }

    const { lesson, module } = result;
    const currentIndex = module.lessons.findIndex(l => l.id === lessonId);
    const prevLesson = currentIndex > 0 ? module.lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < module.lessons.length - 1 ? module.lessons[currentIndex + 1] : null;

    // Check if this is a special lesson (Sindicato WhatsApp Access)
    const isSpecialLesson = lesson.isSpecial && lesson.specialType === "whatsapp-access";

    // Check if video is coming soon
    const isComingSoon = !lesson.videoUrl && !isSpecialLesson;

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-gray-400 hover:text-cyan transition-colors font-mono text-sm"
                    >
                        <Home className="w-4 h-4" />
                        VOLTAR AO QG
                    </button>
                    <div className="text-center">
                        <p className="text-cyan font-mono text-xs tracking-widest">{module.title}</p>
                        <p className="text-white font-heading text-sm">{lesson.title}</p>
                    </div>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 md:px-6 pt-12">
                {/* SPECIAL SINDICATO VIEW */}
                {isSpecialLesson ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Access Terminal */}
                        <div className="relative overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 via-carbon to-carbon p-12 text-center">
                            {/* Animated Background */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,215,0,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-scanline" />
                            </div>

                            {/* Pulsing Glow */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.1, 0.3],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute inset-0 bg-gold/10 blur-3xl"
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8 flex justify-center"
                                >
                                    <div className="relative">
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0.2, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
                                        />
                                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-yellow-600/20 backdrop-blur-md border-2 border-gold/50 flex items-center justify-center">
                                            <Shield className="w-12 h-12 text-gold" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Headline */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="font-heading text-5xl md:text-7xl text-white mb-4 tracking-tight"
                                >
                                    REDE CRIPTOGRAFADA
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-gray-400 font-mono text-sm md:text-base max-w-2xl mx-auto mb-12"
                                >
                                    {lesson.description || "Acesso exclusivo à comunidade de operadores de elite"}
                                </motion.p>

                                {/* WhatsApp Access Button */}
                                <motion.a
                                    href={lesson.specialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative inline-flex items-center justify-center gap-4 bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-heading text-2xl md:text-3xl px-16 py-7 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.6)] hover:shadow-[0_0_60px_rgba(34,197,94,0.8)] transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Animated Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a] to-[#22c55e] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* WhatsApp Icon */}
                                    <svg 
                                        className="w-10 h-10 md:w-12 md:h-12 relative z-10" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    
                                    <span className="relative z-10 tracking-wide">
                                        ACESSAR CANAL SECRETO
                                    </span>
                                    
                                    <ExternalLink className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                                </motion.a>

                                {/* Security Notice */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="text-gray-500 font-mono text-xs mt-8"
                                >
                                    <Shield className="w-3 h-3 inline mr-2" />
                                    CONEXÃO SEGURA E CRIPTOGRAFADA
                                </motion.p>
                            </div>
                        </div>
                    </motion.div>
                ) : isComingSoon ? (
                    /* COMING SOON STATE */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-carbon/50 backdrop-blur-md flex items-center justify-center"
                    >
                        {/* Animated Background */}
                        <div className="absolute inset-0 opacity-20">
                            <motion.div
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%"],
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                                className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,174,239,0.1)_50%,transparent_75%)] bg-[length:250%_250%]"
                            />
                        </div>

                        {/* Radar Scan Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-cyan/10 blur-3xl"
                        />

                        {/* Content */}
                        <div className="relative z-10 text-center px-6">
                            <motion.div
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Radio className="w-16 h-16 text-cyan mx-auto mb-6" />
                            </motion.div>

                            <h3 className="font-heading text-4xl md:text-5xl text-white mb-3 tracking-tight">
                                SISTEMA OFFLINE
                            </h3>
                            
                            <motion.p
                                animate={{
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="text-cyan font-mono text-lg tracking-widest mb-2"
                            >
                                // EM BREVE
                            </motion.p>

                            <p className="text-gray-400 font-mono text-sm max-w-md mx-auto">
                                CONSTRUINDO ATIVO... AGUARDE NOVAS INSTRUÇÕES
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* NORMAL VIDEO PLAYER */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <VideoPlayer
                            videoUrl={lesson.videoUrl!}
                            lessonId={lesson.id}
                            lessonTitle={lesson.title}
                        />
                    </motion.div>
                )}

                {/* Lesson Description */}
                {lesson.description && !isSpecialLesson && (
                    <div className="mt-8 bg-carbon/50 backdrop-blur-md border border-white/5 rounded-lg p-6">
                        <h3 className="text-white font-heading text-lg mb-2">SOBRE ESTA AULA</h3>
                        <p className="text-gray-400 font-body">{lesson.description}</p>
                    </div>
                )}

                {/* INLINE PDF VIEWER SECTION */}
                {lesson.materials && lesson.materials.some(m => m.type === 'pdf') && !isSpecialLesson && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        {lesson.materials
                            .filter(material => material.type === 'pdf')
                            .map((material, index) => (
                                <div key={index} className="mb-8 last:mb-0">
                                    <SecurePDFViewer
                                        url={material.url}
                                        title={material.title}
                                    />
                                </div>
                            ))}
                    </motion.div>
                )}

                {/* FILE ATTACHMENTS SECTION */}
                {lesson.materials && lesson.materials.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8"
                    >
                        <div className="bg-carbon/50 backdrop-blur-md border border-white/5 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-5 h-5 text-gold" />
                                <h3 className="text-white font-heading text-lg">ARQUIVOS CLASSIFICADOS</h3>
                            </div>
                            
                            {/* Check if Module 03 files are locked */}
                            {(() => {
                                const isModule03 = module.id === "mod_03";
                                
                                // Check if Module 02 is completed
                                const module02 = MODULES.find(m => m.id === "mod_02");
                                const module02Completed = module02 
                                    ? module02.lessons.every(l => progress[l.id]) 
                                    : false;
                                
                                const filesLocked = isModule03 && !module02Completed;

                                if (filesLocked) {
                                    return (
                                        <div className="relative">
                                            {/* Blurred File List */}
                                            <div className="blur-md select-none pointer-events-none space-y-3">
                                                {lesson.materials!.map((material, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-4 bg-void/30 border border-white/5 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {material.type === 'pdf' ? (
                                                                <Download className="w-5 h-5 text-gold" />
                                                            ) : (
                                                                <ExternalLink className="w-5 h-5 text-cyan" />
                                                            )}
                                                            <div>
                                                                <p className="text-white font-mono text-sm">
                                                                    {material.title}
                                                                </p>
                                                                <p className="text-gray-500 font-mono text-xs uppercase">
                                                                    {material.type === 'pdf' ? 'Documento PDF' : 'Link Externo'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <ExternalLink className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Encrypted Overlay */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg border-2 border-alert/30">
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="text-center"
                                                >
                                                    {/* Padlock Icon */}
                                                    <div className="mb-4 relative">
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
                                                        <div className="relative w-16 h-16 mx-auto rounded-full bg-alert/10 backdrop-blur-md border-2 border-alert/50 flex items-center justify-center">
                                                            <Lock className="w-8 h-8 text-alert" />
                                                        </div>
                                                    </div>

                                                    {/* Restricted Access Message */}
                                                    <div className="bg-alert/10 backdrop-blur-md border border-alert/30 rounded-lg px-6 py-3">
                                                        <p className="text-alert font-heading text-sm tracking-widest mb-1">
                                                            ACESSO RESTRITO
                                                        </p>
                                                        <p className="text-white font-mono text-xs">
                                                            Complete o Módulo 02 primeiro
                                                        </p>
                                                    </div>

                                                    <p className="text-gray-500 font-mono text-xs mt-3">
                                                        ARQUIVOS CRIPTOGRAFADOS
                                                    </p>
                                                </motion.div>
                                            </div>
                                        </div>
                                    );
                                }

                                // Normal unlocked files
                                return (
                                    <div className="space-y-3">
                                        {lesson.materials!.map((material, index) => (
                                            <motion.a
                                                key={index}
                                                href={material.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + index * 0.1 }}
                                                whileHover={{ x: 5 }}
                                                className="group relative flex items-center justify-between p-4 bg-void/30 border border-white/5 rounded-lg hover:border-gold/30 hover:bg-gold/5 transition-all duration-300 overflow-hidden"
                                            >
                                                {/* Scan Effect on Hover */}
                                                <motion.div
                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100"
                                                    animate={{
                                                        y: ["-100%", "100%"],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />

                                                <div className="flex items-center gap-3">
                                                    {material.type === 'pdf' ? (
                                                        <Download className="w-5 h-5 text-gold" />
                                                    ) : (
                                                        <ExternalLink className="w-5 h-5 text-cyan" />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-mono text-sm group-hover:text-gold transition-colors">
                                                            {material.title}
                                                        </p>
                                                        <p className="text-gray-500 font-mono text-xs uppercase">
                                                            {material.type === 'pdf' ? 'Documento PDF' : 'Link Externo'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-gray-500 group-hover:text-gold transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </motion.div>
                )}

                {/* Navigation */}
                <div className="mt-12 flex items-center justify-between">
                    {prevLesson ? (
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/lesson/${prevLesson.id}`)}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            AULA ANTERIOR
                        </Button>
                    ) : (
                        <div />
                    )}

                    {nextLesson ? (
                        <Button
                            variant="primary"
                            onClick={() => navigate(`/lesson/${nextLesson.id}`)}
                            className="flex items-center gap-2"
                        >
                            PRÓXIMA AULA
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="gold"
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center gap-2"
                        >
                            MÓDULO CONCLUÍDO
                            <Home className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Module Lessons List */}
                <div className="mt-12 bg-carbon/50 backdrop-blur-md border border-white/5 rounded-lg p-6">
                    <h3 className="text-white font-heading text-lg mb-4">AULAS DESTE MÓDULO</h3>
                    <div className="space-y-2">
                        {module.lessons.map((l, index) => (
                            <button
                                key={l.id}
                                onClick={() => navigate(`/lesson/${l.id}`)}
                                className={`w-full text-left p-3 rounded transition-all ${l.id === lessonId
                                        ? "bg-cyan/10 border border-cyan/30 text-cyan"
                                        : "bg-void/30 border border-white/5 text-gray-400 hover:border-cyan/20 hover:text-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-mono text-xs mr-3">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-body">{l.title}</span>
                                        {!l.videoUrl && !l.isSpecial && (
                                            <span className="ml-2 text-xs text-gold font-mono">[EM BREVE]</span>
                                        )}
                                        {l.isSpecial && (
                                            <span className="ml-2 text-xs text-gold font-mono">[ESPECIAL]</span>
                                        )}
                                    </div>
                                    <span className="font-mono text-xs">{l.duration}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
