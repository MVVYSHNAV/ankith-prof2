import { supabase } from '../integrations/supabase/client';
import { compressImage } from './imageOptimization';

export const uploadImage = async (bucket: 'project-images' | 'profile-images', file: File) => {
    // Compress image before upload to reduce egress and storage usage
    // Most users upload high-res JPG/PNG; converting to WebP + resizing
    // will often reduce a 5MB image to < 500KB.
    const compressedBlob = await compressImage(file, 1920, 0.8);

    const fileName = `${Math.random().toString(36).substring(2)}.webp`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressedBlob, {
            contentType: 'image/webp',
            cacheControl: 'public, max-age=31536000, immutable',
            upsert: true
        });

    if (uploadError) {
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return publicUrl;
};
