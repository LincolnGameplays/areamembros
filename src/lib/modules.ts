import { Module } from "./types";

// TACTICAL: Course Content Structure
// Replace videoUrl with actual Vimeo/YouTube URLs
export const MODULES: Module[] = [
    {
        id: "mod_01",
        title: "O BRIEFING",
        subtitle: "Setup & Mindset",
        coverImage: "/assets/mod1.jpg",
        lessons: [
            {
                id: "m1_l1",
                title: "O Manifesto Dark",
                duration: "03:12",
                videoUrl: "https://vimeo.com/...",
                description: "A filosofia por trás do Protocolo Dark"
            },
            {
                id: "m1_l2",
                title: "A Matemática do Submundo",
                duration: "08:45",
                videoUrl: "https://vimeo.com/...",
                description: "Entendendo os números que importam"
            },
        ]
    },
    {
        id: "mod_02",
        title: "O ARSENAL",
        subtitle: "Engenharia de Tráfego",
        coverImage: "/assets/mod2.jpg",
        lessons: [
            {
                id: "m2_l1",
                title: "Anatomia de uma Campanha",
                duration: "12:30",
                videoUrl: "https://vimeo.com/..."
            },
            {
                id: "m2_l2",
                title: "Criativo que Converte",
                duration: "15:20",
                videoUrl: "https://vimeo.com/..."
            },
        ]
    },
    {
        id: "mod_03",
        title: "O MECANISMO",
        subtitle: "Automação & Escala",
        coverImage: "/assets/mod3.jpg",
        lessons: [
            {
                id: "m3_l1",
                title: "Funis de Alta Conversão",
                duration: "18:15",
                videoUrl: "https://vimeo.com/..."
            },
        ]
    },
    {
        id: "bonus",
        title: "FERRAMENTAS DE IA",
        subtitle: "Bônus Exclusivo",
        coverImage: "/assets/bonus.jpg",
        lessons: [
            {
                id: "b_l1",
                title: "IA para Copy",
                duration: "10:00",
                videoUrl: "https://vimeo.com/..."
            },
            {
                id: "b_l2",
                title: "IA para Criativos",
                duration: "12:00",
                videoUrl: "https://vimeo.com/..."
            },
        ]
    },
    {
        id: "sindicato",
        title: "SINDICATO",
        subtitle: "Acesso à Comunidade",
        coverImage: "/assets/sindicato.jpg",
        lessons: [
            {
                id: "s_l1",
                title: "Bem-vindo ao Sindicato",
                duration: "05:00",
                videoUrl: "https://vimeo.com/..."
            },
        ]
    },
];

// Helper function to find lesson by ID
export const findLessonById = (lessonId: string) => {
    for (const module of MODULES) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
            return { lesson, module };
        }
    }
    return null;
};
