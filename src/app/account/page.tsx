"use client";

import AvatarUpload from "@/components/avatar";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { User } from "@/types/User";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
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
    const router = useRouter();

    const { user, logout } = useAuth();
    const [dataUser, setDataUser] = useState<User | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [isLoading, setIsLoading] = useState(true)
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true)
            if (user) {
                try {
                    const res = await fetch(`/api/users/${user.userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await res.json();
                    setDataUser(data);
                    setEmail(data.email);
                    setUsername(data.username);
                    setName(data.name);
                    setSurname(data.surname);
                    setAvatarUrl(data.avatar);
                    setIsLoading(false)
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleSetUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length < 20)
            setUsername(e.target.value.replace(/\s+/g, '_'));
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
        setIsUpdateLoading(true);

        let uploadedAvatarUrl = avatarUrl;

        if (selectedFile) {
            const fileRef = ref(storage, `avatars/${dataUser?._id}/${selectedFile.name}`);
            await uploadBytes(fileRef, selectedFile);
            uploadedAvatarUrl = await getDownloadURL(fileRef);
            setAvatarUrl(uploadedAvatarUrl);
        }

        if (newpassword != '' && newpassword != confirmpassword) {
            toast({
                variant: 'destructive',
                title: "Vos mots de passe ne correspondent pas."
            })
            setIsUpdateLoading(false);
            return;
        }

        const res = await fetch('/api/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: dataUser?._id, username: username, email: email, name: name, surname: surname, avatarUrl: uploadedAvatarUrl, password: newpassword }),
        });

        if (res.ok) {
            const data: User = await res.json();
            setDataUser(data);
            toast({
                title: "Votre compte a bien été mis à jour."
            })
            setIsUpdateLoading(false);
            console.log('Updated successfully');
        } else {
            console.error('Error updating user');
            setIsUpdateLoading(false);
        }
    };

    const handleDeleteUser = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const res = await fetch('/api/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: dataUser?._id, flag: false })
        });

        if (res.ok) {
            logout();
            toast({
                title: "Votre compte à bien été supprimé."
            })
            router.push('/login')
        } else {
            console.error('Error updating user');
        }
    };

    if (isLoading) {
        return (
            <Loading />
        )
    } else {
        return (
            <section className="flex justify-center items-center flex-col mt-10">
                <form autoComplete="off" onSubmit={handleUser} className="max-sm:w-11/12 w-5/12 space-y-10">
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
                    <div className="space-y-6 max-sm:space-y-4">
                        <div className="flex max-sm:flex-col justify-between max-sm:gap-4 sm:gap-10">
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="email">Email</Label>
                                <Input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="account-username">Username</Label>
                                <Input autoComplete="off" type="text" id="account-username" name="account-username" placeholder="Username" value={username} onChange={handleSetUsername} />
                            </div>
                        </div>
                        <div className="flex max-sm:flex-col justify-between max-sm:gap-4 sm:gap-10">
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="surname">Surname</Label>
                                <Input type="text" id="surname" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex max-sm:flex-col justify-between max-sm:gap-4 sm:gap-10">
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="newpass">New password</Label>
                                <Input autoComplete="new-password" type="password" id="newpass" placeholder="New password" value={newpassword} onChange={(e) => setNewpassword(e.target.value)} />
                            </div>
                            <div className="w-1/2 max-sm:w-full">
                                <Label htmlFor="newpassconfirm">Confirm password</Label>
                                <Input autoComplete="new-password" type="password" id="newpassconfirm" placeholder="Confirm password" value={confirmpassword} onChange={(e) => setConfirmpassword(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button type="submit">{isUpdateLoading ? (
                            <svg className="animate-spin h-full w-full" viewBox="0 0 24 24">
                                <LoaderCircle />
                            </svg>
                        ) : 'Save'}</Button>
                        <Button variant={"link"} className="ml-4" onClick={(e) => handleDeleteUser(e)}>Delete account</Button>
                    </div>
                </form>
            </section>
        );
    }


}
