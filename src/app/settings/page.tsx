"use client";

import { useState, useEffect } from "react";
import { Settings, Shield, User, Bell, Palette, Database, Key, Check, Info, AlertTriangle, Monitor, Moon, Sun, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("api");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSave = () => {
        toast("Settings saved successfully", "success");
    };

    if (!mounted) return null;

    const tabs = [
        { id: "api", label: "API Configuration", icon: Key },
        { id: "display", label: "Display & Theme", icon: Palette },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "account", label: "Data Management", icon: Database },
    ];

    return (
        <PageShell>
            <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-700">
                <div>
                    <h1 className="font-bebas text-5xl tracking-tight text-text-primary">Terminal Settings</h1>
                    <p className="text-text-muted mt-1 uppercase font-mono text-[10px] tracking-[0.3em]">System Configuration & Preferences</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation */}
                    <div className="flex flex-col gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bebas text-lg tracking-wide uppercase",
                                    activeTab === tab.id
                                        ? "bg-accent text-bg-sidebar shadow-lg shadow-accent/20"
                                        : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 space-y-6">
                        {activeTab === 'api' && (
                            <Card variant="default" className="border-accent/10">
                                <CardHeader className="py-4 border-b border-border">
                                    <h2 className="font-bebas text-2xl tracking-wide uppercase">API Connectivity</h2>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="bg-blue/5 rounded-xl p-4 border border-blue/10 flex items-start gap-3">
                                        <Info className="h-5 w-5 text-blue mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Backend Integration</p>
                                            <p className="text-xs text-text-secondary leading-relaxed">System is currently using environment variables defined in <code className="bg-bg-secondary px-1 rounded">.env.local</code>. Direct UI overrides are disabled for security.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-accent/20 rounded-lg">
                                                    <Shield className="h-5 w-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">Finnhub Market Data</p>
                                                    <p className="text-[10px] text-text-muted font-mono uppercase">Status: Connected</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">Active</Badge>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-accent/20 rounded-lg">
                                                    <Sparkles className="h-5 w-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">Groq & Hugging Face AI</p>
                                                    <p className="text-[10px] text-text-muted font-mono uppercase">Status: Connected</p>
                                                </div>
                                            </div>
                                            <Badge variant="success">Active</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'display' && (
                            <Card variant="default">
                                <CardHeader className="py-4 border-b border-border">
                                    <h2 className="font-bebas text-2xl tracking-wide uppercase">Appearance</h2>
                                </CardHeader>
                                <CardContent className="p-6 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-mono font-bold uppercase text-text-muted tracking-widest ml-1">Terminal Theme</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <button
                                                onClick={() => setTheme('light')}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                                                    theme === 'light' ? "bg-accent/5 border-accent text-accent" : "bg-bg-secondary border-border text-text-muted"
                                                )}
                                            >
                                                <Sun className="h-6 w-6" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Day Mode</span>
                                            </button>
                                            <button
                                                onClick={() => setTheme('dark')}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                                                    theme === 'dark' ? "bg-accent/5 border-accent text-accent" : "bg-bg-secondary border-border text-text-muted"
                                                )}
                                            >
                                                <Moon className="h-6 w-6" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Night Mode</span>
                                            </button>
                                            <button
                                                onClick={() => setTheme('system')}
                                                className={cn(
                                                    "flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all",
                                                    theme === 'system' ? "bg-accent/5 border-accent text-accent" : "bg-bg-secondary border-border text-text-muted"
                                                )}
                                            >
                                                <Monitor className="h-6 w-6" />
                                                <span className="text-xs font-bold uppercase tracking-widest">System</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-border flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-text-primary">Strict JetBrains Mono</p>
                                            <p className="text-xs text-text-secondary leading-normal">Force terminal typography for all data components.</p>
                                        </div>
                                        <div className="h-6 w-11 bg-accent rounded-full relative p-1 cursor-pointer">
                                            <div className="h-4 w-4 bg-bg-sidebar rounded-full ml-auto" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'account' && (
                            <Card variant="default" className="border-red/10">
                                <CardHeader className="py-4 border-b border-border">
                                    <h2 className="font-bebas text-2xl tracking-wide uppercase text-red">Danger Zone</h2>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="bg-red/5 rounded-xl p-4 border border-red/10 flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-red mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-text-primary uppercase tracking-tight">Account Wipe</p>
                                            <p className="text-xs text-text-secondary leading-relaxed">Deleting your data is permanent. This includes your whole trade journal and research history saved in local browser storage.</p>
                                        </div>
                                    </div>

                                    <Button
                                        variant="danger"
                                        className="w-full h-12 font-bebas text-lg tracking-widest uppercase"
                                        onClick={() => {
                                            if (confirm("Delete all data? This cannot be undone.")) {
                                                localStorage.clear();
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        Purge All Terminal Data
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" className="px-8">Reset</Button>
                            <Button variant="primary" className="px-8" onClick={handleSave}>Save Preferences</Button>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
