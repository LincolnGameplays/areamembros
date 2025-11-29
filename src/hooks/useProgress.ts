import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export const useProgress = () => {
    const { user, userData } = useAuth();
    const [progress, setProgress] = useState<{ [lessonId: string]: boolean }>({});

    useEffect(() => {
        if (userData?.progress) {
            setProgress(userData.progress);
        }
    }, [userData]);

    const markComplete = async (lessonId: string) => {
        if (!user) return;

        const newProgress = { ...progress, [lessonId]: true };
        setProgress(newProgress);

        // Update Firestore
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            progress: newProgress,
            currentLesson: lessonId,
            lastUpdated: new Date(),
        });
    };

    const isComplete = (lessonId: string) => {
        return progress[lessonId] === true;
    };

    return { progress, markComplete, isComplete };
};
