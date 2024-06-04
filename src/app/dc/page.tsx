"use client"

import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function handleLogout() {

    const router = useRouter();

    useEffect(() => {
        Cookies.remove('token');
        router.push('/login');
    }, [])
};