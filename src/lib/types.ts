export interface Material {
    title: string;
    url: string;
    type: 'pdf' | 'link';
}

export interface Lesson {
    id: string;
    title: string;
    duration: string;
    videoUrl?: string; // Optional for "Coming Soon" state or special lessons
    description?: string;
    materials?: Material[]; // File attachments
    isSpecial?: boolean; // Flag for special lessons (like Sindicato access)
    specialType?: 'whatsapp-access'; // Type of special lesson
    specialUrl?: string; // URL for special actions
}

export interface Module {
    id: string;
    title: string;
    subtitle: string;
    coverImage: string; // Path to assets
    lessons: Lesson[];
    releaseDelayDays: number; // 0 for immediate, 2 for Arsenal, 4 for AI Bonus
    releaseDelayHours?: number; // Optional hour-based delay (e.g., 24 for AI Bonus)
}

export interface UserData {
    uid: string;
    email: string;
    displayName: string;
    accessLevel: "soldado" | "operador" | "elite";
    createdAt: any; // Firebase Timestamp
    lastUpdated: any;
    progress: {
        [lessonId: string]: boolean;
    };
    currentLesson?: string;
}
