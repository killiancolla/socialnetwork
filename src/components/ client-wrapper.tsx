"use client";

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ClientWrapperProps {
    children: ReactNode;
}

const ClientWrapper = ({ children }: ClientWrapperProps) => {
    const pathname = usePathname();
    const isFullScreenPage = pathname === '/login';

    return (
        <div className={isFullScreenPage ? "flex flex-col h-screen" : ""}>
            {children}
        </div>
    );
};

export default ClientWrapper;
