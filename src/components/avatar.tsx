import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface AvatarUploadProps {
    avatarUrl?: string;
    onFileSelect?: (file: File | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, onFileSelect }) => {
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLocalAvatarUrl(URL.createObjectURL(file));
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    return (
        <div className="avatar-upload">
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <Image
                width={200}
                height={200}
                alt='avatar'
                src={localAvatarUrl || avatarUrl || ''}
                className="rounded-full aspect-square object-cover cursor-pointer hover:opacity-70"
                onClick={() => fileInputRef.current?.click()}
            />
        </div>
    );
};

export default AvatarUpload;
