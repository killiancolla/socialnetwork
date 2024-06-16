"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";
import { User as UserType } from "@/types/User";
import { CircleUser, LogOut, Search, User } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import ModeToggle from "./ModeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function NavBar() {

    const { isAuthenticated, user, logout } = useAuth();
    const [dataUser, setDataUser] = useState<UserType | null>(null);

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
                    console.log(data);

                    setDataUser(data);
                } else {
                    console.error('Error fetching user data');
                }
            }
        };

        fetchUserData();
    }, [user]);

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            <div className=" sm:hidden relative bg-secondary h-14 flex items-center justify-between px-14">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <img
                            className="h-10 rounded-full aspect-square object-cover"
                            src={dataUser?.avatar}
                            alt="logo"
                        />
                        {/* <Button variant={"default"} size="icon" className=" bg-transparent hover:bg-transparent relative flex items-center justify-center h-6 w-6 focus-visible:ring-0 focus-visible:ring-offset-0 "><User className=" text-foreground" /></Button> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <a href="/account" className="">
                            <DropdownMenuItem>
                                <CircleUser className="mr-2 h-4 w-4" />
                                <span>Update account</span>
                            </DropdownMenuItem>
                        </a>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <a href="/" className=" absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Image
                        src='/logo.svg'
                        width={50}
                        height={50}
                        alt="logo"
                    />
                </a>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Search />
                        </>
                    ) :
                        <a href="/login">
                            <User />
                        </a>
                    }
                    <ModeToggle />
                </div>
            </div>
            <div className=" max-sm:hidden relative bg-secondary h-14 flex items-center justify-between px-14">
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
                        <div className="space-x-4">
                            <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/">Home</a>
                            <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/friends">Friends list</a>
                        </div>
                        <Input className="text-input w-1/3 bg-card-foreground border-0" placeholder="Search friend" />
                    </>
                ) : ''}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Search />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={"default"} size="icon" className=" bg-transparent hover:bg-transparent relative flex items-center justify-center h-6 w-6 focus-visible:ring-0 focus-visible:ring-offset-0 "><User className=" text-foreground" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <a href="/account" className="">
                                        <DropdownMenuItem>
                                            <CircleUser className="mr-2 h-4 w-4" />
                                            <span>Update account</span>
                                        </DropdownMenuItem>
                                    </a>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) :
                        <a href="/login">
                            <User />
                        </a>
                    }
                    <ModeToggle />
                </div>
            </div>
        </>
    )

    return (
        <div className="relative bg-secondary h-14 flex items-center justify-between px-14">
            <a href="/" className="">
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
                    <Input className=" text-input w-1/3 bg-card-foreground border-0" placeholder="Search friend" />
                </>
            ) : ''}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"default"} size="icon" className=" bg-transparent hover:bg-transparent relative flex items-center justify-center h-6 w-6 focus-visible:ring-0 focus-visible:ring-offset-0 "><User className=" text-foreground" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <a href="/account" className="">
                                    <DropdownMenuItem>
                                        <CircleUser className="mr-2 h-4 w-4" />
                                        <span>Update account</span>
                                    </DropdownMenuItem>
                                </a>
                                <DropdownMenuItem onClick={handleLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) :
                    <a href="/login">
                        <User />
                    </a>
                }
                <ModeToggle />
            </div>
        </div>
    )
}