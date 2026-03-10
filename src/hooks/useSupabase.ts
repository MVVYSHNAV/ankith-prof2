import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types.ts';

const ProjectTable = 'projects' as const;
const SkillTable = 'skills' as const;
const ProfileTable = 'profile' as const;
const MessageTable = 'contact_messages' as const;

type Project = Database['public']['Tables']['projects']['Row'];
type NewProject = Database['public']['Tables']['projects']['Insert'];
type UpdateProject = Database['public']['Tables']['projects']['Update'];
type Skill = Database['public']['Tables']['skills']['Row'];
type NewSkill = Database['public']['Tables']['skills']['Insert'];
type Profile = Database['public']['Tables']['profile']['Row'];
type UpdateProfile = Database['public']['Tables']['profile']['Update'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];

export const useProjects = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const { data, error } = await supabase.from(ProjectTable).select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;

            // Custom sort: display_order 1, 2, 3... 0/null last, then by created_at desc
            return (data as Project[]).sort((a, b) => {
                const aVal = a.display_order === 0 || a.display_order === null ? Infinity : a.display_order;
                const bVal = b.display_order === 0 || b.display_order === null ? Infinity : b.display_order;

                if (aVal !== bVal) return aVal - bVal;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
        },
    });

    const addProject = useMutation({
        mutationFn: async (newProject: NewProject) => {
            const { data, error } = await supabase.from(ProjectTable).insert(newProject as any).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    const updateProject = useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & UpdateProject) => {
            const { data, error } = await supabase.from(ProjectTable).update(updates as any).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    const deleteProject = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from(ProjectTable).delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
    });

    return { ...query, addProject, updateProject, deleteProject };
};

export const useSkills = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            const { data, error } = await supabase.from(SkillTable).select('*').order('created_at', { ascending: true });
            if (error) throw error;
            return data as Skill[];
        },
    });

    const addSkill = useMutation({
        mutationFn: async (newSkill: NewSkill) => {
            const { data, error } = await supabase.from(SkillTable).insert(newSkill as any).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
    });

    const deleteSkill = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from(SkillTable).delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
    });

    return { ...query, addSkill, deleteSkill };
};

export const useProfile = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data, error } = await supabase.from(ProfileTable).select('*').maybeSingle();
            if (error) throw error;
            return data as Profile;
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (updates: UpdateProfile) => {
            const { data: existing } = await supabase.from(ProfileTable).select('id').maybeSingle();

            let res;
            if (existing) {
                res = await supabase.from(ProfileTable).update(updates as any).eq('id', (existing as any).id).select().single();
            } else {
                res = await supabase.from(ProfileTable).insert(updates as any).select().single();
            }

            if (res.error) throw res.error;
            return res.data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });

    return { ...query, updateProfile };
};

export const useContactMessages = () => {
    return useQuery({
        queryKey: ['contact_messages'],
        queryFn: async () => {
            const { data, error } = await supabase.from(MessageTable).select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data as ContactMessage[];
        },
    });
};

/* ─── Resume hooks ─── */

const makeResumeCrud = <TRow, TInsert, TUpdate>(table: string) => () => {
    const queryClient = useQueryClient();
    const key = [table];

    const query = useQuery({
        queryKey: key,
        queryFn: async () => {
            const { data, error } = await (supabase.from(table as any).select('*') as any)
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: true });
            if (error) throw error;
            return data as TRow[];
        },
    });

    const add = useMutation({
        mutationFn: async (item: TInsert) => {
            const { data, error } = await (supabase.from(table as any).insert(item as any) as any).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    });

    const update = useMutation({
        mutationFn: async ({ id, ...updates }: { id: string } & TUpdate) => {
            const { data, error } = await (supabase.from(table as any).update(updates as any) as any).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    });

    const remove = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from(table as any).delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
    });

    return { ...query, add, update, remove };
};

type ResumeFilm = Database['public']['Tables']['resume_films']['Row'];
type ResumeFilmInsert = Database['public']['Tables']['resume_films']['Insert'];
type ResumeFilmUpdate = Database['public']['Tables']['resume_films']['Update'];

type ResumeTv = Database['public']['Tables']['resume_tv']['Row'];
type ResumeTvInsert = Database['public']['Tables']['resume_tv']['Insert'];
type ResumeTvUpdate = Database['public']['Tables']['resume_tv']['Update'];

type ResumeTheater = Database['public']['Tables']['resume_theater']['Row'];
type ResumeTheaterInsert = Database['public']['Tables']['resume_theater']['Insert'];
type ResumeTheaterUpdate = Database['public']['Tables']['resume_theater']['Update'];

type ResumeEducation = Database['public']['Tables']['resume_education']['Row'];
type ResumeEducationInsert = Database['public']['Tables']['resume_education']['Insert'];
type ResumeEducationUpdate = Database['public']['Tables']['resume_education']['Update'];

type ResumeTraining = Database['public']['Tables']['resume_training']['Row'];
type ResumeTrainingInsert = Database['public']['Tables']['resume_training']['Insert'];
type ResumeTrainingUpdate = Database['public']['Tables']['resume_training']['Update'];

type ResumeCommercial = Database['public']['Tables']['resume_commercials']['Row'];
type ResumeCommercialInsert = Database['public']['Tables']['resume_commercials']['Insert'];
type ResumeCommercialUpdate = Database['public']['Tables']['resume_commercials']['Update'];

export const useResumeFilms = makeResumeCrud<ResumeFilm, ResumeFilmInsert, ResumeFilmUpdate>('resume_films');
export const useResumeTv = makeResumeCrud<ResumeTv, ResumeTvInsert, ResumeTvUpdate>('resume_tv');
export const useResumeTheater = makeResumeCrud<ResumeTheater, ResumeTheaterInsert, ResumeTheaterUpdate>('resume_theater');
export const useResumeEducation = makeResumeCrud<ResumeEducation, ResumeEducationInsert, ResumeEducationUpdate>('resume_education');
export const useResumeTraining = makeResumeCrud<ResumeTraining, ResumeTrainingInsert, ResumeTrainingUpdate>('resume_training');
export const useResumeCommercials = makeResumeCrud<ResumeCommercial, ResumeCommercialInsert, ResumeCommercialUpdate>('resume_commercials');
