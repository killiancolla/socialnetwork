"use client";

import AvatarUpload from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { User } from "@/types/User";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useRef, useState } from "react";
import { storage } from '../../../firebase';

export default function Account() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

    const { user } = useAuth();
    const [dataUser, setDataUser] = useState<User | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const res = await fetch(`/api/users/${user.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setDataUser(data);
                    setEmail(data.email);
                    setUsername(data.username);
                    setName(data.name);
                    setSurname(data.surname);
                    setAvatarUrl(data.avatar);
                } else {
                    console.error('Error fetching user data');
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length < 20)
            setUsername(e.target.value.replace(/\s+/g, ''));
    };

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setLocalAvatarUrl(fileUrl);
        } else {
            setLocalAvatarUrl(null);
        }
    };

    const handleUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let uploadedAvatarUrl = avatarUrl;

        if (selectedFile) {
            const fileRef = ref(storage, `avatars/${dataUser?._id}/${selectedFile.name}`);
            await uploadBytes(fileRef, selectedFile);
            uploadedAvatarUrl = await getDownloadURL(fileRef);
            setAvatarUrl(uploadedAvatarUrl);
        }

        const res = await fetch('/api/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: dataUser?._id, username: username, email: email, name: name, surname: surname, avatarUrl: uploadedAvatarUrl }),
        });

        if (res.ok) {
            const data: User = await res.json();
            setDataUser(data);
            console.log('Updated successfully');
        } else {
            console.error('Error updating user');
        }
    };

    return (
        <section className="flex justify-center items-center flex-col mt-10">
            <form onSubmit={handleUser} className="w-5/12 space-y-10">
                <div className="flex flex-row gap-10">
                    {user && dataUser?._id.toString() && (
                        <>
                            <AvatarUpload
                                avatarUrl={avatarUrl}
                                onFileSelect={handleFileSelect}
                            />
                        </>
                    )}
                    <div className="flex items-start flex-col justify-center">
                        <h2 className="font-bold">@{username}</h2>
                        <h2>Member since 5 days</h2>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex justify-between gap-10">
                        <div className="w-1/2">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="username">Username</Label>
                            <Input type="text" id="username" placeholder="Username" value={username} onChange={handleSetUsername} />
                        </div>
                    </div>
                    <div className="flex justify-between gap-10">
                        <div className="w-1/2">
                            <Label htmlFor="name">Name</Label>
                            <Input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="surname">Surname</Label>
                            <Input type="text" id="surname" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-between gap-10">
                        <div className="w-1/2">
                            <Label htmlFor="newpass">New password</Label>
                            <Input type="password" id="newpass" placeholder="New password" value={newpassword} onChange={(e) => setNewpassword(e.target.value)} />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="newpassconfirm">Confirm password</Label>
                            <Input type="password" id="newpassconfirm" placeholder="Confirm password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} />
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit</Button>
            </form>
        </section>
    );
}
