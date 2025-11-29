import { useState, useEffect } from "react";
import { doc, updateDoc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { MODULES } from "../lib/modules";

export const useProgress = () => {
    const { user } = useAuth();
    const [progress, setProgress] = useState<{ [lessonId: string]: boolean }>({});

    // Real-time listener for progress updates
    useEffect(() => {
        if (!user) {
            setProgress({});
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProgress(data.progress || {});
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Self-Healing: Ensure user document exists before updating
    const ensureUserDocument = async () => {
        if (!user) return false;

        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
            // Auto-Heal: Create the document with default fields
            console.log("🔧 Self-Healing: Creating missing user document...");
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || "Operador",
                accessLevel: "soldado",
                progress: {},
                createdAt: new Date(),
                lastUpdated: new Date(),
            }, { merge: true });
            console.log("✅ User document created successfully");
        }

        return true;
    };

    // Toggle lesson completion (mark complete or incomplete)
    const toggleLessonCompletion = async (lessonId: string) => {
        if (!user) return;

        // Self-Healing Check
        const docExists = await ensureUserDocument();
        if (!docExists) return;

        const newProgress = { ...progress, [lessonId]: !progress[lessonId] };

        // Optimistic UI update
        setProgress(newProgress);

        try {
            // Update Firestore
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                progress: newProgress,
                currentLesson: lessonId,
                lastUpdated: new Date(),
            });
        } catch (error) {
            console.error("Error updating progress:", error);
            // Revert on error
            setProgress(progress);
        }
    };

    // Mark lesson as complete (only if not already complete)
    const markComplete = async (lessonId: string) => {
        if (!user || progress[lessonId]) return;

        // Self-Healing Check
        const docExists = await ensureUserDocument();
        if (!docExists) return;

        const newProgress = { ...progress, [lessonId]: true };
        setProgress(newProgress);

        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                progress: newProgress,
                currentLesson: lessonId,
                lastUpdated: new Date(),
            });
        } catch (error) {
            console.error("Error marking complete:", error);
            setProgress(progress);
        }
    };

    // Check if lesson is complete
    const isComplete = (lessonId: string) => {
        return progress[lessonId] === true;
    };

    // Calculate module progress percentage
    const calculateModuleProgress = (moduleId: string): number => {
        const module = MODULES.find(m => m.id === moduleId);
        if (!module || module.lessons.length === 0) return 0;

        const completedLessons = module.lessons.filter(lesson => progress[lesson.id]).length;
        return Math.round((completedLessons / module.lessons.length) * 100);
    };

    // Calculate global progress percentage
    const calculateGlobalProgress = (): number => {
        const totalLessons = MODULES.reduce((acc, module) => acc + module.lessons.length, 0);
        if (totalLessons === 0) return 0;

        const completedLessons = Object.values(progress).filter(Boolean).length;
        return Math.round((completedLessons / totalLessons) * 100);
    };

    // Get total completed lessons count
    const getCompletedCount = (): number => {
        return Object.values(progress).filter(Boolean).length;
    };

    // Get total lessons count
    const getTotalLessonsCount = (): number => {
        return MODULES.reduce((acc, module) => acc + module.lessons.length, 0);
    };

    return {
        progress,
        toggleLessonCompletion,
        markComplete,
        isComplete,
        calculateModuleProgress,
        calculateGlobalProgress,
        getCompletedCount,
        getTotalLessonsCount,
    };
};
