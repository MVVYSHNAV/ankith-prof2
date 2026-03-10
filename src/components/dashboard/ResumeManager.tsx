import { useState } from "react";
import { Plus, Trash2, Pencil, Loader2, Save, X } from "lucide-react";
import {
    useResumeFilms, useResumeTv, useResumeTheater,
    useResumeEducation, useResumeTraining, useResumeCommercials
} from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

/* ─── Generic inline row form ─── */
interface Field { key: string; label: string; placeholder?: string }

interface SectionTableProps<T extends { id: string }> {
    title: string;
    description?: string;
    items: T[] | undefined;
    isLoading: boolean;
    fields: Field[];
    primaryKey: keyof T;
    onAdd: (data: Record<string, string>) => Promise<any>;
    onUpdate: (id: string, data: Record<string, string>) => Promise<any>;
    onDelete: (id: string) => Promise<any>;
    isPending: boolean;
}

function SectionTable<T extends { id: string }>({
    title, description, items, isLoading, fields, primaryKey, onAdd, onUpdate, onDelete, isPending
}: SectionTableProps<T>) {
    const blank = Object.fromEntries(fields.map(f => [f.key, ""]));
    const [form, setForm] = useState<Record<string, string>>(blank);
    const [editingId, setEditingId] = useState<string | null>(null);

    const startEdit = (item: T) => {
        setEditingId(item.id);
        setForm(Object.fromEntries(fields.map(f => [f.key, String((item as any)[f.key] ?? "")])));
    };

    const cancelEdit = () => { setEditingId(null); setForm(blank); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await onUpdate(editingId, form);
                toast.success("Updated");
            } else {
                await onAdd(form);
                toast.success("Added");
            }
            cancelEdit();
        } catch {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this entry?")) return;
        try { await onDelete(id); toast.success("Deleted"); }
        catch { toast.error("Failed to delete"); }
    };

    return (
        <Card className="bg-muted/30 border-border">
            <CardHeader>
                <CardTitle className="font-display uppercase tracking-tight">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fields.map(f => (
                            <div key={f.key} className="grid gap-1">
                                <Label htmlFor={`${title}-${f.key}`} className="text-xs">{f.label}</Label>
                                <Input
                                    id={`${title}-${f.key}`}
                                    value={form[f.key]}
                                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                    placeholder={f.placeholder || f.label}
                                    required={f.key === fields[0].key}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 justify-end">
                        {editingId && (
                            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                                <X size={14} className="mr-1" /> Cancel
                            </Button>
                        )}
                        <Button type="submit" size="sm" disabled={isPending} className="gap-2">
                            <Save size={14} />
                            {editingId ? "Update" : "Add"}
                        </Button>
                    </div>
                </form>

                {/* Table */}
                {isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin" /></div>
                ) : items && items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {fields.map(f => <TableHead key={f.key}>{f.label}</TableHead>)}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(item => (
                                <TableRow key={item.id}>
                                    {fields.map(f => (
                                        <TableCell key={f.key} className="max-w-[200px] truncate text-sm">
                                            {f.key === "link" && (item as any)[f.key]
                                                ? <a href={(item as any)[f.key]} target="_blank" rel="noopener noreferrer" className="text-accent underline">Link</a>
                                                : String((item as any)[f.key] ?? "-")}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)}>
                                                <Pencil size={14} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No entries yet.</p>
                )}
            </CardContent>
        </Card>
    );
}

/* ─── Commercials as tag list ─── */
const CommercialsManager = () => {
    const { data: commercials, isLoading, add, remove } = useResumeCommercials();
    const [brand, setBrand] = useState("");

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brand.trim()) return;
        try {
            await add.mutateAsync({ brand: brand.trim() } as any);
            toast.success("Brand added");
            setBrand("");
        } catch { toast.error("Failed to add"); }
    };

    return (
        <Card className="bg-muted/30 border-border">
            <CardHeader>
                <CardTitle className="font-display uppercase tracking-tight">Commercials / Brands</CardTitle>
                <CardDescription>Selected brands from 500+ projects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleAdd} className="flex gap-2">
                    <Input
                        value={brand}
                        onChange={e => setBrand(e.target.value)}
                        placeholder="e.g. Royal Enfield"
                        className="flex-1"
                        required
                    />
                    <Button type="submit" size="sm" disabled={add.isPending} className="gap-2">
                        <Plus size={14} /> Add
                    </Button>
                </form>

                {isLoading ? (
                    <div className="flex justify-center py-6"><Loader2 className="animate-spin" /></div>
                ) : (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {commercials?.map(c => (
                            <span key={c.id} className="flex items-center gap-1 px-3 py-1.5 bg-secondary/30 border border-border/50 text-[11px] tracking-wide uppercase group">
                                {c.brand}
                                <button
                                    onClick={() => remove.mutateAsync(c.id).then(() => toast.success("Removed")).catch(() => toast.error("Failed"))}
                                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={10} />
                                </button>
                            </span>
                        ))}
                        {!commercials?.length && <p className="text-sm text-muted-foreground">No brands yet.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

/* ─── Main ResumeManager ─── */
const ResumeManager = () => {
    const films = useResumeFilms();
    const tv = useResumeTv();
    const theater = useResumeTheater();
    const education = useResumeEducation();
    const training = useResumeTraining();

    return (
        <div className="space-y-8 pb-12">
            <Tabs defaultValue="films" className="space-y-6">
                <TabsList className="bg-muted/50 border border-border p-1 flex-wrap h-auto gap-1">
                    <TabsTrigger value="films">Feature Films</TabsTrigger>
                    <TabsTrigger value="tv">Television</TabsTrigger>
                    <TabsTrigger value="theater">Theater</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="training">Acting Training</TabsTrigger>
                    <TabsTrigger value="commercials">Commercials</TabsTrigger>
                </TabsList>

                <TabsContent value="films">
                    <SectionTable
                        title="Feature Films"
                        description="Film credits including title, director, role, and year."
                        items={films.data}
                        isLoading={films.isLoading}
                        isPending={films.add.isPending || films.update.isPending}
                        primaryKey="title"
                        fields={[
                            { key: "title", label: "Title", placeholder: "e.g. Rocketry" },
                            { key: "director", label: "Director", placeholder: "e.g. R Madhavan" },
                            { key: "role", label: "Role", placeholder: "e.g. Veer" },
                            { key: "year", label: "Year", placeholder: "e.g. 2020" },
                        ]}
                        onAdd={d => films.add.mutateAsync(d as any)}
                        onUpdate={(id, d) => films.update.mutateAsync({ id, ...d } as any)}
                        onDelete={id => films.remove.mutateAsync(id)}
                    />
                </TabsContent>

                <TabsContent value="tv">
                    <SectionTable
                        title="Television"
                        description="TV appearances, anchor roles, and reality shows."
                        items={tv.data}
                        isLoading={tv.isLoading}
                        isPending={tv.add.isPending || tv.update.isPending}
                        primaryKey="show"
                        fields={[
                            { key: "show", label: "Show Title", placeholder: "e.g. D4Dance" },
                            { key: "role", label: "Role", placeholder: "e.g. Anchor" },
                            { key: "channel", label: "Channel", placeholder: "e.g. Mazhavil Manorama" },
                            { key: "year", label: "Year", placeholder: "e.g. 2018" },
                            { key: "type", label: "Type", placeholder: "e.g. Reality Show" },
                            { key: "link", label: "YouTube Link", placeholder: "https://..." },
                        ]}
                        onAdd={d => tv.add.mutateAsync(d as any)}
                        onUpdate={(id, d) => tv.update.mutateAsync({ id, ...d } as any)}
                        onDelete={id => tv.remove.mutateAsync(id)}
                    />
                </TabsContent>

                <TabsContent value="theater">
                    <SectionTable
                        title="Theater"
                        description="Stage plays and theatrical performances."
                        items={theater.data}
                        isLoading={theater.isLoading}
                        isPending={theater.add.isPending || theater.update.isPending}
                        primaryKey="play"
                        fields={[
                            { key: "play", label: "Play Title", placeholder: "e.g. Vishwaroopam" },
                            { key: "role", label: "Role", placeholder: "e.g. Stephan" },
                            { key: "director", label: "Director", placeholder: "e.g. Bhaskaran" },
                            { key: "theater", label: "Theater/Venue", placeholder: "e.g. Saptaswara Theater" },
                            { key: "year", label: "Year", placeholder: "e.g. 2018" },
                        ]}
                        onAdd={d => theater.add.mutateAsync(d as any)}
                        onUpdate={(id, d) => theater.update.mutateAsync({ id, ...d } as any)}
                        onDelete={id => theater.remove.mutateAsync(id)}
                    />
                </TabsContent>

                <TabsContent value="education">
                    <SectionTable
                        title="Education"
                        description="Academic qualifications."
                        items={education.data}
                        isLoading={education.isLoading}
                        isPending={education.add.isPending || education.update.isPending}
                        primaryKey="degree"
                        fields={[
                            { key: "degree", label: "Degree / Qualification", placeholder: "e.g. Bachelor of Engineering (BE)" },
                        ]}
                        onAdd={d => education.add.mutateAsync(d as any)}
                        onUpdate={(id, d) => education.update.mutateAsync({ id, ...d } as any)}
                        onDelete={id => education.remove.mutateAsync(id)}
                    />
                </TabsContent>

                <TabsContent value="training">
                    <SectionTable
                        title="Acting Training"
                        description="Acting schools and mentors."
                        items={training.data}
                        isLoading={training.isLoading}
                        isPending={training.add.isPending || training.update.isPending}
                        primaryKey="school"
                        fields={[
                            { key: "school", label: "School / Institute", placeholder: "e.g. Brian Timony Acting School" },
                            { key: "mentor", label: "Mentor", placeholder: "e.g. Brian Timony" },
                            { key: "location", label: "Location", placeholder: "e.g. London" },
                        ]}
                        onAdd={d => training.add.mutateAsync(d as any)}
                        onUpdate={(id, d) => training.update.mutateAsync({ id, ...d } as any)}
                        onDelete={id => training.remove.mutateAsync(id)}
                    />
                </TabsContent>

                <TabsContent value="commercials">
                    <CommercialsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ResumeManager;
