
export const TRANSLATIONS = {
    de: {
        home: {
            privacyBadge: "Anonym & Diskret",
            headline: "Erlebe deine Fantasien.",
            subheadline: "Detailgetreu. Ästhetisch. Grenzenlos. Die Nr. 1 KI für individuelle Fuß-Visuals. Kontrolle über jedes Detail – sicher & privat.",
            ctaPrimary: "Jetzt generieren",
            ctaSecondary: "",
            features: {
                control: {
                    title: "Volle Kontrolle",
                    desc: "Licht, Sohle, Pose – du entscheidest."
                },
                realistic: {
                    title: "Fühlbare Tiefe",
                    desc: "Texturen, die unter die Haut gehen."
                },
                private: {
                    title: "100% Diskret",
                    desc: "Deine Galerie. Dein Geheimnis."
                }
            }
        }
    },
    en: {
        home: {
            privacyBadge: "Anonymous & Privacy-First",
            headline: "Create Hyper-Realistic Custom Foot Imagery",
            subheadline: "The ultimate AI tool for creators, artists, and enthusiasts. Generate unique, photorealistic fictional content in seconds – with full control over details, perspectives, and lighting.",
            ctaPrimary: "Generate Now",
            ctaSecondary: "View Gallery",
            features: {
                control: {
                    title: "Full Control",
                    desc: "Customize soles, arches, toes, poses, and lighting to your exact specifications."
                },
                realistic: {
                    title: "Ultra Realistic",
                    desc: "State-of-the-art AI generation that rivals studio photography."
                },
                private: {
                    title: "100% Private",
                    desc: "Generations are private to you. No real persons depicted. Fictional content only."
                }
            }
        }
    }
};

export type Language = 'de' | 'en';
export const DEFAULT_LANGUAGE: Language = 'de';
