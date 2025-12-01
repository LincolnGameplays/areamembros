import { Module } from "./types";

// TACTICAL: Course Content Structure
// Replace videoUrl with actual Vimeo/YouTube URLs
export const MODULES: Module[] = [
    {
        id: "mod_01",
        title: "O BRIEFING",
        subtitle: "Setup & Mindset",
        coverImage: "/assets/mod1.jpg",
        releaseDelayDays: 0, // Immediate access
        lessons: [
            {
                id: "m1_l1",
                title: "O Manifesto Dark",
                duration: "03:12",
                videoUrl: "https://www.youtube.com/watch?v=9eLFUAIenQ4",
                description: "A filosofia por trás do Protocolo Dark",
                materials: [
                    {
                        title: "Manifesto Dark - PDF Completo",
                        url: "https://firebasestorage.googleapis.com/v0/b/protocolo-dark.firebasestorage.app/o/O-MANIFESTO-DO-OPERADOR.pdf?alt=media&token=e8bd8da0-3007-4d27-9abd-27957e18ea39",
                        type: "pdf"
                    },
                    {
                        title: "Checklist de Mindset",
                        url: "https://example.com/checklist",
                        type: "link"
                    }
                ]
            },
            {
                id: "m1_l2",
                title: "A Matemática do Submundo",
                duration: "08:45",
                videoUrl: null,
                description: "Entendendo os números que importam",
                materials: [
                    {
                        title: "Planilha de Métricas",
                        url: "https://example.com/metricas.xlsx",
                        type: "link"
                    }
                ]
            },
        ]
    },
    {
        id: "mod_02",
        title: "O ARSENAL",
        subtitle: "Engenharia de Tráfego",
        coverImage: "/assets/mod2.jpg",
        releaseDelayDays: 2, // Unlocks after 2 days
        lessons: [
            {
                id: "m2_l1",
                title: "Anatomia de uma Campanha",
                duration: "12:30",
                videoUrl: null,
                materials: [
                    {
                        title: "Template de Campanha",
                        url: "https://example.com/template-campanha.pdf",
                        type: "pdf"
                    }
                ]
            },
            {
                id: "m2_l2",
                title: "Criativo que Converte",
                duration: "15:20",
                videoUrl: null
            },
            {
                id: "m2_l3",
                title: "Escala Avançada",
                duration: "18:00",
                // videoUrl is omitted - "Coming Soon" state
                description: "Técnicas avançadas de escala (em breve)"
            },
        ]
    },
    {
        id: "mod_03",
        title: "O MECANISMO",
        subtitle: "Automação & Escala",
        coverImage: "/assets/mod3.jpg",
        releaseDelayDays: 0, // Immediate access
        lessons: [
            {
                id: "m3_l1",
                title: "Funis de Alta Conversão",
                duration: "18:15",
                videoUrl: null,
                materials: [
                    {
                        title: "Biblioteca de Funis",
                        url: "https://example.com/funis",
                        type: "link"
                    },
                    {
                        title: "Guia de Automação",
                        url: "https://example.com/automacao.pdf",
                        type: "pdf"
                    }
                ]
            },
        ]
    },
    {
        id: "bonus",
        title: "FERRAMENTAS DE IA",
        subtitle: "Bônus Exclusivo",
        coverImage: "/assets/bonus.jpg",
        releaseDelayDays: 0, // Changed from 4 to use hour-based lock
        releaseDelayHours: 24, // Unlocks after 24 hours
        lessons: [
            {
                id: "b_l1",
                title: "IA para Copy",
                duration: "10:00",
                videoUrl: null,
                materials: [
                    {
                        title: "Prompts de IA - Copy",
                        url: "https://example.com/prompts-copy.pdf",
                        type: "pdf"
                    }
                ]
            },
            {
                id: "b_l2",
                title: "IA para Criativos",
                duration: "12:00",
                videoUrl: "https://vimeo.com/...",
                materials: [
                    {
                        title: "Prompts de IA - Criativos",
                        url: "https://example.com/prompts-criativos.pdf",
                        type: "pdf"
                    }
                ]
            },
        ]
    },
    {
        id: "sindicato",
        title: "SINDICATO",
        subtitle: "Acesso à Comunidade",
        coverImage: "/assets/sindicato.jpg",
        releaseDelayDays: 0, // Immediate access
        lessons: [
            {
                id: "s_l1",
                title: "Acesso ao QG",
                duration: "∞",
                isSpecial: true,
                specialType: "whatsapp-access",
                specialUrl: "https://chat.whatsapp.com/ESG3dFPjJ5Y0CAjglAPyzJ",
                description: "Conecte-se com a comunidade de operadores de elite"
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
