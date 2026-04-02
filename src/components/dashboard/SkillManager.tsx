import { useState } from "react";
import { Plus, Trash2, Loader2, Award } from "lucide-react";
import { useSkills } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SkillManager = () => {
    const { data: skills, isLoading, addSkill, deleteSkill } = useSkills();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        level: "Intermediate",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addSkill.mutateAsync(formData as any);
            toast.success("Skill added");
            setIsOpen(false);
            setFormData({ name: "", level: "Intermediate" });
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this skill?")) {
            try {
                await deleteSkill.mutateAsync(id);
                toast.success("Skill deleted");
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete skill");
            }
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="font-body text-xs md:text-sm tracking-[0.2em] uppercase text-muted-foreground">Manage Skills</h2>
                <Button onClick={() => setIsOpen(true)} className="gap-2 w-full sm:w-auto">
                    <Plus size={16} /> Add Talent/Skill
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {skills?.map((skill) => (
                    <Card key={skill.id} className="bg-muted/30 border-border group">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                    <Award size={16} />
                                </div>
                                <div>
                                    <div className="font-display text-sm uppercase tracking-tight">{skill.name}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{skill.level}</div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                onClick={() => handleDelete(skill.id)}
                            >
                                <Trash2 size={14} />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-xs bg-background border-border">
                    <DialogHeader>
                        <DialogTitle>Add Skill</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Talent / Skill Name</Label>
                            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Method Acting or Stunts" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="level">Proficiency</Label>
                            <Select value={formData.level} onValueChange={(val) => setFormData({ ...formData, level: val })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" className="w-full mt-4" disabled={addSkill.isPending}>
                            {addSkill.isPending ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                            Save Talent/Skill
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SkillManager;
