export interface Lesson {
    id: string;
    title: string;
    duration: string;
    videoUrl: string; // Vimeo/YouTube URL
    description?: string;
}

export interface Module {
    id: string;
    title: string;
    subtitle: string;
    coverImage: string; // Path to assets
    lessons: Lesson[];
}

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    accessLevel: "soldado" | "operador" | "elite";
    createdAt: any;
    lastUpdated: any;
    progress: {
        [lessonId: string]: boolean;
    };
    currentLesson?: string;
}
