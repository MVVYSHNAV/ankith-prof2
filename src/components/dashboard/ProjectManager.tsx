import { useState } from "react";
import { Plus, Trash2, Pencil, ExternalLink, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { useProjects } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { uploadImage } from "@/lib/storage";

interface ProjectManagerProps {
    defaultCategory?: string;
    exclusive?: boolean;
}

const ProjectManager = ({ defaultCategory = "Portfolio", exclusive = false }: ProjectManagerProps) => {
    const { data: projects, isLoading, addProject, updateProject, deleteProject } = useProjects();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        technologies: "", // Keeping internal property name for DB compatibility, but will rename in UI
        project_url: "",
        image_url: "",
        image_urls: [] as string[],
        category: defaultCategory,
        display_order: 0,
        role: "",
        duration: "",
        video_url: "",
        streaming_url: "",
        streaming_provider: "",
        note: "",
    });
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { image_urls, ...submitData } = formData;

            if (isEditing) {
                await updateProject.mutateAsync({ id: isEditing, ...submitData });
                toast.success("Entry updated");
            } else {
                if (exclusive && image_urls && image_urls.length > 1) {
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
                    toast.success("Entry added");
                }
            }
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            technologies: "",
            project_url: "",
            image_url: "",
            image_urls: [],
            category: defaultCategory,
            display_order: 0,
            role: "",
            duration: "",
            video_url: "",
            streaming_url: "",
            streaming_provider: "",
            note: "",
        });
        setIsEditing(null);
    };

    const handleEdit = (project: any) => {
        setFormData({
            title: project.title || "",
            description: project.description || "",
            technologies: project.technologies || "",
            project_url: project.project_url || "",
            image_url: project.image_url || "",
            image_urls: [],
            category: project.category || "Portfolio",
            display_order: project.display_order || 0,
            role: project.role || "",
            duration: project.duration || "",
            video_url: project.video_url || "",
            streaming_url: project.streaming_url || "",
            streaming_provider: project.streaming_provider || "",
            note: project.note || "",
        });
        setIsEditing(project.id);
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
            console.error("Upload error details:", error);
            const errorMsg = error.message || "Failed to upload image";
            toast.error(errorMsg);
        } finally {
            setUploading(false);
            // reset file input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this entry?")) {
            try {
                await deleteProject.mutateAsync(id);
                toast.success("Entry deleted");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete entry");
            }
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <Card className="bg-muted/30 border-border">
                <CardHeader>
                    <CardTitle className="font-display uppercase tracking-tight">
                        {isEditing ? `Edit ${exclusive ? defaultCategory : 'Entry'}` : `Add New ${exclusive ? defaultCategory : 'Item'}`}
                    </CardTitle>
                    <CardDescription>
                        {exclusive
                            ? `Manage your ${defaultCategory} items.`
                            : "Create entries for Filmography, Showreel, or Ads."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!exclusive && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(v) => setFormData({ ...formData, category: v })}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Filmography">Film Credit</SelectItem>
                                            <SelectItem value="Showreel">Showreel</SelectItem>
                                            <SelectItem value="Ad">Advertisement</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Title / Movie Name</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Rocketry or Solo"
                                    />
                                </div>
                            </div>
                        )}

                        {exclusive && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="grid gap-2 md:col-span-3">
                                    <Label htmlFor="title">{defaultCategory === 'Portfolio' ? 'Photo Title/Alt' : 'Title'}</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        placeholder={defaultCategory === 'Portfolio' ? 'e.g. Vogue Editorial' : 'e.g. Project Title'}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="display_order">Sort Order</Label>
                                    <Input
                                        id="display_order"
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        )}

                        {(!exclusive || defaultCategory !== 'Portfolio') && (
                            <div className="grid gap-2">
                                <Label htmlFor="description">Description / Director</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Short synopsis or Director name"
                                />
                            </div>
                        )}

                        {(!exclusive || defaultCategory !== 'Portfolio') && (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Lead Actor"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Year / Duration</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="e.g. 2024 or 03:45"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tech">Production / Brand</Label>
                                    <Input
                                        id="tech"
                                        value={formData.technologies}
                                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                        placeholder="e.g. Amazon Prime or Nike"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="display_order_non_exclusive">Sort Order</Label>
                                    <Input
                                        id="display_order_non_exclusive"
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="image_url">{exclusive && defaultCategory === 'Portfolio' ? 'Portfolio Photo' : 'Thumbnail / Poster Image'}</Label>
                                <div className="flex gap-4 items-center">
                                    <Input
                                        id="image_url"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        className="flex-1"
                                    />
                                    <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" multiple={exclusive && defaultCategory === 'Portfolio'} />
                                    <Button type="button" variant="outline" size="icon" asChild>
                                        <label htmlFor="file-upload" className="cursor-pointer">
                                            {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        </label>
                                    </Button>
                                </div>
                            </div>
                            {(!exclusive || defaultCategory !== 'Portfolio') && (
                                <div className="grid gap-2">
                                    <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
                                    <Input
                                        id="video_url"
                                        value={formData.video_url}
                                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {(!exclusive || defaultCategory !== 'Portfolio') && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="streaming_url">Streaming Link</Label>
                                    <Input
                                        id="streaming_url"
                                        value={formData.streaming_url}
                                        onChange={(e) => setFormData({ ...formData, streaming_url: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="streaming_provider">Provider (prime/sunnxt/hotstar)</Label>
                                    <Input
                                        id="streaming_provider"
                                        value={formData.streaming_provider}
                                        onChange={(e) => setFormData({ ...formData, streaming_provider: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="note">Additional Note</Label>
                                    <Input
                                        id="note"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 justify-end pt-4">
                            {isEditing && (
                                <Button type="button" variant="ghost" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" className="gap-2" disabled={addProject.isPending || updateProject.isPending}>
                                <Save size={18} />
                                {isEditing ? "Update Entry" : "Add Entry"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="bg-muted/30 border-border">
                <CardHeader>
                    <CardTitle className="font-display uppercase tracking-tight">All Entries</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                <TableHead className="hidden md:table-cell w-[100px] text-center">Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                            ) : (
                                projects
                                    ?.filter(p => exclusive ? p.category === defaultCategory : p.category !== 'Portfolio')
                                    ?.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">
                                                <span className="text-[10px] uppercase tracking-widest px-2 py-1 bg-secondary rounded-full">
                                                    {project.category || "Portfolio"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate">{project.title}</TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{project.role || "-"}</TableCell>
                                            <TableCell className="hidden md:table-cell text-center font-mono">
                                                {project.display_order || 0}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)} className="text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProjectManager;
