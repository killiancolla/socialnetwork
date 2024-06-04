"use client";

import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const HandleLogout = () => {
    const router = useRouter();

    useEffect(() => {
        Cookies.remove('token');
        router.push('/login');
    }, [router]);

    return null;
};

export default HandleLogout;
