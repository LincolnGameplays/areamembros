import { useParams, useNavigate } from "react-router-dom";
import { findLessonById, MODULES } from "../lib/modules";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

export const LessonView = () => {
    const { lessonId } = useParams<{ lessonId: string }>();
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="border-b border-white/5 bg-carbon/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
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

            <main className="max-w-5xl mx-auto px-6 pt-12">
                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <VideoPlayer
                        videoUrl={lesson.videoUrl}
                        lessonId={lesson.id}
                        lessonTitle={lesson.title}
                    />
                </motion.div>

                {/* Lesson Description */}
                {lesson.description && (
                    <div className="mt-8 bg-carbon/50 backdrop-blur-md border border-white/5 rounded-lg p-6">
                        <h3 className="text-white font-heading text-lg mb-2">SOBRE ESTA AULA</h3>
                        <p className="text-gray-400 font-body">{lesson.description}</p>
                    </div>
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
