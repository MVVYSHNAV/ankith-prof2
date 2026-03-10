import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Settings,
    MessageSquare,
    Plus,
    ArrowLeft,
    Award,
    Star,
    Camera,
    LogOut,
    FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectManager from "@/components/dashboard/ProjectManager";
import SkillManager from "@/components/dashboard/SkillManager";
import ProfileManager from "@/components/dashboard/ProfileManager";
import MessageList from "@/components/dashboard/MessageList";
import ResumeManager from "@/components/dashboard/ResumeManager";

const Dashboard = () => {
    const { signOut } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground section-padding py-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group w-fit">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-body text-xs tracking-[0.2em] uppercase">Return to Site</span>
                        </Link>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light tracking-tight uppercase">
                            The Panache <span className="font-editorial italic normal-case text-accent">Vault</span>
                        </h1>
                        <p className="font-body text-[10px] tracking-[0.4em] uppercase opacity-40 mt-2">
                            Curating the Legacy of Ankith Madhav
                        </p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors px-4 py-2 border border-border rounded-md hover:border-destructive/50"
                    >
                        <LogOut size={16} />
                        <span className="font-body text-xs tracking-[0.2em] uppercase">Sign Out</span>
                    </button>
                </div>

                <Tabs defaultValue="projects" className="space-y-8">
                    <TabsList className="bg-muted/50 border border-border p-1">
                        <TabsTrigger value="projects" className="flex items-center gap-2">
                            <Star size={16} className="text-accent" />
                            <span>Productions</span>
                        </TabsTrigger>
                        <TabsTrigger value="captures" className="flex items-center gap-2">
                            <Camera size={16} />
                            <span>Portfolio Photos</span>
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="flex items-center gap-2">
                            <Award size={16} />
                            <span>Talent/Skills</span>
                        </TabsTrigger>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <Settings size={16} />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="messages" className="flex items-center gap-2">
                            <MessageSquare size={16} />
                            <span>Messages</span>
                        </TabsTrigger>
                        <TabsTrigger value="resume" className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>Resume</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects" className="mt-0">
                        <ProjectManager defaultCategory="Filmography" />
                    </TabsContent>

                    <TabsContent value="captures" className="mt-0">
                        <ProjectManager defaultCategory="Portfolio" exclusive />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-0">
                        <SkillManager />
                    </TabsContent>

                    <TabsContent value="profile" className="mt-0">
                        <ProfileManager />
                    </TabsContent>

                    <TabsContent value="messages" className="mt-0">
                        <MessageList />
                    </TabsContent>

                    <TabsContent value="resume" className="mt-0">
                        <ResumeManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
