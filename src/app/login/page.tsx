"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SparklesText from "@/components/ui/sparkles-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            Cookies.set('token', data.token, { expires: 1 });
            router.push('/');
        } else {
            console.error('Error logging in');
        }
    };

    return (
        <section className="flex flex-grow w-screen justify-center items-center">
            <Tabs defaultValue="login" className="w-1/2 px-36 flex gap-2 flex-col items-center">
                <TabsList className="w-min absolute top-16">
                    <TabsTrigger value="login">Log In</TabsTrigger>
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <form onSubmit={handleLogin} className="flex flex-col gap-1">
                        <SparklesText text="Hello" className=" text-center" />
                        <h2 className="text-center text-2xl font-bold mb-6">Welcome Back</h2>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <a className=" text-xs text-right mb-6">Forgot password ?</a>
                        <Button type="submit">Submit</Button>
                    </form>
                </TabsContent>
                <TabsContent value="signin">
                    <form onSubmit={handleLogin} className="">
                        <SparklesText text="Welcome" className=" text-center" />
                        <h2 className="text-center text-2xl font-bold mb-6">Join Us!</h2>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <a className=" text-xs text-right mb-6">Forgot password ?</a>
                        <Button type="submit">Submit</Button>
                    </form>
                </TabsContent>
            </Tabs>
            <div className="w-1/2 bg-red-200 h-full"></div>
        </section>
    )
}
