import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { session } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/panache";

    useEffect(() => {
        if (session) {
            navigate(from, { replace: true });
        }
    }, [session, navigate, from]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Welcome back");
                navigate(from, { replace: true });
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden text-foreground">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="font-display text-2xl md:text-3xl tracking-wide uppercase group inline-block focus:outline-none"
                    >
                        Ankith <span className="font-editorial italic normal-case text-accent">Madhav</span>
                    </button>
                    <p className="font-body text-xs tracking-[0.3em] uppercase opacity-60 mt-2">
                        Admin Portal
                    </p>
                </div>

                <Card className="bg-muted/30 border-border backdrop-blur-sm shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-display uppercase tracking-tight flex items-center gap-2 justify-center">
                            <Lock className="w-5 h-5 text-accent" />
                            Secure Login
                        </CardTitle>
                        <CardDescription className="text-center font-body">
                            Enter your credentials to access the CMS.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-body text-sm tracking-widest uppercase">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background border-input focus:border-accent font-body"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-body text-sm tracking-widest uppercase">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="bg-background border-input focus:border-accent font-body pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full font-body tracking-[0.2em] uppercase transition-all duration-300 hover:tracking-[0.3em] h-12"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    "Authenticate"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
