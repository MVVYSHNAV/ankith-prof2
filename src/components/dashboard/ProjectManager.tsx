import { useState, useMemo } from "react";
import { Plus, Trash2, Pencil, Image as ImageIcon, Loader2, Save, X, Play } from "lucide-react";
import { useProjects } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

/* ─── Video helpers ─── */
const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getVimeoId = (url: string) => {
    if (!url) return null;
    const match = url.match(/vimeo\.com\/([0-9]+)/);
    return match ? match[1] : null;
};

const getVideoThumbnail = (url: string) => {
    if (!url) return null;
    const youtubeId = getYoutubeId(url);
    const vimeoId = getVimeoId(url);
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    if (vimeoId) return `https://vumbnail.com/${vimeoId}.jpg`;
    return null;
};

interface ProjectManagerProps {
    defaultCategory?: string;
    exclusive?: boolean;
}

const ProjectForm = ({
    initialData,
    onSubmit,
    onCancel,
    exclusive,
    defaultCategory,
    isSubmitting,
    isNew = false
}: any) => {
    const [formData, setFormData] = useState(initialData);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            if (files.length === 1) {
                const url = await uploadImage('project-images', files[0]);
                setFormData({ ...formData, image_url: url, image_urls: [url] });
                toast.success("Image uploaded");
            } else {
                toast.info(`Uploading ${files.length} images...`);
                const urls = await Promise.all(files.map(file => uploadImage('project-images', file)));
                setFormData({ ...formData, image_urls: urls, image_url: urls[0] });
                toast.success(`${urls.length} images uploaded`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!exclusive && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Filmography">Film Credit</SelectItem>
                                <SelectItem value="Showreel">Showreel</SelectItem>
                                <SelectItem value="Ad">Advertisement</SelectItem>
                                <SelectItem value="Interview">Media</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Title / Movie Name</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                </div>
            )}

            {exclusive && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="grid gap-2 md:col-span-3">
                        <Label>{defaultCategory === 'Portfolio' ? 'Photo Title/Alt' : 'Title'}</Label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Sort Order</Label>
                        <Input
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            )}

            {(!exclusive || defaultCategory !== 'Portfolio') && (
                <div className="grid gap-2">
                    <Label>Description / Director</Label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            )}

            {(!exclusive || defaultCategory !== 'Portfolio') && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="grid gap-2">
                        <Label>Role</Label>
                        <Input
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Year / Duration</Label>
                        <Input
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Production / Brand</Label>
                        <Input
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Sort Order</Label>
                        <Input
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        />
                    </div>
                </div>
            )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div className="grid gap-2">
                        <Label>Article Link (External Redirect)</Label>
                        <Input
                            value={formData.project_url}
                            onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                            placeholder="https://example.com/article"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                    <div className="grid gap-2">
                        <Label>{exclusive && defaultCategory === 'Portfolio' ? 'Portfolio Photo' : 'Thumbnail Image'}</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="flex-1"
                        />
                        <input type="file" id={`file-upload-${formData.id || 'new'}`} className="hidden" onChange={handleFileChange} accept="image/*" multiple={isNew && exclusive && defaultCategory === 'Portfolio'} />
                        <Button type="button" variant="outline" size="icon" asChild>
                            <label htmlFor={`file-upload-${formData.id || 'new'}`} className="cursor-pointer">
                                {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </label>
                        </Button>
                    </div>
                </div>
                {(!exclusive || defaultCategory !== 'Portfolio') && (
                    <div className="grid gap-2">
                        <Label>Video URL (YouTube/Vimeo)</Label>
                        <Input
                            value={formData.video_url}
                            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        />
                    </div>
                )}
            </div>

            {(formData.image_url || getVideoThumbnail(formData.video_url)) && (
                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                    <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Preview</Label>
                    <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden bg-secondary/50 border border-border/50">
                        <img
                            src={formData.image_url || getVideoThumbnail(formData.video_url) || ""}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {!formData.image_url && getVideoThumbnail(formData.video_url) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                <Play className="text-white h-8 w-8 opacity-70" />
                                <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-2 py-0.5 rounded">Auto-thumbnail</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(!exclusive || defaultCategory !== 'Portfolio') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="grid gap-2">
                        <Label>Streaming Link</Label>
                        <Input
                            value={formData.streaming_url}
                            onChange={(e) => setFormData({ ...formData, streaming_url: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Provider</Label>
                        <Input
                            value={formData.streaming_provider}
                            onChange={(e) => setFormData({ ...formData, streaming_provider: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Additional Note</Label>
                        <Input
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>
                </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Save size={16} />}
                    {isNew ? "Add" : "Save"}
                </Button>
            </div>
        </form>
    );
};

const ProjectCard = ({ project, exclusive, defaultCategory, updateProject, deleteProject }: any) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = async (data: any) => {
        try {
            await updateProject.mutateAsync(data);
            toast.success("Updated successfully");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await deleteProject.mutateAsync(project.id);
                toast.success("Deleted successfully");
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    // Make sure we supply all fields so we don't end up with undefined
    const formData = {
        id: project.id,
        title: project.title || "",
        description: project.description || "",
        technologies: project.technologies || "",
        project_url: project.project_url || "",
        image_url: project.image_url || "",
        category: project.category || "Portfolio",
        display_order: project.display_order || 0,
        role: project.role || "",
        duration: project.duration || "",
        video_url: project.video_url || "",
        streaming_url: project.streaming_url || "",
        streaming_provider: project.streaming_provider || "",
        note: project.note || "",
    };

    if (isEditing) {
        return (
            <Card className="border-accent">
                <CardHeader className="pb-3 border-b mb-4">
                    <CardTitle className="text-lg">Edit {project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProjectForm
                        initialData={formData}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                        exclusive={exclusive}
                        defaultCategory={defaultCategory}
                        isSubmitting={updateProject.isPending}
                    />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="group overflow-hidden flex flex-col h-full bg-muted/20 hover:bg-muted/40 transition-colors border-border/50">
            {(() => {
                const autoThumb = getVideoThumbnail(project.video_url);
                const displayImage = project.image_url || autoThumb;

                if (displayImage) {
                    return (
                        <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-secondary/50 overflow-hidden relative">
                            <img
                                src={displayImage}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {!project.image_url && autoThumb && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Play className="text-white h-5 w-5 fill-current" />
                                    </div>
                                    <span className="absolute bottom-2 left-2 text-[8px] uppercase tracking-widest text-white/70 bg-black/40 px-2 py-0.5 rounded">Video Link</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background" onClick={() => setIsEditing(true)}>
                                    <Pencil size={14} />
                                </Button>
                                <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={handleDelete}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="w-full aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-secondary/30 flex items-center justify-center relative">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background" onClick={() => setIsEditing(true)}>
                                <Pencil size={14} />
                            </Button>
                            <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={handleDelete}>
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                );
            })()}
            <CardContent className="p-4 flex-1 flex flex-col">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg tracking-wide line-clamp-1">{project.title}</h3>
                    {!exclusive && (
                        <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-secondary rounded-full whitespace-nowrap">
                            {project.category}
                        </span>
                    )}
                </div>
                {project.role && (
                    <p className="text-sm text-accent mb-1 line-clamp-1">{project.role}</p>
                )}
                {project.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-auto">{project.description}</p>
                )}
            </CardContent>
            {exclusive && project.display_order !== undefined && (
                <CardFooter className="p-4 pt-0 text-[10px] text-muted-foreground uppercase tracking-widest">
                    Order: {project.display_order}
                </CardFooter>
            )}
        </Card>
    );
};

const ProjectManager = ({ defaultCategory = "Portfolio", exclusive = false }: ProjectManagerProps) => {
    const { data: projects, isLoading, addProject, updateProject, deleteProject } = useProjects();
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState(defaultCategory);

    const blankForm = {
        title: "",
        description: "",
        technologies: "",
        project_url: "",
        image_url: "",
        image_urls: [],
        category: activeTab,
        display_order: 0,
        role: "",
        duration: "",
        video_url: "",
        streaming_url: "",
        streaming_provider: "",
        note: "",
    };

    const handleAdd = async (formData: any) => {
        try {
            const { image_urls, ...submitData } = formData;

            if (exclusive && image_urls && image_urls.length > 1) {
                // Batch create multiple mapped from multi UI
                for (let i = 0; i < image_urls.length; i++) {
                    await addProject.mutateAsync({
                        ...submitData,
                        image_url: image_urls[i],
                        title: `${submitData.title} ${i + 1}`,
                    });
                }
                toast.success(`${image_urls.length} items added successfully`);
            } else {
                await addProject.mutateAsync(submitData);
                toast.success("Entry added successfully");
            }
            setIsAdding(false);
        } catch (error) {
            toast.error("Failed to add entry");
        }
    };

    const displayProjects = projects
        ?.filter(p => exclusive ? p.category === defaultCategory : p.category === activeTab)
        ?.sort((a, b) => {
            const aVal = a.display_order === 0 || a.display_order === null ? Infinity : a.display_order;
            const bVal = b.display_order === 0 || b.display_order === null ? Infinity : b.display_order;
            if (aVal !== bVal) return aVal - bVal;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

    const categories = [
        { id: 'Filmography', label: 'Film Credits' },
        { id: 'Showreel', label: 'Showreels' },
        { id: 'Ad', label: 'Advertisements' },
        { id: 'Interview', label: 'Media' }
    ];

    return (
        <div className="space-y-8 pb-12">
            {!exclusive && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="overflow-x-auto pb-2 scrollbar-none">
                        <TabsList className="bg-muted/30 border border-border/50 w-max sm:w-auto min-w-full justify-start md:justify-center">
                            {categories.map(cat => (
                                <TabsTrigger key={cat.id} value={cat.id} className="text-[10px] md:text-xs uppercase tracking-widest px-4 md:px-6 py-2">
                                    {cat.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </Tabs>
            )}

            {(() => {
                const activeLabel = categories.find(c => c.id === activeTab)?.label || activeTab;
                return !isAdding ? (
                    <Button onClick={() => setIsAdding(true)} className="gap-2">
                        <Plus size={16} /> Add New {exclusive ? defaultCategory : activeLabel}
                    </Button>
                ) : (
                    <Card className="border-accent shadow-lg shadow-accent/5">
                        <CardHeader className="border-b pb-4 mb-4">
                            <CardTitle className="font-display uppercase tracking-tight">Add New {exclusive ? defaultCategory : activeLabel}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ProjectForm
                                initialData={blankForm}
                                onSubmit={handleAdd}
                                onCancel={() => setIsAdding(false)}
                                exclusive={exclusive}
                                defaultCategory={exclusive ? defaultCategory : activeTab}
                                isSubmitting={addProject.isPending}
                                isNew={true}
                            />
                        </CardContent>
                    </Card>
                );
            })()}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="animate-spin text-accent" />
                    </div>
                ) : displayProjects && displayProjects.length > 0 ? (
                    displayProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            exclusive={exclusive}
                            defaultCategory={exclusive ? defaultCategory : activeTab}
                            updateProject={updateProject}
                            deleteProject={deleteProject}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border border-border border-dashed">
                        No entries found in {exclusive ? defaultCategory : activeTab}.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectManager;
