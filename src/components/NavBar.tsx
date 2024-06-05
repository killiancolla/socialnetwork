"use client";

import Image from "next/image";
import ModeToggle from "./ModeToggle";
import SettingIcon from "./icons/SettingIcon";
import UserIcon from "./icons/UserIcon";
import { Input } from "./ui/input";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from 'next/navigation'; // Utilisation de useNavigation

export default function NavBar() {

    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="bg-secondary h-14 flex items-center justify-around">
            <a href="/">
                <Image
                    src='/logo.svg'
                    width={50}
                    height={50}
                    alt="logo"
                />
            </a>
            {isAuthenticated ? (
                <>
                    <div className=" space-x-4">
                        <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/">Home</a>
                        <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/friends">Friends list</a>
                    </div>
                    <Input className="w-1/3 bg-primary border-0" placeholder="Search friend" />
                </>
            ) : ''}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        <SettingIcon />
                    </>
                ) :
                    <a href="/login">
                        <UserIcon />
                    </a>
                }
                <ModeToggle />
            </div>
        </div>
    )
}