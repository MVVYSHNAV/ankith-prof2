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
                .order('display_order', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Project[];
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
