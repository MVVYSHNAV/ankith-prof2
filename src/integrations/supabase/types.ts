export type Database = {
    public: {
        Tables: {
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    message: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    message: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    message?: string
                    created_at?: string
                }
                Relationships: []
            }
            profile: {
                Row: {
                    id: string
                    name: string
                    bio: string | null
                    email: string | null
                    linkedin: string | null
                    github: string | null
                    avatar_url: string | null
                    hero_title: string | null
                    hero_subtitle: string | null
                    hero_image_url: string | null
                    about_quote: string | null
                    about_bio: string | null
                    about_full_bio: string | null
                    title_italic: string | null
                    resume_url: string | null
                    born: string | null
                    height: string | null
                    eye_color: string | null
                    hair_color: string | null
                    languages: string | null
                    career_highlights: string | null
                    career_start_year: string | null
                    career_end_year: string | null
                    career_highlight_image: string | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    bio?: string | null
                    email?: string | null
                    linkedin?: string | null
                    github?: string | null
                    avatar_url?: string | null
                    hero_title?: string | null
                    hero_subtitle?: string | null
                    hero_image_url?: string | null
                    about_quote?: string | null
                    about_bio?: string | null
                    about_full_bio?: string | null
                    title_italic?: string | null
                    resume_url?: string | null
                    born?: string | null
                    height?: string | null
                    eye_color?: string | null
                    hair_color?: string | null
                    languages?: string | null
                    career_highlights?: string | null
                    career_start_year?: string | null
                    career_end_year?: string | null
                    career_highlight_image?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    bio?: string | null
                    email?: string | null
                    linkedin?: string | null
                    github?: string | null
                    avatar_url?: string | null
                    hero_title?: string | null
                    hero_subtitle?: string | null
                    hero_image_url?: string | null
                    about_quote?: string | null
                    about_bio?: string | null
                    about_full_bio?: string | null
                    title_italic?: string | null
                    resume_url?: string | null
                    born?: string | null
                    height?: string | null
                    eye_color?: string | null
                    hair_color?: string | null
                    languages?: string | null
                    career_highlights?: string | null
                    career_start_year?: string | null
                    career_end_year?: string | null
                    career_highlight_image?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
            projects: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    technologies: string | null
                    project_url: string | null
                    image_url: string | null
                    category: string | null
                    role: string | null
                    duration: string | null
                    video_url: string | null
                    streaming_url: string | null
                    streaming_provider: string | null
                    note: string | null
                    display_order: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    technologies?: string | null
                    project_url?: string | null
                    image_url?: string | null
                    category?: string | null
                    role?: string | null
                    duration?: string | null
                    video_url?: string | null
                    streaming_url?: string | null
                    streaming_provider?: string | null
                    note?: string | null
                    display_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    technologies?: string | null
                    project_url?: string | null
                    image_url?: string | null
                    category?: string | null
                    role?: string | null
                    duration?: string | null
                    video_url?: string | null
                    streaming_url?: string | null
                    streaming_provider?: string | null
                    note?: string | null
                    display_order?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            skills: {
                Row: {
                    id: string
                    name: string
                    level: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    level?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    level?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_films: {
                Row: {
                    id: string
                    title: string
                    director: string | null
                    role: string | null
                    year: string | null
                    image_url: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    director?: string | null
                    role?: string | null
                    year?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    director?: string | null
                    role?: string | null
                    year?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_tv: {
                Row: {
                    id: string
                    show: string
                    role: string | null
                    type: string | null
                    channel: string | null
                    year: string | null
                    link: string | null
                    image_url: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    show: string
                    role?: string | null
                    type?: string | null
                    channel?: string | null
                    year?: string | null
                    link?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    show?: string
                    role?: string | null
                    type?: string | null
                    channel?: string | null
                    year?: string | null
                    link?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_theater: {
                Row: {
                    id: string
                    play: string
                    director: string | null
                    theater: string | null
                    role: string | null
                    year: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    play: string
                    director?: string | null
                    theater?: string | null
                    role?: string | null
                    year?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    play?: string
                    director?: string | null
                    theater?: string | null
                    role?: string | null
                    year?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_education: {
                Row: {
                    id: string
                    degree: string
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    degree: string
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    degree?: string
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_training: {
                Row: {
                    id: string
                    school: string
                    mentor: string | null
                    location: string | null
                    image_url: string | null
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    school: string
                    mentor?: string | null
                    location?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    school?: string
                    mentor?: string | null
                    location?: string | null
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
            resume_commercials: {
                Row: {
                    id: string
                    brand: string
                    display_order: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand: string
                    display_order?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand?: string
                    display_order?: number | null
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
