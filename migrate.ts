import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration (from .env.example)
const supabaseUrl = 'https://qrlzwzqgrwnpgumkblob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybHp3enFncnducGd1bWtibG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjAyOTMsImV4cCI6MjA4ODYzNjI5M30.aomd_dg4zdR8sAvk9dFMm-TiIfC7-p5o4VqEgP7M_TI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const loadJson = (filename: string) => {
    const filePath = path.join(process.cwd(), 'src', 'data', filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

async function migrate() {
    console.log('Starting migration...');

    // Debug: Check connection and available tables
    const { data: tables, error: tablesError } = await supabase
        .from('profile')
        .select('*')
        .limit(1);

    if (tablesError) {
        console.error('Connection/Table Check Error:', tablesError);
        console.log('Available tables might be missing or schema cache needs refresh.');
        // If it's specifically a schema error, we might need the user to check Supabase
        if (tablesError.code === 'PGRST204' || tablesError.code === 'PGRST205') {
            console.error('CRITICAL: Table "profile" not found. Please ensure you ran the SQL script in Supabase.');
            return;
        }
    } else {
        console.log('Successfully connected to "profile" table.');
    }

    // 1. Migrate Profile
    const aboutData = loadJson('about.json');
    const careerData = loadJson('career.json');
    const resumeData = loadJson('resume.json');

    if (aboutData && careerData && resumeData) {
        console.log('Migrating profile...');
        const profile = {
            name: "Ankith Madhav",
            bio: aboutData.bio,
            email: "ankithmadhav@gmail.com",
            avatar_url: aboutData.image,
            hero_title: "Actor",
            hero_subtitle: "Ankith Madhav",
            about_quote: aboutData.quote,
            about_bio: aboutData.bio,
            about_full_bio: Array.isArray(aboutData.paragraphs) ? aboutData.paragraphs.join('\n\n') : aboutData.bio,
            born: resumeData.personalDetails?.born || "",
            height: aboutData.stats?.height || resumeData.personalDetails?.height || "",
            eye_color: aboutData.stats?.eyes || resumeData.personalDetails?.eyeColor || "",
            hair_color: aboutData.stats?.hair || resumeData.personalDetails?.hairColor || "",
            languages: Array.isArray(resumeData.personalDetails?.languages) ? resumeData.personalDetails.languages.join(', ') : "",
            career_highlights: Array.isArray(careerData.highlights) ? careerData.highlights.join(', ') : "",
            career_start_year: careerData.timeline?.start || "2008",
            career_end_year: careerData.timeline?.end || "Present",
            career_highlight_image: careerData.timeline?.image || ""
        };

        const { error: profileError } = await supabase
            .from('profile')
            .upsert({ id: '00000000-0000-0000-0000-000000000001', ...profile }, { onConflict: 'id' });

        if (profileError) console.error('Error migrating profile:', profileError);
        else console.log('Profile migrated successfully');
    }

    // 2. Migrate Projects (Filmography & Ads & Portfolio)
    const filmographyData = loadJson('filmography.json');
    const portfolioData = loadJson('portfolio.json');

    if (filmographyData) {
        console.log('Migrating filmography and ads...');

        // Projects -> Filmography/Showreel
        for (const p of filmographyData.projects || []) {
            const category = p.title.toLowerCase().includes('showreel') ? 'Showreel' : 'Filmography';
            const project = {
                title: p.title,
                description: p.description,
                role: p.role,
                duration: p.duration,
                image_url: p.thumbnailUrl,
                streaming_url: p.streamingUrl,
                streaming_provider: p.streamingProvider,
                video_url: p.videoUrl,
                note: p.note,
                category: category
            };
            const { error } = await supabase.from('projects').insert(project);
            if (error) console.error(`Error inserting project ${p.title}:`, error);
        }

        // Videos -> Ads
        for (const v of filmographyData.videos || []) {
            const ad = {
                title: v.title,
                video_url: v.url,
                category: 'Ad'
            };
            const { error } = await supabase.from('projects').insert(ad);
            if (error) console.error(`Error inserting ad ${v.title}:`, error);
        }
    }

    if (portfolioData) {
        console.log('Migrating portfolio items...');
        for (const item of portfolioData.items || []) {
            const photo = {
                title: item.alt,
                image_url: item.src,
                category: 'Portfolio',
                note: item.category // Store original category in note
            };
            const { error } = await supabase.from('projects').insert(photo);
            if (error) console.error(`Error inserting portfolio item ${item.alt}:`, error);
        }
    }

    // 3. Migrate Skills
    if (resumeData && resumeData.specialSkills) {
        console.log('Migrating skills...');
        for (const skillName of resumeData.specialSkills) {
            const skill = {
                name: skillName,
                level: 'Expert' // Default for special skills data
            };
            const { error } = await supabase.from('skills').insert(skill);
            if (error) console.error(`Error inserting skill ${skillName}:`, error);
        }
    }

    console.log('Migration finished!');
}

migrate().catch(console.error);
