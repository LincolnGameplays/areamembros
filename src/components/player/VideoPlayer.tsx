import { useState } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useProgress } from "../../hooks/useProgress";

interface VideoPlayerProps {
    videoUrl: string;
    lessonId: string;
    lessonTitle: string;
}

export const VideoPlayer = ({ videoUrl, lessonId, lessonTitle }: VideoPlayerProps) => {
    const { isComplete, markComplete } = useProgress();
    const [showGoldFlash, setShowGoldFlash] = useState(false);
    const completed = isComplete(lessonId);

    const handleComplete = async () => {
        await markComplete(lessonId);
        setShowGoldFlash(true);
        setTimeout(() => setShowGoldFlash(false), 1000);
    };

    return (
        <div className="relative">
            {/* Video Container */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                <ReactPlayer
                    url={videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    config={{
                        youtube: {
                            playerVars: { modestbranding: 1 }
                        },
                        vimeo: {
                            playerOptions: { byline: false, portrait: false }
                        }
                    }}
                />
            </div>

            {/* Completion Button */}
            <div className="mt-6 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-heading text-2xl mb-1">{lessonTitle}</h3>
                    {completed && (
                        <div className="flex items-center gap-2 text-gold text-sm font-mono">
                            <CheckCircle className="w-4 h-4" />
                            AULA CONCLUÍDA
                        </div>
                    )}
                </div>

                {!completed && (
                    <Button variant="gold" onClick={handleComplete}>
                        MARCAR COMO CONCLUÍDA
                    </Button>
                )}
            </div>

            {/* Gold Flash Effect */}
            <AnimatePresence>
                {showGoldFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.3, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 bg-gold pointer-events-none z-50"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
