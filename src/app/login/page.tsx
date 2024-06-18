"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SparklesText from "@/components/ui/sparkles-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useAuth } from '../../lib/AuthContext';

export default function Login() {
    const { toast } = useToast()

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [signinUsername, setSigninUsername] = useState('');
    const [selectedTab, setSelectedTab] = useState('login');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });

        if (res.ok) {
            toast({
                title: "Connexion réussie.",
                description: "Bienvenue !",
            })
            const data = await res.json();
            login(data.token);
            router.push('/');
        } else {
            toast({
                variant: "destructive",
                title: "Connexion échouée.",
                description: "Identifiant ou mot de passe incorrect.",
            })
            console.error('Error logging in');
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: signinEmail, password: signinPassword, username: signinUsername }),
        });

        if (res.ok) {
            toast({
                title: "Inscription réussie.",
                description: "Votre compte a bien été créé ! Connectez-vous pour accéder à l'application.",
            })
            setSelectedTab('login');
            setLoginEmail('');
            setLoginPassword('');
            setSigninEmail('');
            setSigninPassword('');
            setSigninUsername('');
        } else {
            console.error(res);
        }
    };

    return (
        <section className="relative flex flex-grow justify-center items-center">
            <Tabs className="flex gap-2 flex-col items-center w-1/2 max-lg:w-full" value={selectedTab}>
                <TabsList className="absolute top-4">
                    <TabsTrigger value="login" onClick={() => setSelectedTab('login')}>Log In</TabsTrigger>
                    <TabsTrigger value="signin" onClick={() => setSelectedTab('signin')}>Sign In</TabsTrigger>
                </TabsList>
                <TabsContent className="max-md:w-5/6 w-1/2" value="login">
                    <form onSubmit={handleLogin} className="flex flex-col gap-1" autoComplete="off">
                        <SparklesText text="Hello" className="text-center" />
                        <h2 className="text-center text-2xl font-bold mb-6">Welcome Back</h2>
                        <Label htmlFor="login-email">Email</Label>
                        <Input autoComplete="off" type="email" id="login-email" name="login-email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                        <Label htmlFor="login-password">Password</Label>
                        <Input autoComplete="new-password" type="password" id="login-password" name="login-password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        <a className="text-xs text-right mb-6">Forgot password ?</a>
                        <Button type="submit">Submit</Button>
                    </form>
                </TabsContent>
                <TabsContent className="max-md:w-5/6 w-1/2" value="signin">
                    <form onSubmit={handleRegister} className="flex flex-col gap-1" autoComplete="off">
                        <SparklesText text="Welcome" className="text-center" />
                        <h2 className="text-center text-2xl font-bold mb-6">Join Us!</h2>
                        <Label htmlFor="signin-email">Email</Label>
                        <Input autoComplete="off" type="email" id="signin-email" name="signin-email" placeholder="Email" value={signinEmail} onChange={(e) => setSigninEmail(e.target.value)} />
                        <Label htmlFor="signin-password">Password</Label>
                        <Input autoComplete="new-password" type="password" id="signin-password" name="signin-password" placeholder="Password" value={signinPassword} onChange={(e) => setSigninPassword(e.target.value)} />
                        <Label htmlFor="signin-username">Username</Label>
                        <Input autoComplete="off" className="mb-6" type="text" id="signin-username" name="signin-username" placeholder="Username" value={signinUsername} onChange={(e) => setSigninUsername(e.target.value)} />
                        <Button type="submit">Submit</Button>
                    </form>
                </TabsContent>
            </Tabs>
            <div className="max-lg:hidden w-1/2 bg-red-200 h-full"></div>
        </section>
    );
}
