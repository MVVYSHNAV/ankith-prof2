import { useState, useEffect } from "react";
import { Save, Loader2, User, Mail, Linkedin, Github, FileText, Image as ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

const ProfileManager = () => {
    const { data: profile, isLoading, updateProfile } = useProfile();
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        email: "",
        linkedin: "",
        github: "",
        avatar_url: "",
        hero_title: "",
        hero_subtitle: "",
        hero_image_url: "",
        about_quote: "",
        about_bio: "",
        about_full_bio: "",
        title_italic: "",
        born: "",
        height: "",
        eye_color: "",
        hair_color: "",
        languages: "",
        career_highlights: "",
        career_start_year: "",
        career_end_year: "",
        career_highlight_image: "",
    });
    const [uploading, setUploading] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                bio: profile.bio || "",
                email: profile.email || "",
                linkedin: profile.linkedin || "",
                github: profile.github || "",
                avatar_url: profile.avatar_url || "",
                hero_title: profile.hero_title || "",
                hero_subtitle: profile.hero_subtitle || "",
                hero_image_url: profile.hero_image_url || "",
                about_quote: profile.about_quote || "",
                about_bio: profile.about_bio || "",
                about_full_bio: profile.about_full_bio || "",
                title_italic: profile.title_italic || "",
                born: profile.born || "",
                height: profile.height || "",
                eye_color: profile.eye_color || "",
                hair_color: profile.hair_color || "",
                languages: profile.languages || "",
                career_highlights: profile.career_highlights || "",
                career_start_year: profile.career_start_year || "",
                career_end_year: profile.career_end_year || "",
                career_highlight_image: profile.career_highlight_image || "",
            });
        }
    }, [profile]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'hero_image_url' | 'career_highlight_image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        try {
            const bucket = (field === 'avatar_url' || field === 'career_highlight_image') ? 'profile-images' : 'project-images';
            const url = await uploadImage(bucket, file);
            setFormData({ ...formData, [field]: url });
            toast.success("Image uploaded");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(formData);
            toast.success("Profile and site content updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while saving profile");
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8 pb-32">
                {/* Basic Information */}
                <Card className="bg-muted/30 border-border">
                    <CardHeader>
                        <CardTitle className="font-display uppercase tracking-tight">Basic Information</CardTitle>
                        <CardDescription>Your name and primary identity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full bg-secondary overflow-hidden border border-border">
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <User size={32} strokeWidth={1} />
                                        </div>
                                    )}
                                </div>
                                <input type="file" id="avatar-upload" className="hidden" onChange={(e) => handleFileChange(e, 'avatar_url')} accept="image/*" />
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                                >
                                    {uploading === 'avatar_url' ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                                </label>
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="name" className="pl-9" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bio">Global Role / Title</Label>
                                        <Input id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Actor & Performance Artist" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="email" className="pl-9" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input id="linkedin" className="pl-9" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actor Physical Stats & Personal Details */}
                <Card className="bg-muted/30 border-border">
                    <CardHeader>
                        <CardTitle className="font-display uppercase tracking-tight">Physical Stats & Personal Details</CardTitle>
                        <CardDescription>Details used in your 'About' section grid.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="born">Born (Date/Year)</Label>
                            <Input id="born" value={formData.born} onChange={(e) => setFormData({ ...formData, born: e.target.value })} placeholder="April 27" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="height">Height</Label>
                            <Input id="height" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} placeholder="5'11&quot;" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="eye_color">Eye Color</Label>
                            <Input id="eye_color" value={formData.eye_color} onChange={(e) => setFormData({ ...formData, eye_color: e.target.value })} placeholder="Black" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="hair_color">Hair Color</Label>
                            <Input id="hair_color" value={formData.hair_color} onChange={(e) => setFormData({ ...formData, hair_color: e.target.value })} placeholder="Black" />
                        </div>
                        <div className="grid gap-2 col-span-1 lg:col-span-2">
                            <Label htmlFor="languages">Languages</Label>
                            <Input id="languages" value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} placeholder="English, Malayalam, Hindi, Tamil" />
                        </div>
                    </CardContent>
                </Card>

                {/* Hero Section Content */}
                <Card className="bg-muted/30 border-border">
                    <CardHeader>
                        <CardTitle className="font-display uppercase tracking-tight">Hero Display</CardTitle>
                        <CardDescription>Configure the main title and striking quote on your home page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="hero_title">Primary Hero Title</Label>
                                    <Input id="hero_title" value={formData.hero_title} onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })} placeholder="Actor" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="hero_subtitle">Secondary Hero Title</Label>
                                    <Input id="hero_subtitle" value={formData.hero_subtitle} onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })} placeholder="Ankith Madhav" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title_italic">Philosophical Quote (Hero)</Label>
                                    <Textarea id="title_italic" value={formData.title_italic} onChange={(e) => setFormData({ ...formData, title_italic: e.target.value })} placeholder="Man is genius when he is dreaming." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Hero Portait / Background</Label>
                                <div className="aspect-[4/5] bg-secondary rounded-lg overflow-hidden relative group border border-border max-w-[200px] mx-auto">
                                    {formData.hero_image_url ? (
                                        <img src={formData.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <ImageIcon size={32} strokeWidth={1} />
                                        </div>
                                    )}
                                    <input type="file" id="hero-image-upload" className="hidden" onChange={(e) => handleFileChange(e, 'hero_image_url')} accept="image/*" />
                                    <label
                                        htmlFor="hero-image-upload"
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        {uploading === 'hero_image_url' ? <Loader2 className="animate-spin" size={24} /> : <span className="text-[10px] uppercase tracking-widest font-body">Change Image</span>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* About & Bio */}
                <Card className="bg-muted/30 border-border">
                    <CardHeader>
                        <CardTitle className="font-display uppercase tracking-tight">Biography & About</CardTitle>
                        <CardDescription>Detailed storytelling components of your life.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="about_quote">About Section Headline</Label>
                            <Input id="about_quote" value={formData.about_quote} onChange={(e) => setFormData({ ...formData, about_quote: e.target.value })} placeholder="The Panache Factor" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="about_bio">Short Bio Intro</Label>
                            <Textarea id="about_bio" value={formData.about_bio} onChange={(e) => setFormData({ ...formData, about_bio: e.target.value })} className="min-h-[100px]" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="about_full_bio">Extended Full Biography</Label>
                            <Textarea id="about_full_bio" value={formData.about_full_bio} onChange={(e) => setFormData({ ...formData, about_full_bio: e.target.value })} className="min-h-[200px]" placeholder="Use double newlines for separate paragraphs..." />
                        </div>
                    </CardContent>
                </Card>

                {/* Career Highlights */}
                <Card className="bg-muted/30 border-border">
                    <CardHeader>
                        <CardTitle className="font-display uppercase tracking-tight">Career Journey Highlights</CardTitle>
                        <CardDescription>Key moments and timeline data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="career_start">Start Year</Label>
                                        <Input id="career_start" value={formData.career_start_year} onChange={(e) => setFormData({ ...formData, career_start_year: e.target.value })} placeholder="2008" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="career_end">Status/End Year</Label>
                                        <Input id="career_end" value={formData.career_end_year} onChange={(e) => setFormData({ ...formData, career_end_year: e.target.value })} placeholder="Present" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="career_highlights">Top Highlights (Comma separated)</Label>
                                    <Textarea id="career_highlights" value={formData.career_highlights} onChange={(e) => setFormData({ ...formData, career_highlights: e.target.value })} placeholder="Rocketry, Solo, 500+ AD Projects" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Career Spotlight Image</Label>
                                <div className="aspect-video bg-secondary rounded-lg overflow-hidden relative group border border-border">
                                    {formData.career_highlight_image ? (
                                        <img src={formData.career_highlight_image} alt="Career" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <ImageIcon size={32} strokeWidth={1} />
                                        </div>
                                    )}
                                    <input type="file" id="career-image-upload" className="hidden" onChange={(e) => handleFileChange(e, 'career_highlight_image')} accept="image/*" />
                                    <label
                                        htmlFor="career-image-upload"
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        {uploading === 'career_highlight_image' ? <Loader2 className="animate-spin" size={24} /> : <span className="text-[10px] uppercase tracking-widest font-body">Change Image</span>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="sticky bottom-6 flex justify-end">
                    <Button type="submit" size="lg" className="px-12 gap-2 shadow-2xl" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save All Changes
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProfileManager;
