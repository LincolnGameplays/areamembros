import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/youtube";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Play, 
    Pause, 
    Volume2, 
    VolumeX, 
    Maximize, 
    CheckCircle,
    SkipBack,
    SkipForward
} from "lucide-react";
import { useProgress } from "../../hooks/useProgress";

interface VideoPlayerProps {
    videoUrl: string;
    lessonId: string;
    lessonTitle: string;
    onComplete?: () => void;
}

// ============================================
// THE "PHANTOM PLAYER" // STEALTH YOUTUBE
// ============================================
export const VideoPlayer = ({ 
    videoUrl, 
    lessonId, 
    lessonTitle,
    onComplete 
}: VideoPlayerProps) => {
    const { isComplete, markComplete } = useProgress();
    const playerRef = useRef<ReactPlayer>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Player State
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [played, setPlayed] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [seeking, setSeeking] = useState(false);
    const [showGoldFlash, setShowGoldFlash] = useState(false);
    const [showCompletionBadge, setShowCompletionBadge] = useState(false);

    const completed = isComplete(lessonId);

    // ============================================
    // AUTO-HIDE CONTROLS LOGIC
    // ============================================
    const resetControlsTimeout = () => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            if (playing) {
                setShowControls(false);
            }
        }, 3000);
    };

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    // ============================================
    // PLAYER EVENT HANDLERS
    // ============================================
    const handlePlayPause = () => {
        setPlaying(!playing);
        resetControlsTimeout();
    };

    const handleProgress = (state: { played: number; playedSeconds: number }) => {
        if (!seeking) {
            setPlayed(state.played);
        }
    };

    const handleDuration = (duration: number) => {
        setDuration(duration);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayed(parseFloat(e.target.value));
    };

    const handleSeekMouseDown = () => {
        setSeeking(true);
    };

    const handleSeekMouseUp = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeeking(false);
        playerRef.current?.seekTo(parseFloat(e.target.value));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setMuted(newVolume === 0);
    };

    const toggleMute = () => {
        setMuted(!muted);
        resetControlsTimeout();
    };

    const handleFullscreen = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                containerRef.current.requestFullscreen();
            }
        }
        resetControlsTimeout();
    };

    const handleRewind = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.max(0, currentTime - 10));
        }
        resetControlsTimeout();
    };

    const handleForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.min(duration, currentTime + 10));
        }
        resetControlsTimeout();
    };

    // ============================================
    // VIDEO COMPLETION HANDLER
    // ============================================
    const handleVideoEnd = async () => {
        if (!completed) {
            await markComplete(lessonId);
            
            // Gold Flash Animation
            setShowGoldFlash(true);
            setTimeout(() => setShowGoldFlash(false), 1000);
            
            // Completion Badge
            setShowCompletionBadge(true);
            setTimeout(() => setShowCompletionBadge(false), 3000);
            
            // Optional callback
            if (onComplete) {
                onComplete();
            }
        }
    };

    // ============================================
    // CLICK SHIELD HANDLER (CENTER = PLAY/PAUSE)
    // ============================================
    const handleShieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickWidth = rect.width;
        
        // Center third = Play/Pause
        if (clickX > clickWidth * 0.33 && clickX < clickWidth * 0.66) {
            handlePlayPause();
        }
        // Left third = Rewind 10s
        else if (clickX <= clickWidth * 0.33) {
            handleRewind();
        }
        // Right third = Forward 10s
        else {
            handleForward();
        }
    };

    // Format time helper
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="relative">
            {/* ============================================ */}
            {/* MAIN PLAYER CONTAINER */}
            {/* ============================================ */}
            <div 
                ref={containerRef}
                className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl"
                onMouseMove={resetControlsTimeout}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => {
                    if (playing) {
                        setShowControls(false);
                    }
                }}
            >
                {/* ============================================ */}
                {/* THE CROP: SCALED REACTPLAYER (145%) */}
                {/* ============================================ */}
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        transform: "scale(1.45)",
                        transformOrigin: "center center",
                    }}
                >
                    <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        width="100%"
                        height="100%"
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        onEnded={handleVideoEnd}
                        config={{
                            youtube: {
                                playerVars: {
                                    showinfo: 0,
                                    controls: 0,
                                    rel: 0,
                                    modestbranding: 1,
                                    iv_load_policy: 3,
                                    disablekb: 1,
                                    fs: 0,
                                },
                            },
                        }}
                    />
                </div>

                {/* ============================================ */}
                {/* THE SHIELD: TRANSPARENT CLICK INTERCEPTOR */}
                {/* ============================================ */}
                <div 
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={handleShieldClick}
                    style={{ background: "transparent" }}
                />

                {/* ============================================ */}
                {/* THE SKIN: CUSTOM CONTROLS OVERLAY */}
                {/* ============================================ */}
                <AnimatePresence>
                    {showControls && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
                        >
                            {/* Gradient Background */}
                            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent px-6 py-4">
                                
                                {/* Progress Bar */}
                                <div className="mb-4 group pointer-events-auto">
                                    <input
                                        type="range"
                                        min={0}
                                        max={0.999999}
                                        step="any"
                                        value={played}
                                        onChange={handleSeekChange}
                                        onMouseDown={handleSeekMouseDown}
                                        onMouseUp={handleSeekMouseUp}
                                        className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                                                   [&::-webkit-slider-thumb]:appearance-none
                                                   [&::-webkit-slider-thumb]:w-3
                                                   [&::-webkit-slider-thumb]:h-3
                                                   [&::-webkit-slider-thumb]:rounded-full
                                                   [&::-webkit-slider-thumb]:bg-white
                                                   [&::-webkit-slider-thumb]:opacity-0
                                                   [&::-webkit-slider-thumb]:transition-opacity
                                                   [&::-webkit-slider-thumb]:shadow-[0_0_15px_#00AEEF]
                                                   group-hover:[&::-webkit-slider-thumb]:opacity-100
                                                   [&::-moz-range-thumb]:w-3
                                                   [&::-moz-range-thumb]:h-3
                                                   [&::-moz-range-thumb]:rounded-full
                                                   [&::-moz-range-thumb]:bg-white
                                                   [&::-moz-range-thumb]:border-0
                                                   [&::-moz-range-thumb]:opacity-0
                                                   [&::-moz-range-thumb]:transition-opacity
                                                   [&::-moz-range-thumb]:shadow-[0_0_15px_#00AEEF]
                                                   group-hover:[&::-moz-range-thumb]:opacity-100"
                                        style={{
                                            background: `linear-gradient(to right, #00AEEF 0%, #00AEEF ${played * 100}%, rgba(255,255,255,0.2) ${played * 100}%, rgba(255,255,255,0.2) 100%)`,
                                            boxShadow: `0 0 15px rgba(0, 174, 239, ${played > 0 ? 0.6 : 0})`,
                                        }}
                                    />
                                </div>

                                {/* Control Buttons */}
                                <div className="flex items-center justify-between pointer-events-auto">
                                    {/* Left Controls */}
                                    <div className="flex items-center gap-4">
                                        {/* Play/Pause */}
                                        <button
                                            onClick={handlePlayPause}
                                            className="text-white hover:text-[#00AEEF] transition-colors duration-200"
                                        >
                                            {playing ? (
                                                <Pause className="w-7 h-7" />
                                            ) : (
                                                <Play className="w-7 h-7" />
                                            )}
                                        </button>

                                        {/* Rewind 10s */}
                                        <button
                                            onClick={handleRewind}
                                            className="text-white/80 hover:text-[#00AEEF] transition-colors duration-200"
                                        >
                                            <SkipBack className="w-5 h-5" />
                                        </button>

                                        {/* Forward 10s */}
                                        <button
                                            onClick={handleForward}
                                            className="text-white/80 hover:text-[#00AEEF] transition-colors duration-200"
                                        >
                                            <SkipForward className="w-5 h-5" />
                                        </button>

                                        {/* Volume */}
                                        <div className="flex items-center gap-2 group/volume">
                                            <button
                                                onClick={toggleMute}
                                                className="text-white/80 hover:text-[#00AEEF] transition-colors duration-200"
                                            >
                                                {muted || volume === 0 ? (
                                                    <VolumeX className="w-5 h-5" />
                                                ) : (
                                                    <Volume2 className="w-5 h-5" />
                                                )}
                                            </button>
                                            
                                            {/* Volume Slider */}
                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.01}
                                                value={muted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 appearance-none bg-white/20 rounded-full cursor-pointer
                                                           [&::-webkit-slider-thumb]:appearance-none
                                                           [&::-webkit-slider-thumb]:w-2.5
                                                           [&::-webkit-slider-thumb]:h-2.5
                                                           [&::-webkit-slider-thumb]:rounded-full
                                                           [&::-webkit-slider-thumb]:bg-white
                                                           [&::-moz-range-thumb]:w-2.5
                                                           [&::-moz-range-thumb]:h-2.5
                                                           [&::-moz-range-thumb]:rounded-full
                                                           [&::-moz-range-thumb]:bg-white
                                                           [&::-moz-range-thumb]:border-0"
                                                style={{
                                                    background: `linear-gradient(to right, #00AEEF 0%, #00AEEF ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                                                }}
                                            />
                                        </div>

                                        {/* Time Display */}
                                        <div className="text-white/90 text-sm font-mono">
                                            {formatTime(played * duration)} / {formatTime(duration)}
                                        </div>
                                    </div>

                                    {/* Right Controls */}
                                    <div className="flex items-center gap-4">
                                        {/* Fullscreen */}
                                        <button
                                            onClick={handleFullscreen}
                                            className="text-white/80 hover:text-[#00AEEF] transition-colors duration-200"
                                        >
                                            <Maximize className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ============================================ */}
                {/* COMPLETION BADGE OVERLAY */}
                {/* ============================================ */}
                <AnimatePresence>
                    {showCompletionBadge && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
                        >
                            <div className="bg-black/80 backdrop-blur-md rounded-2xl px-12 py-8 border-2 border-[#FFD700] shadow-2xl">
                                <CheckCircle 
                                    className="w-20 h-20 text-[#FFD700] mx-auto mb-4"
                                    style={{
                                        filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))",
                                    }}
                                />
                                <h2 
                                    className="text-[#FFD700] text-3xl font-black tracking-wider text-center"
                                    style={{
                                        textShadow: "0 0 30px rgba(255, 215, 0, 0.8)",
                                    }}
                                >
                                    MISSÃO CUMPRIDA
                                </h2>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ============================================ */}
            {/* LESSON INFO BELOW PLAYER */}
            {/* ============================================ */}
            <div className="mt-6">
                <h3 className="text-white font-heading text-2xl mb-2">{lessonTitle}</h3>
                {completed && (
                    <div className="flex items-center gap-2 text-[#FFD700] text-sm font-mono uppercase tracking-wide">
                        <CheckCircle className="w-4 h-4" />
                        AULA CONCLUÍDA
                    </div>
                )}
            </div>

            {/* ============================================ */}
            {/* GOLD FLASH SCREEN OVERLAY */}
            {/* ============================================ */}
            <AnimatePresence>
                {showGoldFlash && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="fixed inset-0 bg-[#FFD700] pointer-events-none z-50"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
